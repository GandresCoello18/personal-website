import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { BlueprintFrame } from "@/components/blueprint-frame"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ABOUT_FACTS, ABOUT_PARAGRAPHS, PLATZI_CERTIFICATIONS } from "@/lib/about"
import {
  CV_PDF_PATH,
  PERSON_JOB_TITLE,
  PERSON_NAME,
  PERSON_SAME_AS,
  SITE_DESCRIPTION,
} from "@/lib/identity"
import { getBreadcrumbJsonLd, getProfilePageJsonLd } from "@/lib/json-ld"
import { MAIN_CONTENT_ID } from "@/lib/nav"

export const metadata: Metadata = {
  title: "Sobre mí",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/sobre-mi" },
  openGraph: {
    title: `Sobre ${PERSON_NAME}`,
    description: SITE_DESCRIPTION,
    url: "/sobre-mi",
  },
  twitter: {
    title: `Sobre ${PERSON_NAME}`,
    description: SITE_DESCRIPTION,
  },
}

export default function SobreMiPage() {
  const profileJsonLd = getProfilePageJsonLd()
  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Sobre mí", path: "/sobre-mi" },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main id={MAIN_CONTENT_ID} className="min-h-screen bg-background">
        <section className="blueprint-grid px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14">
              <BlueprintFrame className="mx-auto size-36 shrink-0 overflow-hidden sm:size-44">
                <Image
                  src="/profile.jpeg"
                  alt={`${PERSON_NAME}, ${PERSON_JOB_TITLE}`}
                  width={176}
                  height={176}
                  className="aspect-square size-full object-cover object-top"
                  priority
                />
              </BlueprintFrame>
              <div className="min-w-0 space-y-6">
                <h1 className="section-title">{PERSON_NAME}</h1>
                <p className="font-mono text-sm text-muted-foreground">
                  {PERSON_JOB_TITLE} · Ambato, Ecuador
                </p>
                <div className="max-w-prose space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {ABOUT_PARAGRAPHS.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Link href="/#contact" className="btn-primary">
                    Contacto
                  </Link>
                  <a href={CV_PDF_PATH} download className="btn-secondary">
                    Descargar CV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-medium tracking-[-0.02em] text-foreground md:text-3xl">
              Datos
            </h2>
            <BlueprintFrame className="mt-8">
              <dl className="divide-y divide-border">
                {ABOUT_FACTS.map((fact) => (
                  <div
                    key={fact.term}
                    className="grid grid-cols-1 gap-2 px-5 py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-baseline sm:gap-8"
                  >
                    <dt className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {fact.term}
                    </dt>
                    <dd className="text-sm leading-relaxed text-foreground md:text-base">
                      {fact.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </BlueprintFrame>
          </div>
        </section>

        <section className="border-t border-border px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-2xl font-medium tracking-[-0.02em] text-foreground md:text-3xl">
                Perfiles oficiales
              </h2>
              <ul className="mt-8 space-y-1">
                {PERSON_SAME_AS.map((profile) => (
                  <li key={profile.href}>
                    <a
                      href={profile.href}
                      rel="me noopener noreferrer"
                      target="_blank"
                      className="inline-flex min-h-11 items-center text-sm text-foreground underline decoration-accent underline-offset-4 hover:text-foreground"
                    >
                      {profile.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link
                    href="/"
                    className="inline-flex min-h-11 items-center text-sm text-foreground underline decoration-accent underline-offset-4"
                  >
                    Sitio web
                  </Link>
                </li>
                <li>
                  <a
                    href={CV_PDF_PATH}
                    className="inline-flex min-h-11 items-center text-sm text-foreground underline decoration-accent underline-offset-4"
                  >
                    CV en PDF
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-medium tracking-[-0.02em] text-foreground md:text-3xl">
                Formación continua
              </h2>
              <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted-foreground md:text-base">
                Desde 2017 se forma en línea, en Platzi y otras plataformas, hasta hoy.
                Certificaciones de Platzi que figuran en su CV:
              </p>
              <ol className="mt-8 list-none space-y-5">
                {PLATZI_CERTIFICATIONS.map((item) => (
                  <li
                    key={item.name}
                    className="border-b border-border pb-5 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm text-foreground md:text-base">{item.name}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{item.date}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
