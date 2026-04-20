type YouTubeEmbedProps = {
  /** YouTube video ID (e.g. from youtube.com/watch?v=...) */
  id: string
  title?: string
}

/** MDX shortcode: `<YouTube id="dQw4w9WgXcQ" title="..." />` */
export function YouTubeEmbed({ id, title = "YouTube video" }: YouTubeEmbedProps) {
  if (!id) return null
  return (
    <div className="my-8 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted/30 shadow-sm">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
