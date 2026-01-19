import { Project } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
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
import ProjectDetails from "./ProjectDetails";

interface ProjectCardProps {
  project: Project;
  index: number;
  totalProjects: number;
  selectedProject: Project | null;
  deleting: string | null;
  copied: boolean;
  onSelect: (project: Project | null) => void;
  onDelete: (projectId: string) => void;
  onCopyUrl: () => void;
}

export default function ProjectCard({
  project,
  index,
  totalProjects,
  selectedProject,
  deleting,
  copied,
  onSelect,
  onDelete,
  onCopyUrl,
}: ProjectCardProps) {
  const isSelected = selectedProject?.id === project.id;
  const isDeleting = deleting === project.id;

  return (
    <div 
      className={`border rounded-lg transition-colors duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:bg-gray-50'
      } ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => onSelect(isSelected ? null : project)}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 mb-1">
              {project.name || `プロジェクト${totalProjects - index}`}
            </h3>
          </div>
          <div className="ml-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  disabled={isDeleting}
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
                    onClick={() => onDelete(project.id)}
                    className="bg-red-500 hover:bg-red-600"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
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
      {isSelected && (
        <ProjectDetails
          project={selectedProject}
          copied={copied}
          onCopyUrl={onCopyUrl}
        />
      )}
    </div>
  );
}
