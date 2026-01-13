import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * 認証チェック用のヘルパー関数
 * @returns 認証されたユーザー情報とセッション情報
 * @throws 認証されていない場合はエラーを投げる
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('認証が必要です');
  }
  
  return {
    session,
    userId: session.user.id,
    userName: session.user.name || session.user.email || "Anonymous"
  };
}

/**
 * 統一されたエラーハンドリング用のヘルパー関数
 * @param error エラーオブジェクト
 * @param context エラーが発生したコンテキスト（ログ用）
 * @param userMessage ユーザー向けエラーメッセージ
 * @returns NextResponse
 */
export function handleApiError(
  error: unknown,
  context: string,
  userMessage: string = 'サーバーエラーが発生しました'
): NextResponse {
  console.error(`${context}:`, error);
  
  return NextResponse.json(
    { error: userMessage },
    { status: 500 }
  );
}

/**
 * バリデーション用のヘルパー関数
 * @param value 検証する値
 * @param fieldName フィールド名
 * @returns バリデーションエラーレスポンスまたはnull
 */
export function validateRequired(
  value: unknown,
  fieldName: string
): NextResponse | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return NextResponse.json(
      { error: `${fieldName}が必要です` },
      { status: 400 }
    );
  }
  return null;
}

/**
 * プロジェクトの所有者権限をチェックするヘルパー関数
 * @param projectId プロジェクトID
 * @param userId ユーザーID
 * @param prisma Prismaクライアント
 * @returns プロジェクト情報または404エラーレスポンス
 */
export async function checkProjectOwnership(
  projectId: string,
  userId: string,
  prisma: any
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      user_id: userId,
    },
  });

  if (!project) {
    return NextResponse.json(
      { error: 'プロジェクトが見つからないか、削除権限がありません' },
      { status: 404 }
    );
  }

  return project;
}
