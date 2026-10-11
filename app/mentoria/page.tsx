import type { Metadata } from "next"
import { ClassgapSection } from "@/components/classgap-section"
import { ClassesGallery } from "@/components/classes-gallery"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PaymentMethods } from "@/components/payment-methods"
import { Services } from "@/components/services"
import { Testimonials } from "@/components/testimonials"
import { MAIN_CONTENT_ID } from "@/lib/nav"

export const metadata: Metadata = {
  title: "Mentoría y clases",
  description:
    "Mentoría 1-on-1 y clases de programación con Andrés Coello. Backend, web y acompañamiento de carrera. No aparece en el menú principal.",
  alternates: { canonical: "/mentoria" },
  openGraph: {
    title: "Mentoría y clases — Andrés Coello",
    description:
      "Mentoría 1-on-1 y clases de programación: backend, web y acompañamiento de carrera.",
    url: "/mentoria",
  },
}

export default function MentoriaPage() {
  return (
    <>
      <Header />
      <main id={MAIN_CONTENT_ID} className="min-h-screen bg-background">
        <Services />
        <ClassgapSection />
        <Testimonials />
        <ClassesGallery />
        <PaymentMethods />
      </main>
      <Footer />
    </>
  )
}
