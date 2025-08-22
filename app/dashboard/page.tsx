import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ようこそ、{session!.user?.name} さん！
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
              <h3 className="font-semibold text-gray-700 mb-2">最近の作成物</h3>
              <p className="text-gray-500 text-sm">まだ作成物がありません</p>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">統計</h3>
              <p className="text-gray-500 text-sm">作成数: 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
