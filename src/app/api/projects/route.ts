import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  requireAuth,
  handleApiError,
  validateRequired,
} from '@/lib/api-helpers';
import {
  checkProjectOwnership,
  validateProjectType,
  validateAndExtractProjectTypeData,
  buildProjectTypeData,
  handleProjectTypeDelete
} from '@/lib/services/project-service';
import { DEFAULT_LEFT_PROJECTS } from '@/lib/config';



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, type, name } = body;

    // 認証チェック
    const { userId, userName } = await requireAuth();

    // バリデーション
    const slugValidation = validateRequired(slug, 'スラッグ');
    if (slugValidation) return slugValidation;

    const typeRequiredValidation = validateRequired(type, 'プロジェクトタイプ');
    if (typeRequiredValidation) return typeRequiredValidation;

    const nameValidation = validateRequired(name, 'プロジェクト名');
    if (nameValidation) return nameValidation;

    // 有効なプロジェクトタイプかチェック
    const typeValidation = validateProjectType(type);
    if (typeValidation) return typeValidation;

    const projectType = type as 'message' | 'picture';

    // タイプに応じたバリデーションとデータ抽出
    const typeDataResult = validateAndExtractProjectTypeData(projectType, body);
    if (typeDataResult.error) {
      return typeDataResult.error;
    }

    // ユーザーのleft_projects（残機）を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    const userPlan = (user as any).plan;
    const isPremium = userPlan === 'PREMIUM';
    const leftProjects = (user as any).left_projects ?? DEFAULT_LEFT_PROJECTS;

    // 残機チェック（プレミアムプラン以外で、残機が0以下なら作成不可）
    if (!isPremium && leftProjects <= 0) {
      return NextResponse.json(
        { error: 'プロジェクトの作成残機がありません。' },
        { status: 403 }
      );
    }

    // 有効期限を31日後に設定
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 31);

    // トランザクションでプロジェクト作成と残機減算を同時に実行
    const savedProject = await prisma.$transaction(async (tx) => {  // txとは、複数の処理を同じトランザクションとして扱うためのprisma clientのこと
      // プロジェクトを作成
      const projectData: any = {
        user_id: userId,
        user_name: userName,
        type: projectType,
        slug,
        name,
        expires_at: expiresAt,
      };

      // タイプに応じて関連データを作成
      const typeSpecificData = buildProjectTypeData(projectType, typeDataResult.data);
      Object.assign(projectData, typeSpecificData);

      const project = await tx.project.create({
        data: projectData,
        include: {
          projectMessage: true,
          projectPicture: true,
        },
      });

      // 残機を1減らす（プレミアムプランの場合は減らさない）
      if (!isPremium) {
        const currentLeftProjects = (user as any).left_projects ?? DEFAULT_LEFT_PROJECTS;
        await tx.user.update({
          where: { id: userId },
          data: {
            left_projects: Math.max(0, currentLeftProjects - 1),
          } as any,
        });
      }

      return project;
    });

    return NextResponse.json(savedProject, { status: 201 });
  } catch (error) {
    // 認証エラーの場合は401を返す
    if (error instanceof Error && error.message === '認証が必要です') {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    return handleApiError(error, 'プロジェクト作成エラー', 'プロジェクトの作成に失敗しました');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 認証チェック
    const { userId } = await requireAuth();

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    // バリデーション
    const projectIdValidation = validateRequired(projectId, 'プロジェクトID');
    if (projectIdValidation) return projectIdValidation;

    // プロジェクトの所有者権限をチェック
    const ownershipResult = await checkProjectOwnership(projectId!, userId);
    if (ownershipResult instanceof NextResponse) {
      return ownershipResult;
    }

    // pictureタイプは削除時にprojects_pictureのS3キーが必要
    const project = await prisma.project.findUnique({
      where: { id: projectId! },
      include: {
        projectPicture: true, // プロジェクトに紐づけられているprojectPictureレコードがあればそれを取得
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }

    // タイプ固有の削除処理を実行（例: pictureタイプのS3削除など）
    await handleProjectTypeDelete(project.type as string, project);

    // プロジェクトを削除（Cascadeにより関連するProjectMessage/ProjectPictureも削除される）
    await prisma.project.delete({
      where: {
        id: projectId!,
      },
    });

    return NextResponse.json({ message: 'プロジェクトが正常に削除されました' });
  } catch (error) {
    // 認証エラーの場合は401を返す
    if (error instanceof Error && error.message === '認証が必要です') {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    return handleApiError(error, 'プロジェクト削除エラー', 'プロジェクトの削除に失敗しました');
  }
}
