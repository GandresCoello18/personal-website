import Image from "next/image"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import type { BlogPostMeta } from "@/lib/mdx"
import { BlogContent } from "@/components/BlogContent"
import { TableOfContents } from "@/components/TableOfContents"
import type { TocHeading } from "@/lib/mdx"

type BlogLayoutProps = {
  meta: BlogPostMeta
  headings: TocHeading[]
  children: ReactNode
}

export function BlogLayout({ meta, headings, children }: BlogLayoutProps) {
  const published = format(new Date(meta.date), "d MMMM yyyy", { locale: es })
  const showToc = headings.length >= 2

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{meta.title}</h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">{meta.description}</p>
        <p className="mt-6">
          <time className="text-sm text-muted-foreground" dateTime={meta.date}>
            Publicado el {published}
          </time>
        </p>
        {meta.coverImage ? (
          <div className="blog-post-cover mt-8 w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
            <Image
              src={meta.coverImage}
              alt={meta.title}
              width={1200}
              height={630}
              className="h-auto max-h-[min(85vh,720px)] w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, min(1152px, 100vw)"
            />
          </div>
        ) : null}
      </header>

      <div
        className={
          showToc
            ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start"
            : undefined
        }
      >
        <BlogContent>{children}</BlogContent>
        {showToc ? <TableOfContents headings={headings} /> : null}
      </div>
    </article>
  )
}
