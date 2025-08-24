import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { projectId } = await request.json();

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
      return NextResponse.json({ error: 'プロジェクトが見つかりません' }, { status: 404 });
    }

    // プロジェクトを公開状態に更新
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        published: true,
      },
    });

    return NextResponse.json({ 
      success: true, 
      project: updatedProject 
    });

  } catch (error) {
    console.error('プロジェクト公開エラー:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
