import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { VideoLayout } from "@/components/VideoLayout"
import { getBreadcrumbJsonLd } from "@/lib/json-ld"
import { absoluteUrl, getSiteUrl } from "@/lib/site"
import { getAllVideoSlugs, getVideoBySlug } from "@/lib/videos"

type PageProps = {
  params: Promise<{ slug: string }>
}

const siteUrl = getSiteUrl()

export async function generateStaticParams() {
  return getAllVideoSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  if (!video) return { title: "Video no encontrado" }

  const { meta } = video
  const url = `${siteUrl}/videos/${meta.slug}`
  const ogImage = meta.thumbnailUrl.startsWith("http")
    ? meta.thumbnailUrl
    : absoluteUrl(meta.thumbnailUrl)

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    alternates: { canonical: `/videos/${meta.slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "video.other",
      url,
      images: [{ url: ogImage, width: 1280, height: 720, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
  }
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  if (!video) notFound()

  const { meta, content } = video
  const videoUrl = `${siteUrl}/videos/${meta.slug}`
  const thumbnailUrl = meta.thumbnailUrl.startsWith("http")
    ? meta.thumbnailUrl
    : absoluteUrl(meta.thumbnailUrl)

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: meta.title,
    description: meta.description,
    uploadDate: meta.date,
    thumbnailUrl,
    embedUrl: `https://www.youtube-nocookie.com/embed/${meta.youtubeId}${
      meta.youtubeStart ? `?start=${meta.youtubeStart}` : ""
    }`,
    url: videoUrl,
    author: {
      "@type": "Person",
      name: "Andres Coello",
      url: siteUrl,
    },
  }

  const breadcrumbJsonLd = getBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Videos", path: "/videos" },
    { name: meta.title, path: `/videos/${meta.slug}` },
  ])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <main className="py-12 sm:py-16">
        <VideoLayout meta={meta}>{content}</VideoLayout>
      </main>
    </>
  )
}
