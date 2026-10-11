import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CaseLayout } from "@/components/cases/case-layout"
import { getAllCaseSlugs } from "@/lib/cases"
import { getCaseBySlug } from "@/lib/compile-case"
import { getBreadcrumbJsonLd } from "@/lib/json-ld"
import { absoluteUrl, getSiteUrl } from "@/lib/site"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = getSiteUrl()

export async function generateStaticParams() {
  return getAllCaseSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getCaseBySlug(slug)
  if (!item) {
    return { title: "Caso no encontrado" }
  }

  const { meta } = item
  const url = `${siteUrl}/proyectos/${meta.slug}`
  const ogImage = meta.coverImage ? absoluteUrl(meta.coverImage) : absoluteUrl("/1764558900283.png")

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.stack,
    alternates: { canonical: `/proyectos/${meta.slug}` },
    openGraph: {
      title: `${meta.title} — Andrés Coello`,
      description: meta.description,
      type: "article",
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} — Andrés Coello`,
      description: meta.description,
      images: [ogImage],
    },
  }
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const item = await getCaseBySlug(slug)
  if (!item) notFound()

  const { meta, headings, content } = item
  const caseUrl = `${siteUrl}/proyectos/${meta.slug}`
  const image = meta.coverImage ? absoluteUrl(meta.coverImage) : absoluteUrl("/1764558900283.png")

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    author: {
      "@type": "Person",
      name: "Andrés Coello",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Andrés Coello",
      "@id": `${siteUrl}/#person`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": caseUrl,
    },
    image,
  }

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Proyectos", path: "/proyectos" },
    { name: meta.title, path: `/proyectos/${meta.slug}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main id="contenido-principal" className="py-12 sm:py-16">
        <CaseLayout meta={meta} headings={headings}>
          {content}
        </CaseLayout>
      </main>
    </>
  )
}
