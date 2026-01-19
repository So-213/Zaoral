import Link from "next/link";
import { UserInfo, Project } from "@/types/dashboard";
import { DEFAULT_LEFT_PROJECTS } from "@/lib/config";

interface UserInfoSectionProps {
  user: UserInfo;
  userProjects: Project[];
}

export default function UserInfoSection({ user, userProjects }: UserInfoSectionProps) {
  const isPremium = user.plan === 'PREMIUM';
  const leftProjects = user.left_projects;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        ようこそ、{user.name || user.email} さん！
      </h1>
      
      <div className={`mb-4 p-4 border rounded-lg ${
        isPremium 
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            {isPremium ? (
              <>
                <p className="text-orange-800 text-sm font-medium mb-1">
                  プレミアムプラン: プロジェクト作成に制限はありません
                </p>
                <p className="text-orange-700 text-sm">
                  今まで作成したプロジェクト数: <span className="font-semibold">{userProjects.length}個</span>
                </p>
              </>
            ) : (
              <>
                <p className="text-blue-800 text-sm font-medium mb-1">
                  プロジェクトは最大{DEFAULT_LEFT_PROJECTS}つまで作ることができます。
                </p>
                <p className="text-blue-700 text-sm">
                  今まで作成したプロジェクト数: <span className="font-semibold">{DEFAULT_LEFT_PROJECTS-leftProjects}個</span>
                  {leftProjects > 0 && (
                    <span className="ml-2">（残り: <span className="font-semibold">{leftProjects}個</span>）</span>
                  )}
                </p>
              </>
            )}
          </div>
          {!isPremium && leftProjects <= 0 && (
            <span className="text-red-600 font-semibold text-sm">⚠️ 上限に達しています</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          href="/create"
          className={`font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center text-lg ${
            !isPremium && leftProjects <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-pink-400 hover:bg-pink-500 text-white'
          }`}
          onClick={(e) => {
            if (!isPremium && leftProjects <= 0) {
              e.preventDefault();
            }
          }}
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規作成
        </Link>
      </div>
    </div>
  );
}
