import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 期限切れプロジェクトのクリーンアップ処理
 * expires_atから31日経過したプロジェクトを削除する
 * 
 * このエンドポイントはVercel Cronから月1回呼び出される
 * 認証はVercel CronのAuthorizationヘッダーで行う
 */
export async function GET(request: NextRequest) {
  try {
    // Vercel Cronからのリクエストか確認
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 現在時刻から31日前の日時を計算
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);

    // expires_atが31日前以前のプロジェクトを削除
    // Cascadeにより関連するProjectMessageも自動削除される
    const result = await prisma.project.deleteMany({
      where: {
        expires_at: {
          lte: thirtyOneDaysAgo,
        },
      },
    });

    console.log(`期限切れプロジェクトの削除が完了しました。削除件数: ${result.count}`);

    return NextResponse.json({
      message: '期限切れプロジェクトの削除が完了しました',
      deletedCount: result.count,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('期限切れプロジェクトの削除エラー:', error);
    return NextResponse.json(
      {
        error: '期限切れプロジェクトの削除に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

