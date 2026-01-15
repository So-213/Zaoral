"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { useCreateProject, MAX_CHARACTERS, MAX_PROJECT_NAME_LENGTH } from "@/hooks/useCreateProject";
import { ProjectTypeInputSection } from "@/components/create/ProjectTypeInputSection";
import { ProjectType } from "@/lib/create/project-type-config";

export default function CreatePage() {
  const {
    projectType,
    inputText,
    selectedFile,
    projectName,
    isLoading,
    response,
    copied,
    setInputText,
    setProjectName,
    handleFileChange,
    handleProjectTypeChange,
    saveToDatabase,
    handleCopyUrl,
    isSubmitDisabled,
  } = useCreateProject();

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
                  <Select value={projectType} onValueChange={handleProjectTypeChange}>
                    <SelectTrigger id="project-type" className="w-full">
                      <SelectValue placeholder="プロジェクトタイプを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="message">メッセージ</SelectItem>
                      {/* picture型は一時停止中のため無効化 */}
                      <SelectItem value="picture" disabled>画像（現在は利用できません）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* タイプに応じた入力セクション */}
            <ProjectTypeInputSection
              projectType={projectType}
              projectName={projectName}
              onProjectNameChange={setProjectName}
              inputText={inputText}
              onInputTextChange={setInputText}
              selectedFile={selectedFile}
              onFileChange={handleFileChange}
              maxProjectNameLength={MAX_PROJECT_NAME_LENGTH}
              maxCharacters={MAX_CHARACTERS}
            />

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
                      disabled={isSubmitDisabled}
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
