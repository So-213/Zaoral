/**
 * アプリケーション設定
 */
export const config = {
  // プロジェクト表示用のURL（外部からアクセスするURL）
  projectDisplayUrl: process.env.NEXT_PUBLIC_PROJECT_DISPLAY_URL || 'http://mipzrl.vercel.app',
} as const;

/**
 * プロジェクトURLを生成する関数
 */
export function generateProjectUrl(slug: string): string {
  return `${config.projectDisplayUrl}/p/${slug}`;
}
