"use client"

import Image from "next/image"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrackedLink } from "@/components/tracked-link"
import type { VideoMeta } from "@/lib/videos"
import { UmamiEvents } from "@/lib/umami"

type VideoCardProps = {
  video: VideoMeta
}

export function VideoCard({ video }: VideoCardProps) {
  const dateLabel = format(new Date(video.date), "d MMM yyyy", { locale: es })

  return (
    <TrackedLink
      href={`/videos/${video.slug}`}
      event={UmamiEvents.videoClick}
      eventData={{ slug: video.slug }}
      className="group block h-full"
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-none border-border p-0 shadow-none">
        <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border bg-muted">
          <Image
            src={video.thumbnailUrl}
            alt={`Miniatura: ${video.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
            unoptimized
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-background/20"
            aria-hidden
          >
            <span className="flex size-11 items-center justify-center border border-border bg-background text-foreground">
              <Play className="ml-0.5 size-5 fill-current" strokeWidth={0} />
            </span>
          </div>
          {video.duration ? (
            <span className="absolute bottom-2 right-2 border border-border bg-background px-2 py-0.5 font-mono text-xs tabular-nums text-foreground">
              {video.duration}
            </span>
          ) : null}
        </div>
        <CardHeader className="flex-1 gap-2 border-t border-border px-5 pb-5 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <time className="font-mono text-xs text-muted-foreground" dateTime={video.date}>
              {dateLabel}
            </time>
            <Badge variant="secondary" className="text-xs font-normal">
              Video
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 text-xl font-medium tracking-[-0.02em] text-foreground">
            {video.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-base">{video.description}</CardDescription>
          {video.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {video.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="font-normal text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardHeader>
      </Card>
    </TrackedLink>
  )
}
