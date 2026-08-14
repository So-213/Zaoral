import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/api-helpers';
import { updateUserPlan } from '@/lib/services/account-service';

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

    const result = await updateUserPlan(userId, plan);
    if (result instanceof NextResponse) {
      return result;
    }

    return NextResponse.json(result, { status: 200 });
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
