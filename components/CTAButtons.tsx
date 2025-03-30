'use client'
import { Button } from "@/components/ui/button"

export default function CTAButtons({ onLogin }: { onLogin: () => void }) {
  return (
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
          onClick={onLogin}
        >
          <span className="relative z-10">ログイン/登録はこちら</span>
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </Button>
      </div>
    </section>
  )
}
