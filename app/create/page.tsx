"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CreatePage() {
  const [inputText, setInputText] = useState("");
  const [randomString, setRandomString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  // ランダム文字列を生成する関数（6文字、アルファベットと数字を含む）
  const generateRandomString = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomString(result);
  };

  // EC2バックエンドサーバーにデータを送信する関数
  const sendToBackend = async () => {
    if (!inputText.trim()) {
      toast.error("文字列を入力してください");
      return;
    }

    if (!randomString) {
      toast.error("ランダム文字列を生成してください");
      return;
    }

    setIsLoading(true);
    
    try {
      // EC2バックエンドサーバーのエンドポイント（実際のURLに変更してください）
      const response = await fetch('http://your-ec2-instance.com/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText: inputText,
          randomString: randomString,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResponse(JSON.stringify(data, null, 2));
        toast.success("データが正常に送信されました！");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('送信エラー:', error);
      toast.error("送信に失敗しました。サーバーのURLを確認してください。");
      setResponse("エラー: " + (error instanceof Error ? error.message : "不明なエラー"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">データ送信システム</h1>
          
          <div className="space-y-6">
            {/* 文字列入力セクション */}
            <Card>
              <CardHeader>
                <CardTitle>文字列入力</CardTitle>
                <CardDescription>送信したい文字列を入力してください</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="input-text">文字列</Label>
                  <Input
                    id="input-text"
                    type="text"
                    placeholder="文字列を入力してください..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ランダム文字列生成セクション */}
            <Card>
              <CardHeader>
                <CardTitle>ランダム文字列生成</CardTitle>
                <CardDescription>6文字のランダムな文字列を生成します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={generateRandomString}
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    ランダム文字列を生成
                  </Button>
                  
                  {randomString && (
                    <div className="flex items-center space-x-2">
                      <Label>生成された文字列:</Label>
                      <Badge variant="secondary" className="text-lg font-mono">
                        {randomString}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 送信セクション */}
            <Card>
              <CardHeader>
                <CardTitle>データ送信</CardTitle>
                <CardDescription>入力された文字列とランダム文字列をEC2バックエンドサーバーに送信します</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={sendToBackend}
                    disabled={isLoading || !inputText.trim() || !randomString}
                    className="w-full"
                  >
                    {isLoading ? "送信中..." : "データを送信"}
                  </Button>
                  
                  {/* 送信データのプレビュー */}
                  {(inputText || randomString) && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">送信データ:</h4>
                      <pre className="text-sm text-gray-700">
                        {JSON.stringify({
                          inputText: inputText,
                          randomString: randomString,
                          timestamp: new Date().toISOString()
                        }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* レスポンス表示セクション */}
            {response && (
              <Card>
                <CardHeader>
                  <CardTitle>サーバーレスポンス</CardTitle>
                  <CardDescription>バックエンドサーバーからの応答</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-gray-50 rounded-lg text-sm overflow-x-auto">
                    {response}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
