import type { TocHeading } from "@/lib/mdx"

type TableOfContentsProps = {
  headings: TocHeading[]
}

/**
 * Sticky outline for long posts; links match `rehype-slug` heading IDs.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null

  return (
    <nav
      aria-label="En esta página"
      className="lg:sticky lg:top-28 lg:self-start"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        En esta página
      </p>
      <ul className="space-y-2 text-sm">
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.depth === 3 ? "pl-3 border-l border-border" : ""}
          >
            <a
              href={`#${h.id}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
