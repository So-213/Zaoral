import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, handleApiError } from '@/lib/api-helpers';

/**
 * ユーザーのプランを変更するAPIエンドポイント
 * PUT /api/account/plan
 */
export async function PUT(request: NextRequest) {
  try {
    // 認証チェック
    const { userId } = await requireAuth();

    // リクエストボディから新しいプランを取得
    const body = await request.json();
    const { plan } = body;

    // プランのバリデーション
    if (!plan || (plan !== 'FREE' && plan !== 'PREMIUM')) {
      return NextResponse.json(
        { error: '無効なプランです。FREEまたはPREMIUMを指定してください。' },
        { status: 400 }
      );
    }

    // 現在のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // 既に同じプランの場合はエラーを返す
    if ((user as any).plan === plan) {
      return NextResponse.json(
        { error: `既に${plan === 'FREE' ? 'Free' : 'Premium'}プランです` },
        { status: 400 }
      );
    }

    // プランを更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: plan as 'FREE' | 'PREMIUM',
      },
    });

    return NextResponse.json(
      { 
        message: `プランを${plan === 'FREE' ? 'Free' : 'Premium'}に変更しました`,
        plan: (updatedUser as any).plan 
      },
      { status: 200 }
    );
  } catch (error) {
    // 認証エラーの場合は401を返す
    if (error instanceof Error && error.message === '認証が必要です') {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }
    return handleApiError(error, 'プラン変更エラー', 'プランの変更に失敗しました');
  }
}

