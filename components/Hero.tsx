import { MessageCircle } from "lucide-react"

export default function Hero() {
  return (
    <section className="text-center flex flex-col items-center justify-center space-y-8">
      <div className="inline-flex items-center gap-2 text-4xl md:text-5xl font-bold animate-in fade-in slide-in-from-top-8 duration-1000">
        <div className="relative">
          <MessageCircle className="w-12 h-12 md:w-16 md:h-16 text-rose-500" strokeWidth={1.5} />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-500/20" />
        </div>
        <h1>Zaoral</h1>
      </div>
      <p className="text-xl md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000">
        未読スルー、ダメ。ゼッタイ。
      </p>
    </section>
  )
}
