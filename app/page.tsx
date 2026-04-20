import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { TalksSection } from "@/components/talks-section"
import { BlogSection } from "@/components/blog-section"
import { Services } from "@/components/services"
import { ClassgapSection } from "@/components/classgap-section"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { PaymentMethods } from "@/components/payment-methods"
import { Footer } from "@/components/footer"
import { ClassesGallery } from "@/components/classes-gallery"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Experience />
      <Projects />
      <TalksSection />
      <BlogSection />
      <Services />
      <ClassesGallery />
      <ClassgapSection />
      <Testimonials />
      <PaymentMethods />
      <CTA />
      <Footer />
    </main>
  )
}
