import { compileMDX } from "next-mdx-remote/rsc"
import type { ReactElement } from "react"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import { getCaseMdxComponents } from "@/components/cases/mdx-components"
import { extractTocHeadings, type TocHeading } from "@/lib/mdx"
import { rehypePrettyBlogPlugin } from "@/lib/rehype-pretty-blog"
import { readCaseFile, type CaseMeta } from "./cases.ts"

export type CompiledCase = {
  meta: CaseMeta
  headings: TocHeading[]
  content: ReactElement
}

export async function getCaseBySlug(slug: string): Promise<CompiledCase | null> {
  const file = readCaseFile(slug)
  if (!file) return null

  const headings = extractTocHeadings(file.body)
  const { content } = await compileMDX({
    source: file.body,
    components: getCaseMdxComponents(),
    options: {
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypePrettyBlogPlugin, rehypeSlug],
      },
    },
  })

  return {
    meta: file.meta,
    headings,
    content,
  }
}
