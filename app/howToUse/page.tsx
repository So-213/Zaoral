'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Monitor, LogIn, Plus, Eye, Settings } from "lucide-react"

export default function HowToUsePage() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 0,
      title: "外部ブラウザでアクセス",
      icon: <ExternalLink className="w-8 h-8" />,
      details: [
        "Chrome、Firefox、Safari、Edgeなどの<strong>外部ブラウザ</strong>をご利用ください",
      ]
    },
    {
      id: 1,
      title: "ログイン",
      icon: <LogIn className="w-8 h-8" />,
      details: [
        "ホームページの「ログイン」ボタンをクリック",
        "GoogleアカウントまたはLINEアカウントで簡単ログイン",
        "初回ログイン時は自動的にアカウントが作成されます"
      ]
    },
    {
        id: 2,
        title: "新規プロジェクト作成",
        icon: <Plus className="w-8 h-8" />,
        details: [
            "「新規作成」ボタンをクリックしてプロジェクト作成ページに移動",
            "Webページに表示させたいメッセージなど各種項目を入力",
            "保存ボタンでプロジェクトを保存"
        ]
    },
    {
      id: 3,
      title: "ダッシュボードでプロジェクト管理",
      icon: <Monitor className="w-8 h-8" />,
      details: [
        "各プロジェクトの詳細（メッセージ、作成日時、有効期限、アクセスURL）を確認できます",
        "プロジェクトの削除も可能です",
        "プロジェクトを作成したら、アクセスURLをコピーし、既読スルーする女の子に送りつけましょう",
      ]
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-purple-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            使い方
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            簡易Webページ作成ツール「Zaoral」の基本的な使い方をご紹介します。
            初心者の方でも簡単にWebページを作成できます。
          </p>
        </div>

        {/* ステップナビゲーション */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {steps.map((step) => (
            <Button
              key={step.id}
              variant={activeStep === step.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveStep(step.id)}
              className="flex items-center gap-2"
            >
              {step.icon}
              <span className="hidden sm:inline">{step.title}</span>
              <span className="sm:hidden">{step.id + 1}</span>
            </Button>
          ))}
        </div>

        {/* メインコンテンツ */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-rose-100 rounded-lg text-rose-600">
                    {steps[activeStep].icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{steps[activeStep].title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {steps[activeStep].description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">詳細手順</h3>
                  <ul className="space-y-3">
                    {steps[activeStep].details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Badge variant="secondary" className="mt-1 flex-shrink-0">
                          {index + 1}
                        </Badge>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
