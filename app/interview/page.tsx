import type { Metadata } from "next"
import { InterviewApp } from "@/components/interview/interview-app"

export const metadata: Metadata = {
  title: "Interview",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <InterviewApp />
    </main>
  )
}
