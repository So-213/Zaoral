import { useState } from "react";
import { toast } from "sonner";
import { generateProjectUrl } from "@/lib/config";
import { ProjectType, PROJECT_TYPE_CONFIG } from "@/lib/create/project-type-config";

// 定数
export const MAX_CHARACTERS = 50;
export const MAX_PROJECT_NAME_LENGTH = 30;

// ランダム文字列を生成する関数（6文字、アルファベットと数字を含む）
const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useCreateProject = () => {
  const [projectType, setProjectType] = useState<ProjectType>("message");
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [randomString, setRandomString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);

  // ファイル選択ハンドラー
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ファイルタイプの検証
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('サポートされていない画像形式です。JPEG、PNG、GIF、WebPのみ対応しています。');
        return;
      }
      // ファイルサイズの検証（10MBまで）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('画像サイズが大きすぎます。10MB以下にしてください。');
        return;
      }
      setSelectedFile(file);
    }
  };

  // プロジェクトタイプ変更ハンドラー
  const handleProjectTypeChange = (value: string) => {
    // picture型は一時停止中のため選択不可
    if (value === 'picture') {
      toast.error('画像型プロジェクトは現在利用できません');
      return;
    }
    setProjectType(value as ProjectType);
    // タイプ変更時に入力内容をクリア
    setInputText("");
    setSelectedFile(null);
    setProjectName("");
    setResponse("");
  };

  // プロジェクトを作成する関数
  const saveToDatabase = async () => {
    // タイプに応じたバリデーション
    if (projectType === 'message') {
      if (!projectName.trim()) {
        toast.error("プロジェクト名を入力してください");
        return;
      }
      if (projectName.length > MAX_PROJECT_NAME_LENGTH) {
        toast.error(`プロジェクト名が制限を超えています（${MAX_PROJECT_NAME_LENGTH}文字以内）`);
        return;
      }
      if (!inputText.trim()) {
        toast.error("文字列を入力してください");
        return;
      }
      
      if (inputText.length > MAX_CHARACTERS) {
        toast.error(`文字数が制限を超えています（${MAX_CHARACTERS}文字以内）`);
        return;
      }
    }

    // データ保存時に自動的にランダム文字列を生成
    const newRandomString = generateRandomString();
    setRandomString(newRandomString);

    setIsLoading(true);
    
    try {
      const baseBody = {
        slug: newRandomString,
        type: projectType,
        name: projectName,
      };

      // プロジェクトタイプに応じたリクエストボディを構築
      const config = PROJECT_TYPE_CONFIG[projectType];
      if (!config) {
        toast.error(`未サポートのプロジェクトタイプです: ${projectType}`);
        setIsLoading(false);
        return;
      }

      let requestBody: Record<string, any>;
      try {
        requestBody = await config.requestBodyBuilder.buildRequestBody(
          baseBody,
          {
            inputText,
            selectedFile,
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'リクエストボディの構築に失敗しました';
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const url = generateProjectUrl(data.slug);
        setResponse(url);
        toast.success("プロジェクトが正常に作成されました！");
      } else {
        // エラーレスポンスからメッセージを取得
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        toast.error(errorMessage);
        setResponse("");
        return;
      }
    } catch (error) {
      console.error('保存エラー:', error);
      toast.error("保存に失敗しました。データベース接続を確認してください。");
      setResponse("");
    } finally {
      setIsLoading(false);
    }
  };

  // URLをコピーする関数
  const handleCopyUrl = async () => {
    if (!response) return;
    
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      toast.success("URLをコピーしました");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err);
      toast.error("URLのコピーに失敗しました");
    }
  };

  // 送信ボタンの無効化条件
  const isSubmitDisabled = isLoading || 
    (projectType === 'message' && (
      !projectName.trim() || 
      projectName.length > MAX_PROJECT_NAME_LENGTH || 
      !inputText.trim() || 
      inputText.length > MAX_CHARACTERS
    ));

  return {
    // 状態
    projectType,
    inputText,
    selectedFile,
    projectName,
    isLoading,
    response,
    copied,
    // セッター
    setInputText,
    setProjectName,
    setSelectedFile,
    // ハンドラー
    handleFileChange,
    handleProjectTypeChange,
    saveToDatabase,
    handleCopyUrl,
    // 計算値
    isSubmitDisabled,
  };
};
