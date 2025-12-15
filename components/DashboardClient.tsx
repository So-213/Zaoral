'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateProjectUrl, DEFAULT_LEFT_PROJECTS } from "@/lib/config";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";

interface Project {
  id: string;
  created_at: Date;
  expires_at: Date;
  published: boolean;
  user_id: string;
  slug: string;
  projectMessage?: {
    message: string;
  } | null;
}

interface DashboardClientProps {
  session: any;
  userProjects: Project[];
  leftProjects: number;
  userPlan: string;
}

export default function DashboardClient({ session, userProjects, leftProjects, userPlan }: DashboardClientProps) {
  const isPremium = userPlan === 'PREMIUM';
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    userProjects.length > 0 ? userProjects[0] : null
  );
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDeleteProject = async (projectId: string) => {
    setDeleting(projectId);
    try {
      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '削除に失敗しました');
      }

      // ページをリロードして最新の状態を取得
      window.location.reload();
    } catch (error) {
      console.error('プロジェクト削除エラー:', error);
      alert('プロジェクトの削除に失敗しました: ' + (error as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 上部セクション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            ようこそ、{session.user.name || session.user.email} さん！
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
                      ⭐ プレミアムプラン: プロジェクト作成に制限はありません
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

        {/* 下部セクション - プロジェクトリスト */}
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
                  className={`border rounded-lg transition-colors duration-200 ${
                    selectedProject?.id === project.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedProject(selectedProject?.id === project.id ? null : project)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1">
                          プロジェクト{userProjects.length - index}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {project.projectMessage?.message 
                            ? (project.projectMessage.message.length > 50 
                                ? `${project.projectMessage.message.substring(0, 50)}...` 
                                : project.projectMessage.message)
                            : 'メッセージがありません'
                          }
                        </p>                     
                      </div>
                      <div className="ml-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={deleting === project.id}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>プロジェクトを削除しますか？</AlertDialogTitle>
                              <AlertDialogDescription>
                                この操作は取り消すことができません。プロジェクトとそのメッセージが完全に削除されます。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-red-500 hover:bg-red-600"
                                disabled={deleting === project.id}
                              >
                                {deleting === project.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    削除中...
                                  </>
                                ) : (
                                  '削除'
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  
                  {/* 選択されたプロジェクトの詳細表示 */}
                  {selectedProject?.id === project.id && (
                    <div className="border-t border-blue-300 px-4 pb-4 pt-4 mt-2">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">メッセージ</h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {selectedProject.projectMessage?.message || 'メッセージがありません'}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(generateProjectUrl(selectedProject.slug));
                              }}
                              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              コピー
                            </button>
                          </div>
                          <a
                            href={generateProjectUrl(selectedProject.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="block text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            {generateProjectUrl(selectedProject.slug)}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
