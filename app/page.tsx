import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { TalksSection } from "@/components/talks-section"
import { BlogSection } from "@/components/blog-section"
import { VideosSection } from "@/components/videos-section"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { getWebSiteJsonLd } from "@/lib/json-ld"
import { MAIN_CONTENT_ID } from "@/lib/nav"

export default function Home() {
  const webSiteJsonLd = getWebSiteJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <Header />
      <main id={MAIN_CONTENT_ID} className="min-h-screen bg-background">
        <Hero />
        <Experience />
        <Projects />
        <BlogSection />
        <TalksSection videoPreview={<VideosSection compact />} />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
