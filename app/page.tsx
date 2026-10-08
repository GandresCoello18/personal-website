import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { TalksSection } from "@/components/talks-section"
import { BlogSection } from "@/components/blog-section"
import { VideosSection } from "@/components/videos-section"
import { Services } from "@/components/services"
import { ClassgapSection } from "@/components/classgap-section"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { PaymentMethods } from "@/components/payment-methods"
import { Footer } from "@/components/footer"
import { ClassesGallery } from "@/components/classes-gallery"
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
        <TalksSection />
        <BlogSection />
        <VideosSection />
        <Services />
        <ClassesGallery />
        <ClassgapSection />
        <Testimonials />
        <PaymentMethods />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
