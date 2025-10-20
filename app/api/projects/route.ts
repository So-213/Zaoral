import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma-with-rls';
import { config } from '@/lib/config';



export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, message } = body;

    // 認証セッションを取得
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userName = session.user.name || session.user.email || "Anonymous";

    // 有効期限を31日後に設定
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 31);

    // db保存
    const savedProject = await prisma.project.create({
      data: {
        user_id: session.user.id,
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

    // バックエンドサーバーにプロジェクト作成を通知
    try {
      const backendResponse = await fetch(`${config.backendUrl}/api/projects/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: savedProject.id,
          projectData: {
            id: savedProject.id,
            user_id: savedProject.user_id,
            user_name: savedProject.user_name,
            slug: savedProject.slug,
            message: savedProject.projectMessage?.message,
            created_at: savedProject.created_at,
            expires_at: savedProject.expires_at,
            published: savedProject.published
          }
        }),
      });

      if (!backendResponse.ok) {
        console.error('バックエンドサーバーへの通知に失敗:', backendResponse.statusText);
      } else {
        console.log('バックエンドサーバーにプロジェクト作成通知を送信しました');
      }
    } catch (error) {
      console.error('バックエンドサーバーへの通知エラー:', error);
      // バックエンドへの通知が失敗しても、フロントエンドの処理は続行
    }

    return NextResponse.json(savedProject, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // ユーザーのプロジェクトを取得
    const userProjects = await prisma.project.findMany({
      where: {
        user_id: session.user.id,
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
    console.error('プロジェクト取得エラー:', error);
    return NextResponse.json({ error: 'プロジェクトの取得に失敗しました' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json({ error: 'プロジェクトIDが必要です' }, { status: 400 });
    }

    // プロジェクトが存在し、ユーザーが所有者であることを確認
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user_id: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'プロジェクトが見つからないか、削除権限がありません' }, { status: 404 });
    }

    // プロジェクトを削除（Cascadeにより関連するProjectMessageも削除される）
    await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    // バックエンドサーバーにプロジェクト削除を通知
    // try {
    //   const backendResponse = await fetch(`${config.backendUrl}/api/projects/delete`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       projectId: projectId,
    //     }),
    //   });

    //   if (!backendResponse.ok) {
    //     console.error('バックエンドサーバーへの削除通知に失敗:', backendResponse.statusText);
    //   } else {
    //     console.log('バックエンドサーバーにプロジェクト削除通知を送信しました');
    //   }
    // } catch (error) {
    //   console.error('バックエンドサーバーへの削除通知エラー:', error);
    //   // バックエンドへの通知が失敗しても、フロントエンドの処理は続行
    // }

    return NextResponse.json({ message: 'プロジェクトが正常に削除されました' });
  } catch (error) {
    console.error('プロジェクト削除エラー:', error);
    return NextResponse.json({ error: 'プロジェクトの削除に失敗しました' }, { status: 500 });
  }
}
