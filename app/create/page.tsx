"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateProjectUrl } from "@/lib/config";
import { Copy, Check } from "lucide-react";

type ProjectType = "message" | "picture";



export default function CreatePage() {
  const [projectType, setProjectType] = useState<ProjectType>("message");
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectName, setProjectName] = useState("");
  const [randomString, setRandomString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [copied, setCopied] = useState(false);
  
  // 文字数制限（50文字）
  const MAX_CHARACTERS = 50;
  const MAX_PROJECT_NAME_LENGTH = 30;

  // ランダム文字列を生成する関数（6文字、アルファベットと数字を含む）
  const generateRandomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

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
    } else if (projectType === 'picture') {
      if (!selectedFile) {
        toast.error("画像ファイルを選択してください");
        return;
      }
      if (!projectName.trim()) {
        toast.error("プロジェクト名を入力してください");
        return;
      }
      if (projectName.length > MAX_PROJECT_NAME_LENGTH) {
        toast.error(`プロジェクト名が制限を超えています（${MAX_PROJECT_NAME_LENGTH}文字以内）`);
        return;
      }
    }

    // データ保存時に自動的にランダム文字列を生成
    const newRandomString = generateRandomString();
    setRandomString(newRandomString);

    setIsLoading(true);
    
    try {
      let requestBody: any = {
        slug: newRandomString,
        type: projectType,
        name: projectName,
      };

      if (projectType === 'message') {
        requestBody.message = inputText;
      } else if (projectType === 'picture') {
        // 画像をS3にアップロード
        const formData = new FormData();
        formData.append('image', selectedFile!);
        
        const uploadResponse = await fetch('/api/projects/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          const errorMessage = errorData.error || '画像のアップロードに失敗しました';
          toast.error(errorMessage);
          setIsLoading(false);
          return;
        }

        const uploadData = await uploadResponse.json();
        requestBody.s3Key = uploadData.s3Key;
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

  
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Webページ作成</h1>
          
          <div className="space-y-6">
            {/* プロジェクトタイプ選択セクション */}
            <Card>
              <CardHeader>
                <CardTitle>プロジェクトタイプ</CardTitle>
                <CardDescription>作成するプロジェクトのタイプを選択してください</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="project-type">タイプ</Label>
                  <Select value={projectType} onValueChange={(value) => {
                    setProjectType(value as ProjectType);
                    // タイプ変更時に入力内容をクリア
                    setInputText("");
                    setSelectedFile(null);
                    setProjectName("");
                    setResponse("");
                  }}>
                    <SelectTrigger id="project-type" className="w-full">
                      <SelectValue placeholder="プロジェクトタイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="message">メッセージ</SelectItem>
                      <SelectItem value="picture">画像</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* タイプに応じた入力セクション */}
            {projectType === 'message' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>プロジェクト名</CardTitle>
                    <CardDescription>プロジェクトを識別するための名前を入力してください</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input
                        id="project-name"
                        type="text"
                        placeholder="プロジェクト名を入力してください..."
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        maxLength={MAX_PROJECT_NAME_LENGTH}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span className={`${projectName.length > MAX_PROJECT_NAME_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {projectName.length} / {MAX_PROJECT_NAME_LENGTH} 文字
                        </span>
                        {projectName.length > MAX_PROJECT_NAME_LENGTH * 0.9 && (
                          <span className="text-orange-500 text-xs">
                            文字数制限に近づいています
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>文字列入力</CardTitle>
                    <CardDescription>Webページに表示させたい文字列を入力してください</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input
                        id="input-text"
                        type="text"
                        placeholder="文字列を入力してください..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        maxLength={MAX_CHARACTERS}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span className={`${inputText.length > MAX_CHARACTERS * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {inputText.length} / {MAX_CHARACTERS} 文字
                        </span>
                        {inputText.length > MAX_CHARACTERS * 0.9 && (
                          <span className="text-orange-500 text-xs">
                            文字数制限に近づいています
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {projectType === 'picture' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>プロジェクト名</CardTitle>
                    <CardDescription>プロジェクトを識別するための名前を入力してください</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input
                        id="project-name"
                        type="text"
                        placeholder="プロジェクト名を入力してください..."
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        maxLength={MAX_PROJECT_NAME_LENGTH}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span className={`${projectName.length > MAX_PROJECT_NAME_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                          {projectName.length} / {MAX_PROJECT_NAME_LENGTH} 文字
                        </span>
                        {projectName.length > MAX_PROJECT_NAME_LENGTH * 0.9 && (
                          <span className="text-orange-500 text-xs">
                            文字数制限に近づいています
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>画像アップロード</CardTitle>
                    <CardDescription>Webページに表示させたい画像をアップロードしてください（JPEG、PNG、GIF、WebP、最大10MB）</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="file-input">画像ファイル</Label>
                      <Input
                        id="file-input"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        className="w-full"
                      />
                      {selectedFile && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>選択されたファイル:</strong> {selectedFile.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            サイズ: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* 送信セクション */}
            <Card>
              <CardHeader>
                <CardTitle>Webページを作成</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    <div className="pt-1">
                      <Button 
                        onClick={saveToDatabase}
                        disabled={
                          isLoading || 
                          (projectType === 'message' && (!projectName.trim() || projectName.length > MAX_PROJECT_NAME_LENGTH || !inputText.trim() || inputText.length > MAX_CHARACTERS)) ||
                          (projectType === 'picture' && (!selectedFile || !projectName.trim() || projectName.length > MAX_PROJECT_NAME_LENGTH))
                        }
                        className="w-full bg-purple-400 hover:bg-purple-500"
                      >
                        {isLoading ? "作成中..." : "Webページを作成"}
                      </Button>
                    </div>
                  

                </div>
              </CardContent>
            </Card>

            {/* レスポンス表示セクション */}
            {response && (
              <Card>
                <CardHeader>
                  <CardTitle>作成されたWebページのURL</CardTitle>
                  <CardDescription>作成されたページにアクセスするためのURL</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <Button
                        onClick={handleCopyUrl}
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
                    <div className="p-4 bg-gray-50 rounded-lg text-sm">
                      <a 
                        href={response} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {response}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
