import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, handleApiError, validateRequired, checkProjectOwnership } from '@/lib/api-helpers';
import { DEFAULT_LEFT_PROJECTS } from '@/lib/config';



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, message } = body;

    // 認証チェック
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { userId, userName } = authResult;

    // バリデーション
    const slugValidation = validateRequired(slug, 'スラッグ');
    if (slugValidation) return slugValidation;

    const messageValidation = validateRequired(message, 'メッセージ');
    if (messageValidation) return messageValidation;

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
      const project = await tx.project.create({
        data: {
          user_id: userId,
          user_name: userName,
          type: 'message', // 明示的に指定
          slug,
          expires_at: expiresAt,
          published: false,
          projectMessage: {
            create: {
              message: message,
            },
          },
        },
        include: {
          projectMessage: true,
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

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { userId } = authResult;

    // ユーザーのプロジェクトを取得
    const userProjects = await prisma.project.findMany({
      where: {
        user_id: userId,
        expires_at: {
          gt: new Date(),
        },
      },
      include: {
        projectMessage: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({ projects: userProjects });
  } catch (error) {
    return handleApiError(error, 'プロジェクト取得エラー', 'プロジェクトの取得に失敗しました');
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

    // プロジェクトを削除（Cascadeにより関連するProjectMessageも削除される）
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
