import { ArrowRight } from "lucide-react"
import { VideoCard } from "@/components/VideoCard"
import { TrackedLink } from "@/components/tracked-link"
import { getAllVideos } from "@/lib/videos"
import { UmamiEvents } from "@/lib/umami"

/** Home preview: latest 2 video summaries (same cards as `/videos`). */
export function VideosSection() {
  const videos = getAllVideos().slice(0, 2)
  if (videos.length === 0) return null

  return (
    <section
      id="videos"
      className="border-y border-border bg-muted/30 py-20 md:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="videos-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">YouTube</p>
          <h2 id="videos-heading" className="section-title">
            Resúmenes en video
          </h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Charlas, tutoriales y aprendizajes en formato video con notas y puntos clave para repasar rápido.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {videos.map((video) => (
            <li key={video.slug}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <TrackedLink
            href="/videos"
            event={UmamiEvents.videosCta}
            eventData={{ source: "home" }}
            className="btn-primary inline-flex items-center gap-2"
          >
            Ver más videos
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
