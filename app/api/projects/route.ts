import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma-with-rls';



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

    // デバッグ用：セッションのユーザーIDをログに出力
    // console.log('Session user ID:', session.user.id);
    // console.log('Session user:', session.user);

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
        message,
        expires_at: expiresAt,
        published: false,
      },
    });

    // バックエンドサーバーのURL（環境変数から取得、デフォルトはlocalhost）
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

    // バックエンドサーバーにプロジェクト作成を通知
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/projects/create`, {
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
            message: savedProject.message,
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
