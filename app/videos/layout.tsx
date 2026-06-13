import type { ReactNode } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function VideosSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
