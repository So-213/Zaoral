import { Project } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { projectTypeDisplayConfigs, defaultDisplayConfig } from "@/lib/dashboard-config";

interface ProjectDetailsProps {
  project: Project;
  copied: boolean;
  onCopyUrl: () => void;
}

export default function ProjectDetails({ project, copied, onCopyUrl }: ProjectDetailsProps) {
  const displayConfig = projectTypeDisplayConfigs[project.type] || defaultDisplayConfig;

  return (
    <div className="border-t border-blue-300 px-4 pb-4 pt-4 mt-2">
      <div className="space-y-4">
        {/* プロジェクトタイプに応じた動的フィールド表示 */}
        {displayConfig.fields.map((field, index) => (
          <div key={index}>
            <h4 className="font-medium text-gray-700 mb-2">{field.label}</h4>
            <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
              {field.getValue(project)}
            </p>
          </div>
        ))}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">作成日</h4>
            <p className="text-gray-600">
              {new Date(project.created_at).toLocaleDateString('ja-JP')}
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-1">有効期限</h4>
            <p className="text-gray-600">
              {new Date(project.expires_at).toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-700">WebページURL</h4>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onCopyUrl();
              }}
              variant="outline"
              size="sm"
              className="px-3 py-1 text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  コピー完了
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  コピー
                </>
              )}
            </Button>
          </div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="block text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {project.url}
          </a>
        </div>
      </div>
    </div>
  );
}
