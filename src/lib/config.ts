/**
 * アプリケーション設定
 */
export const config = {
  // プロジェクト表示用のURL（外部からアクセスするURL）
  projectDisplayUrl: process.env.NEXT_PUBLIC_PROJECT_DISPLAY_URL || 'https://mipzrl.vercel.app',
} as const;

/**
 * デフォルトのプロジェクト作成残機数
 */
export const DEFAULT_LEFT_PROJECTS = 3;

/**
 * プロジェクトURLを生成する関数
 */
export function generateProjectUrl(slug: string): string {
  return `${config.projectDisplayUrl}/p/${slug}`;
}
