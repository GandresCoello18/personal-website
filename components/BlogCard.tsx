"use client"

import Image from "next/image"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { FileText } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrackedLink } from "@/components/tracked-link"
import type { BlogPostMeta } from "@/lib/mdx"
import { UmamiEvents } from "@/lib/umami"

type BlogCardProps = {
  post: BlogPostMeta
}

export function BlogCard({ post }: BlogCardProps) {
  const dateLabel = format(new Date(post.date), "d MMM yyyy", { locale: es })

  return (
    <TrackedLink
      href={`/blog/${post.slug}`}
      event={UmamiEvents.blogPostClick}
      eventData={{ slug: post.slug }}
      className="group block h-full"
    >
      <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-none border-border p-0 shadow-none">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-border bg-muted">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={`Portada: ${post.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted" aria-hidden>
              <FileText className="size-14 text-muted-foreground" strokeWidth={1.25} />
            </div>
          )}
        </div>
        <CardHeader className="flex-1 gap-2 border-t border-border px-5 pb-5 pt-4 sm:px-6">
          <time className="font-mono text-xs text-muted-foreground" dateTime={post.date}>
            {dateLabel}
          </time>
          <CardTitle className="text-xl font-medium tracking-[-0.02em] text-foreground">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-base">{post.description}</CardDescription>
        </CardHeader>
      </Card>
    </TrackedLink>
  )
}
