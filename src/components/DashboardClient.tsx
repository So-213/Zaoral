'use client';

import { useState } from "react";
import { toast } from "sonner";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Project, DashboardClientProps } from "@/types/dashboard";
import UserInfoSection from "@/components/dashboard/UserInfoSection";
import ProjectCard from "@/components/dashboard/ProjectCard";

export default function DashboardClient({ user: initialUser, userProjects: initialUserProjects }: DashboardClientProps) {
  const [userProjects, setUserProjects] = useState<Project[]>(initialUserProjects);
  const [user, setUser] = useState(initialUser);
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    initialUserProjects.length > 0 ? initialUserProjects[0] : null
  );
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

      // プロジェクトリストから削除
      const updatedProjects = userProjects.filter(project => project.id !== projectId);
      setUserProjects(updatedProjects);

      // 削除されたプロジェクトが選択中だった場合、選択を解除または次のプロジェクトを選択
      if (selectedProject?.id === projectId) {
        if (updatedProjects.length > 0) {
          setSelectedProject(updatedProjects[0]);
        } else {
          setSelectedProject(null);
        }
      }

      toast.success("プロジェクトを削除しました");
    } catch (error) {
      console.error('プロジェクト削除エラー:', error);
      toast.error('プロジェクトの削除に失敗しました: ' + (error as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  const handleCopyUrl = async () => {
    if (!selectedProject?.url) return;
    
    try {
      await navigator.clipboard.writeText(selectedProject.url);
      setCopied(true);
      toast.success("URLをコピーしました");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
      toast.error("URLのコピーに失敗しました");
    }
  };

  return (
    <div className="py-8">
      <LoadingOverlay isLoading={deleting !== null} message="削除中..." />
      <div className="max-w-6xl mx-auto px-4">
        <UserInfoSection user={user} userProjects={userProjects} />

        {/* プロジェクトリスト */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">プロジェクト一覧</h2>
          
          {userProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">まだプロジェクトがありません</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  totalProjects={userProjects.length}
                  selectedProject={selectedProject}
                  deleting={deleting}
                  copied={copied}
                  onSelect={setSelectedProject}
                  onDelete={handleDeleteProject}
                  onCopyUrl={handleCopyUrl}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
