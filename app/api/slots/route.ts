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

    const savedSlot = await prisma.slot.create({
      data: {
        user_id: session.user.id,
        user_name: userName,
        slug,
        message,
        expires_at: expiresAt,
      },
    });

    return NextResponse.json(savedSlot, { status: 201 });
  } catch (error) {
    console.error('Slot creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create slot' },
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

    // ユーザー固有のスロットを取得
    const slots = await prisma.slot.findMany({
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

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Slot fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slots' },
      { status: 500 }
    );
  }
}
