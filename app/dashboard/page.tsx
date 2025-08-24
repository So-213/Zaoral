import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h1>
          <Link 
            href="/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ログイン
          </Link>
        </div>
      </div>
    );
  }

  // ユーザーのプロジェクト（スロット）を取得
  const userSlots = await prisma.slot.findMany({
    where: {
      user_id: session.user.id,
      expires_at: {
        gt: new Date(),
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  // 統計情報を計算
  const totalCreated = userSlots.length;
  const totalPublished = userSlots.filter(slot => slot.expires_at > new Date()).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 上部セクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ようこそ、{session.user.name || session.user.email} さん！
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/create"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規作成
            </Link>
                        
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">統計</h3>
              <p className="text-gray-500 text-sm">作成数: {totalCreated}</p>
              <p className="text-gray-500 text-sm">公開中: {totalPublished}</p>
            </div>
          </div>
        </div>

        {/* 下部セクション - プロジェクトリストと詳細表示 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* プロジェクトリスト（左側） */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">プロジェクト一覧</h2>
              
              {userSlots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">まだプロジェクトがありません</p>
                  <Link 
                    href="/create"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    最初のプロジェクトを作成
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {userSlots.map((slot, index) => (
                    <div 
                      key={slot.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">
                            プロジェクト{userSlots.length - index}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {slot.message.length > 50 
                              ? `${slot.message.substring(0, 50)}...` 
                              : slot.message
                            }
                          </p>
                          <div className="flex items-center text-xs text-gray-400">
                            <span>作成日: {new Date(slot.created_at).toLocaleDateString('ja-JP')}</span>
                            <span className="mx-2">•</span>
                            <span>有効期限: {new Date(slot.expires_at).toLocaleDateString('ja-JP')}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            アクティブ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* プロジェクト詳細表示エリア（右側） */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">プロジェクト詳細</h2>
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  プロジェクトがタップされたら<br />
                  ここにプロジェクト情報を表示
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
