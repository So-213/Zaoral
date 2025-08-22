export default function DebugPage() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_GOOGLE_CLIENT_ID: process.env.AUTH_GOOGLE_CLIENT_ID ? '設定済み' : '未設定',
    AUTH_GOOGLE_CLIENT_SECRET: process.env.AUTH_GOOGLE_CLIENT_SECRET ? '設定済み' : '未設定',
    AUTH_LINE_CLIENT_ID: process.env.AUTH_LINE_CLIENT_ID ? '設定済み' : '未設定',
    AUTH_LINE_CLIENT_SECRET: process.env.AUTH_LINE_CLIENT_SECRET ? '設定済み' : '未設定',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '設定済み' : '未設定',
    DATABASE_URL: process.env.DATABASE_URL ? '設定済み' : '未設定',
    DIRECT_URL: process.env.DIRECT_URL ? '設定済み' : '未設定',
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
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
