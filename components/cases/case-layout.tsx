import type { ReactNode } from "react"
import { BlogContent } from "@/components/BlogContent"
import { TableOfContents } from "@/components/TableOfContents"
import type { CaseMeta } from "@/lib/cases"
import type { TocHeading } from "@/lib/mdx"

type CaseLayoutProps = {
  meta: CaseMeta
  headings: TocHeading[]
  children: ReactNode
}

export function CaseLayout({ meta, headings, children }: CaseLayoutProps) {
  const showToc = headings.length >= 2

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="mb-10 border-b border-border pb-8">
        <p className="font-mono text-sm text-muted-foreground">{meta.period}</p>
        <h1 className="mt-3 text-balance text-3xl font-medium tracking-[-0.02em] text-foreground sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{meta.role}</p>
        <p className="mt-4 max-w-prose text-pretty text-lg text-muted-foreground">
          {meta.description}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {meta.stack.map((tag) => (
            <span
              key={tag}
              className="border border-border px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className={
          showToc ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start" : undefined
        }
      >
        <BlogContent>{children}</BlogContent>
        {showToc ? <TableOfContents headings={headings} /> : null}
      </div>
    </article>
  )
}
