import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    console.log('Session user ID:', session.user.id);
    console.log('Session user:', session.user);

    const userName = session.user.name || session.user.email || "Anonymous";

    // 有効期限を24時間後に設定
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const savedProject = await prisma.project.create({
      data: {
        user_id: session.user.id,
        user_name: userName,
        slug,
        message,
        expires_at: expiresAt,
        published: false,
      },
    });

    return NextResponse.json(savedProject, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 認証セッションを取得
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // ユーザー固有のプロジェクトを取得
    const projects = await prisma.project.findMany({
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

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
