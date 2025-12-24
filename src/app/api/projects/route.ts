import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, handleApiError, validateRequired, checkProjectOwnership } from '@/lib/api-helpers';
import { DEFAULT_LEFT_PROJECTS } from '@/lib/config';
import { deleteImageFromS3 } from '@/lib/s3';



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, type, name } = body;

    // 認証チェック
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { userId, userName } = authResult;

    // バリデーション
    const slugValidation = validateRequired(slug, 'スラッグ');
    if (slugValidation) return slugValidation;

    const typeValidation = validateRequired(type, 'プロジェクトタイプ');
    if (typeValidation) return typeValidation;

    const nameValidation = validateRequired(name, 'プロジェクト名');
    if (nameValidation) return nameValidation;

    // 有効なプロジェクトタイプかチェック（picture型は廃止のため無効化）
    // const validTypes = ['message', 'picture'];
    const validTypes = ['message']; // picture型は廃止
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `無効なプロジェクトタイプです。有効なタイプ: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const projectType = type as 'message' | 'picture';

    // タイプに応じたバリデーションとデータ取得
    let message: string | undefined;
    // let s3Key: string | undefined; // picture型は廃止のため無効化

    if (projectType === 'message') {
      message = body.message;
      const messageValidation = validateRequired(message, 'メッセージ');
      if (messageValidation) return messageValidation;
    }
    // picture型は廃止のため無効化
    // else if (projectType === 'picture') {
    //   s3Key = body.s3Key;
    //   const s3KeyValidation = validateRequired(s3Key, 'S3キー');
    //   if (s3KeyValidation) return s3KeyValidation;
    // }

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
    const savedProject = await prisma.$transaction(async (tx) => {
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
      if (projectType === 'message') {
        projectData.projectMessage = {
          create: {
            message: message,
          },
        };
      }
      // picture型は廃止のため無効化
      // else if (projectType === 'picture') {
      //   projectData.projectPicture = {
      //     create: {
      //       s3_key: s3Key,
      //     },
      //   };
      // }

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
    return handleApiError(error, 'プロジェクト作成エラー', 'プロジェクトの作成に失敗しました');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { userId } = authResult;

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    // バリデーション
    const projectIdValidation = validateRequired(projectId, 'プロジェクトID');
    if (projectIdValidation) return projectIdValidation;

    // プロジェクトの所有者権限をチェック
    const ownershipResult = await checkProjectOwnership(projectId!, userId, prisma);
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

    // pictureタイプの場合はS3から画像を削除
    // messageタイプの場合はSupabaseのみなので特別な処理不要（Cascade削除で自動削除される）
    if ((project.type as string) === 'picture' && project.projectPicture?.s3_key) {
      await deleteImageFromS3(project.projectPicture.s3_key);
    }

    // プロジェクトを削除（Cascadeにより関連するProjectMessage/ProjectPictureも削除される）
    await prisma.project.delete({
      where: {
        id: projectId!,
      },
    });

    return NextResponse.json({ message: 'プロジェクトが正常に削除されました' });
  } catch (error) {
    return handleApiError(error, 'プロジェクト削除エラー', 'プロジェクトの削除に失敗しました');
  }
}
