import type { ReactNode } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

/** Shared shell for the blog: site nav + footer, minimal extra chrome. */
export default function BlogSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
