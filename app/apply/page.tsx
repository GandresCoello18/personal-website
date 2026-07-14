import type { Metadata } from "next"
import { ApplyApp } from "@/components/apply/apply-app"

export const metadata: Metadata = {
  title: "Apply",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <ApplyApp />
    </main>
  )
}
