export default function DebugPage() {
  // AWS認証情報の最初の数文字を表示（セキュリティのため）
  const maskKey = (key: string | undefined) => {
    if (!key) return '未設定';
    if (key.length <= 8) return key.substring(0, 4) + '****';
    return key.substring(0, 8) + '...';
  };

  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID ? '設定済み' : '未設定',
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET ? '設定済み' : '未設定',
    AUTH_LINE_CLIENT_ID: process.env.AUTH_LINE_CLIENT_ID ? '設定済み' : '未設定',
    AUTH_LINE_CLIENT_SECRET: process.env.AUTH_LINE_CLIENT_SECRET ? '設定済み' : '未設定',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '設定済み' : '未設定',
    DATABASE_URL: process.env.DATABASE_URL ? '設定済み' : '未設定',
    DIRECT_URL: process.env.DIRECT_URL ? '設定済み' : '未設定',
    // AWS認証情報
    AWS_ACCESS_KEY_ID: maskKey(process.env.AWS_ACCESS_KEY_ID),
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '設定済み' : '未設定',
    AWS_REGION: process.env.AWS_REGION || '未設定',
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || '未設定',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">環境変数デバッグ</h1>
          
          <div className="space-y-4">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-mono text-sm">{key}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  value === '設定済み' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-blue-800 mb-2">必要な環境変数</h2>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• AUTH_GOOGLE_CLIENT_ID: Google OAuthのクライアントID</li>
              <li>• AUTH_GOOGLE_CLIENT_SECRET: Google OAuthのクライアントシークレット</li>
              <li>• NEXTAUTH_SECRET: NextAuthのシークレットキー</li>
              <li>• DATABASE_URL: Prismaのデータベース接続URL</li>
              <li>• DIRECT_URL: Prismaの直接接続URL（Vercel用）</li>
              <li>• AWS_ACCESS_KEY_ID: dev-zaoral-app-runtimeユーザーのアクセスキーID</li>
              <li>• AWS_SECRET_ACCESS_KEY: dev-zaoral-app-runtimeユーザーのシークレットアクセスキー</li>
              <li>• AWS_REGION: AWSリージョン（例: ap-northeast-1）</li>
              <li>• S3_BUCKET_NAME: S3バケット名</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h2 className="font-semibold text-yellow-800 mb-2">⚠️ AWS認証情報の確認</h2>
            <p className="text-sm text-yellow-700 mb-2">
              <code className="bg-yellow-100 px-2 py-1 rounded">dev-zaoral-app-runtime</code> ユーザーの認証情報を使用していることを確認してください。
            </p>
            <p className="text-sm text-yellow-700">
              Terraformの出力から取得: <code className="bg-yellow-100 px-2 py-1 rounded">cd terraform && terraform output runtime_access_key_id</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
