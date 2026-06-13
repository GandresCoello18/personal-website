type YouTubeEmbedProps = {
  /** YouTube video ID (e.g. from youtube.com/watch?v=...) */
  id: string
  title?: string
  className?: string
  /** Start playback at this second (YouTube `start` param). */
  start?: number
}

/** Embeds a YouTube video (used in MDX and `/videos/[slug]`). */
export function YouTubeEmbed({ id, title = "YouTube video", className, start }: YouTubeEmbedProps) {
  if (!id) return null
  const params = new URLSearchParams()
  if (start != null && start > 0) params.set("start", String(Math.floor(start)))
  const query = params.toString()
  return (
    <div
      className={`aspect-video w-full overflow-hidden border border-border bg-muted/30 ${className ?? "my-8 rounded-xl shadow-sm"}`}
    >
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}${query ? `?${query}` : ""}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
