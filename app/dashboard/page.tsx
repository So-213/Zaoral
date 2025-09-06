'use client';

import Link from "next/link";
import { PublishButton } from "../../components/PublishButton";
import { useState, useEffect } from "react";



interface Project {
  id: string;
  message: string;
  created_at: string;
  expires_at: string;
  published: boolean;
  user_id: string;
  slug: string;
}

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // セッション情報を取得
        const response = await fetch('/api/auth/session');
        const sessionData = await response.json();
        
        if (!sessionData.user?.id) {
          setLoading(false);
          return;
        }

        setSession(sessionData);

        // プロジェクトデータを取得
        const projectsResponse = await fetch('/api/projects');
        const projectsData = await projectsResponse.json();
        
        if (projectsData.projects) {
          setUserProjects(projectsData.projects);
          // 最初のプロジェクトを選択状態にする
          if (projectsData.projects.length > 0) {
            setSelectedProject(projectsData.projects[0]);
          }
        }
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

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

  // 統計情報を計算
  const totalCreated = userProjects.length;
  const totalPublished = userProjects.filter((project: Project) => project.published).length;

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 上部セクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ようこそ、{session.user.name || session.user.email} さん！
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/create"
              className="bg-pink-400 hover:bg-pink-500 text-white font-medium py-4 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center text-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規作成
            </Link>
                        
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">統計</h3>
              <p className="text-gray-500 text-sm">作成数: {totalCreated}</p>
              {/* <p className="text-gray-500 text-sm">公開中: {totalPublished}</p> */}
            </div>
          </div>
        </div>

        {/* 下部セクション - プロジェクトリストと詳細表示 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* プロジェクト詳細表示エリア（スマホでは上、デスクトップでは右側） */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">プロジェクト詳細</h2>
              
              {!selectedProject ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    プロジェクトを選択してください
                  </p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6">
                  {/* <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      プロジェクト{userProjects.length - userProjects.findIndex(p => p.id === selectedProject.id)}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProject.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedProject.published ? '公開中' : '非公開'}
                    </span>
                  </div> */}
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">メッセージ</h4>
                      <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {selectedProject.message}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">作成日</h4>
                        <p className="text-gray-600">
                          {new Date(selectedProject.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-1">有効期限</h4>
                        <p className="text-gray-600">
                          {new Date(selectedProject.expires_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-700">WebページURL</h4>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`http://54.95.114.242:3001/p/${selectedProject.slug}`);
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          コピー
                        </button>
                      </div>
                      <a
                        href={`http://54.95.114.242:3001/p/${selectedProject.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        http://54.95.114.242:3001/p/{selectedProject.slug}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* プロジェクトリスト（スマホでは下、デスクトップでは左側） */}
          <div className="order-2 lg:order-1 lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">プロジェクト一覧</h2>
              
              {userProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">まだプロジェクトがありません</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userProjects.map((project: Project, index: number) => (
                    <div 
                      key={project.id}
                      className={`border rounded-lg p-4 transition-colors duration-200 cursor-pointer ${
                        selectedProject?.id === project.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">
                            プロジェクト{userProjects.length - index}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {project.message.length > 50 
                              ? `${project.message.substring(0, 50)}...` 
                              : project.message
                            }
                          </p>                     
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
