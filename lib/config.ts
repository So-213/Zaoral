/**
 * アプリケーション設定
 */
export const config = {
  // フロントエンドのベースURL
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  
  // バックエンドのベースURL
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  
  // プロジェクト表示用のURL（外部からアクセスするURL）
  projectDisplayUrl: process.env.NEXT_PUBLIC_PROJECT_DISPLAY_URL || 'http://mipzrl.vercel.app',
} as const;

/**
 * プロジェクトURLを生成する関数
 */
export function generateProjectUrl(slug: string): string {
  return `${config.projectDisplayUrl}/p/${slug}`;
}
