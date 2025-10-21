'use client';

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateProjectUrl } from "@/lib/config";
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
import { Trash2 } from "lucide-react";

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
  totalCreated: number;
}

export default function DashboardClient({ session, userProjects, totalCreated }: DashboardClientProps) {
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
                          onClick={() => {
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
                        className="block text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {generateProjectUrl(selectedProject.slug)}
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
                                >
                                  {deleting === project.id ? '削除中...' : '削除'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
