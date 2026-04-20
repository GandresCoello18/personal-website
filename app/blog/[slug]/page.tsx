import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogLayout } from "@/components/BlogLayout"
import { getAllSlugs, getPostBySlug } from "@/lib/mdx"
import { getSiteUrl } from "@/lib/site"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = getSiteUrl()

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) {
    return { title: "Artículo no encontrado" }
  }

  const { meta } = post
  const url = `${siteUrl}/blog/${meta.slug}`
  const ogImage = meta.coverImage
    ? meta.coverImage.startsWith("http")
      ? meta.coverImage
      : `${siteUrl}${meta.coverImage}`
    : `${siteUrl}/1764558900283.png`

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/blog/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const { meta, headings, content } = post

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    author: {
      "@type": "Person",
      name: "Andres Coello",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Andres Coello",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${meta.slug}`,
    },
    image: meta.coverImage
      ? meta.coverImage.startsWith("http")
        ? meta.coverImage
        : `${siteUrl}${meta.coverImage}`
      : `${siteUrl}/1764558900283.png`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="py-12 sm:py-16">
        <BlogLayout meta={meta} headings={headings}>
          {content}
        </BlogLayout>
      </main>
    </>
  )
}
