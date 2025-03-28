// ./app/page.tsx
"use client"


import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"




export default function Home() {

  const [showLogin, setShowLogin] = useState(false)




  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="container mx-auto space-y-8">

        {/* Hero Section */}
        <section className="text-center flex flex-col items-center justify-center space-y-8">
          <div className="inline-flex items-center gap-2 text-4xl md:text-5xl font-bold animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="relative">
              <MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-rose-500" strokeWidth={1.5} />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500/20" />
            </div>
            <h1>Zaoral</h1>
          </div>
          <p className="text-xl md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            LINEで女性に返信させるサービス
          </p>
        </section>

        <div className="mt-8 h-8"></div>

        {/* About Section */}
        <section className="max-w-4xl mx-auto">
          <div className="group relative w-fit mx-auto">
            <a
              href="/zaoral"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg md:text-xl font-bold text-black hover:text-rose-500 transition-all"
            >
              <MessageCircle className="w-6 h-6 text-rose-500" strokeWidth={1.5} />
              <span>Zaoralとは</span>
            </a>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-rose-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </section>

        {/* How to Use Section */}
        <section className="max-w-4xl mx-auto">
          <div className="group relative w-fit mx-auto">
            <a
              href="/howToUse"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg md:text-xl font-bold text-black hover:text-rose-500 transition-all"
            >
              <span>使い方</span>
            </a>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-rose-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </section>

        {/* From Author Section */}
        <section className="max-w-4xl mx-auto">
          <div className="group relative w-fit mx-auto">
            <a
              href="/fromAuthor"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg md:text-xl font-bold text-black hover:text-rose-500 transition-all"
            >
              <span>サイト制作者より</span>
            </a>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-rose-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </section>

        <div className="mt-8 h-8"></div>

        {/* CTA Section */}
        <section className="space-y-8 text-center">
          <div className="space-y-4">
            <Button
              size="lg"
              className="text-lg bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              onClick={() => {
                window.location.href = "/dashboard"
              }}
            >
              お試し版はこちら
            </Button>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="text-lg group relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              onClick={() => setShowLogin(true)}
            >
              <span className="relative z-10">ログイン/登録はこちら</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>
        </section>

        {/* ログインモーダル */}
        {showLogin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-80">
              <h1 className="text-2xl font-bold mb-4">ログイン</h1>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              >
                Googleでログイン
              </button>
              <button
                className="mt-4 block text-sm text-gray-500 underline"
                onClick={() => setShowLogin(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

