import type { Metadata } from "next"
import { VideoCard } from "@/components/VideoCard"
import { getAllVideos } from "@/lib/videos"
import { getSiteUrl } from "@/lib/site"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Resúmenes y charlas en video sobre desarrollo web, programación y carrera tech.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Videos | Andres Coello",
    description:
      "Resúmenes y charlas en video sobre desarrollo web, programación y carrera tech.",
    url: `${siteUrl}/videos`,
    type: "website",
  },
}

export default function VideosIndexPage() {
  const videos = getAllVideos()

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Videos</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Resúmenes de charlas y contenido en YouTube: mira el video y repasa los puntos clave sin perder tiempo.
        </p>
      </header>

      {videos.length === 0 ? (
        <p className="text-muted-foreground">Aún no hay videos. Añade un archivo `.mdx` en `content/videos`.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <li key={video.slug}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
