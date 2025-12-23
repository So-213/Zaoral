'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import LoginModal from "@/components/LoginModal"
import { usePageLoading } from "@/hooks/usePageLoading"
import LoadingOverlay from "@/components/LoadingOverlay"

export default function CTAButtons() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const { isLoading, startLoading } = usePageLoading()

  return (
    <>
      <section className="space-y-8 text-center">
        <div className="space-y-4">
          {status === "authenticated" ? (
            <Button
              size="lg"
              className="text-lg bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              onClick={() => {
                startLoading()
                router.push("/dashboard")
              }}
            >
              ダッシュボードへ
            </Button>
          ) : (
            <Button
              size="lg"
              className="text-lg bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              onClick={() => setShowLogin(true)}
            >
              ログイン/登録はこちら
            </Button>
          )}
        </div>
        {status === "authenticated" && (
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="text-lg group relative overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
              onClick={() => {
                startLoading()
                router.push("/account")
              }}
            >
              <span className="relative z-10">アカウント情報</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Button>
          </div>
        )}
      </section>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <LoadingOverlay isLoading={isLoading} />
    </>
  )
}
