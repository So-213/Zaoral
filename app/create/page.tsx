"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";



export default function CreatePage() {
  const [inputText, setInputText] = useState("");
  const [randomString, setRandomString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");
  
  // 文字数制限（1000文字）
  const MAX_CHARACTERS = 50;

  // ランダム文字列を生成する関数（6文字、アルファベットと数字を含む）
  const generateRandomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // SupabaseDBにデータを保存する関数
  const saveToDatabase = async () => {
    if (!inputText.trim()) {
      toast.error("文字列を入力してください");
      return;
    }
    
    if (inputText.length > MAX_CHARACTERS) {
      toast.error(`文字数が制限を超えています（${MAX_CHARACTERS}文字以内）`);
      return;
    }

    // データ保存時に自動的にランダム文字列を生成
    const newRandomString = generateRandomString();
    setRandomString(newRandomString);

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: newRandomString,
          message: inputText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const url = `http://54.95.114.242:3001/p/${data.slug}`;
        setResponse(url);
        toast.success("データが正常に保存されました！");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('保存エラー:', error);
      toast.error("保存に失敗しました。データベース接続を確認してください。");
      setResponse("エラー: " + (error instanceof Error ? error.message : "不明なエラー"));
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Webページ作成</h1>
          
          <div className="space-y-6">
            {/* 文字列入力セクション */}
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
                        disabled={isLoading || !inputText.trim() || inputText.length > MAX_CHARACTERS}
                        className="w-full bg-purple-400 hover:bg-purple-500"
                      >
                        {isLoading ? "保存中..." : "Webページを作成"}
                      </Button>
                    </div>
                  
                  {/* 保存データのプレビュー */}
                  {/* {(inputText || randomString) && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">保存データ:</h4>
                      <pre className="text-sm text-gray-700">
                        {JSON.stringify({
                          slug: randomString,
                          message: inputText,
                          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                        }, null, 2)}
                      </pre>
                    </div>
                  )} */}
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
