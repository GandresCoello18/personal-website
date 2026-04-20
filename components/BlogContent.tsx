import type { ReactNode } from "react"

type BlogContentProps = {
  children: ReactNode
}

/**
 * Wraps compiled MDX with consistent typography (headings, lists, quotes, tables from GFM).
 */
export function BlogContent({ children }: BlogContentProps) {
  return (
    <div
      className={[
        "blog-mdx max-w-none text-muted-foreground",
        "[&_h2]:scroll-mt-24 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
        "[&_h3]:scroll-mt-24 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_p]:my-4 [&_p]:text-base [&_p]:leading-relaxed",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1.5",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic",
        "[&_hr]:my-10 [&_hr]:border-border",
        "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
        "[&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-foreground",
        "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
      ].join(" ")}
    >
      {children}
    </div>
  )
}
