'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface PublishButtonProps {
  projectId: string;
  isPublished: boolean;
  onPublish?: () => void;
}

export function PublishButton({ projectId, isPublished, onPublish }: PublishButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = async () => {
    if (isPublished) {
      toast({
        title: "既に公開済み",
        description: "このプロジェクトは既に公開されています。",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/projects/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "公開完了",
          description: "プロジェクトが正常に公開されました。",
        });
        onPublish?.();
      } else {
        toast({
          title: "エラー",
          description: data.error || "公開に失敗しました。",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "ネットワークエラーが発生しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePublish}
      disabled={isLoading || isPublished}
      variant={isPublished ? "secondary" : "default"}
      size="sm"
      className="w-full"
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          公開中...
        </div>
      ) : isPublished ? (
        "公開済み"
      ) : (
        "公開する"
      )}
    </Button>
  );
}
