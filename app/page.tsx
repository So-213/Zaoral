import Hero from "@/components/Hero"
import NavLinkSection from "@/components/NavLinkSection"
import CTAButtons from "@/components/CTAButtons"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-purple-100">
      <div className="container mx-auto space-y-8">
        <Hero />
        <div className="mt-8 h-8" />
        <NavLinkSection />
        <div className="mt-8 h-8" />
        <CTAButtons />
      </div>
    </main>
  )
}
