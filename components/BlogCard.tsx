import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { FileText } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlogPostMeta } from "@/lib/mdx"

type BlogCardProps = {
  post: BlogPostMeta
}

export function BlogCard({ post }: BlogCardProps) {
  const dateLabel = format(new Date(post.date), "d MMM yyyy", { locale: es })

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col gap-0 overflow-hidden p-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={`Portada: ${post.title}`}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 560px"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-muted/80"
              aria-hidden
            >
              <FileText className="size-14 text-muted-foreground/40" strokeWidth={1.25} />
            </div>
          )}
        </div>
        <CardHeader className="flex-1 gap-2 border-t border-border/60 px-5 pb-5 pt-4 sm:px-6">
          <time className="text-xs text-muted-foreground" dateTime={post.date}>
            {dateLabel}
          </time>
          <CardTitle className="text-xl transition-colors group-hover:text-primary">{post.title}</CardTitle>
          <CardDescription className="line-clamp-3 text-base">{post.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
