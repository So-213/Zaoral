"use client";
import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"



export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="container mx-auto space-y-8">

        {/* Hero Section */}
        <section className="text-center flex flex-col items-center justify-center space-y-8 pt-12">
          <div className="inline-flex items-center gap-2 text-4xl md:text-5xl font-bold animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="relative">
              <MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-rose-500" strokeWidth={1.5} />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500/20" />
            </div>
            <h1>Zaoral</h1>
          </div>
          <p className="text-xl md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
            LINEで女に返信させるサービス
          </p>
        </section>

        <div className="mt-8 h-8"></div>

        {/* About Section */}
        {/* <section className="max-w-4xl mx-auto">
          <div className="group relative w-fit mx-auto">
            
            
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-8 h-8 text-rose-500" strokeWidth={1.5} />
                <span>Zaoralとは</span>
            </h2>

            <div className="absolute -bottom-2 left-0 w-full h-1 bg-rose-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
             */}
            
            {/* 追加: EJS ページ取得ボタン */}
            {/* <a
              href="https://zrl213.com/zaoral"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg shadow hover:bg-rose-600 transition-all"
            >
              詳細を見る
            </a>


          </div>
        </section> */}


        {/* About Section */}
        <section className="max-w-4xl mx-auto">
          <div className="group relative w-fit mx-auto">

            {/* ボタンとして全体をリンク化 */}
            <a
              href="https://zrl213.com/zaoral"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg md:text-xl font-bold text-black hover:text-rose-500 transition-all"
            >
              <MessageCircle className="w-8 h-8 text-rose-500" strokeWidth={1.5} />
              <span>Zaoralとは</span>
            </a>

            <div className="absolute -bottom-2 left-0 w-full h-1 bg-rose-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

          </div>
        </section>






        {/* How to Use Section */}
        <section className="max-w-4xl mx-auto">
          <div className="group relative w-fit mx-auto">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            使い方
          </h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-purple-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </section>

        {/* From Author Section */}
        <section className="max-w-4xl mx-auto">
          <div className="group relative w-fit mx-auto">
          <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
            サイト制作者より
          </h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-purple-500/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </div>
        </section>

        <div className="mt-8 h-8"></div>

        {/* CTA Section */}
        <section className="space-y-8 text-center">
          <div className="space-y-4">
            <Link href="/trial">
              <Button
                size="lg"
                className="text-lg bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              >
                お試し版はこちら
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <Link href="https://zrl213.com">
              <Button
                variant="outline"
                size="lg"
                className="text-lg group relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              >
                <span className="relative z-10">ログイン/登録はこちら</span>
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            </Link>
          </div>

        </section>
      </div>
    </main>
  )
}

