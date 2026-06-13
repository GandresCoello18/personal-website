import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { YouTubeEmbed } from "@/components/mdx/YouTubeEmbed"
import { BlogContent } from "@/components/BlogContent"
import type { VideoMeta } from "@/lib/videos"

type VideoLayoutProps = {
  meta: VideoMeta
  children?: ReactNode
}

export function VideoLayout({ meta, children }: VideoLayoutProps) {
  const published = format(new Date(meta.date), "d MMMM yyyy", { locale: es })

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-border pb-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{meta.title}</h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">{meta.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={meta.date}>Publicado el {published}</time>
          {meta.duration ? (
            <>
              <span aria-hidden>·</span>
              <span>Duración: {meta.duration}</span>
            </>
          ) : null}
        </div>
      </header>

      <YouTubeEmbed
        id={meta.youtubeId}
        title={meta.title}
        start={meta.youtubeStart}
        className="my-0 rounded-2xl shadow-md"
      />

      {children ? (
        <section className="mt-10 border-t border-border pt-10" aria-labelledby="video-summary-heading">
          <h2 id="video-summary-heading" className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
            Resumen
          </h2>
          <BlogContent>{children}</BlogContent>
        </section>
      ) : null}
    </article>
  )
}
