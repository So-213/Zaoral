import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * ユーザーのプランを更新する
 * バリデーション・ユーザー存在チェック・同一プランチェック・プラン更新を内包する
 * @returns 成功時はメッセージとプラン、失敗時はエラー用のNextResponse
 */
export async function updateUserPlan(
  userId: string,
  plan: string
): Promise<NextResponse | { message: string; plan: string }> {
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

  return {
    message: `プランを${plan === 'FREE' ? 'Free' : 'Premium'}に変更しました`,
    plan: (updatedUser as any).plan,
  };
}
