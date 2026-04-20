import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Slugger from "github-slugger"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ReactElement } from "react"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import { rehypePrettyBlogPlugin } from "@/lib/rehype-pretty-blog"
import { getMdxComponents } from "@/components/mdx-components"

/** Root folder for MDX blog files (add new `.mdx` files here). */
const BLOG_CONTENT_DIR = path.join(process.cwd(), "content", "blog")

export type BlogFrontmatter = {
  title: string
  description: string
  /** ISO date string (e.g. 2026-04-15) */
  date: string
  tags: string[]
  /** Path under `public/` or absolute URL */
  coverImage?: string
}

export type BlogPostMeta = BlogFrontmatter & {
  slug: string
}

export type TocHeading = {
  id: string
  text: string
  depth: 2 | 3
}

/**
 * Strips fenced code blocks so heading-like lines inside examples are ignored.
 */
function stripFencedCode(source: string): string {
  return source.replace(/```[\s\S]*?```/g, "")
}

/**
 * Builds TOC entries; IDs match `rehype-slug` / GitHub-style slugs (with duplicate handling).
 */
export function extractTocHeadings(mdxBody: string): TocHeading[] {
  const slugger = new Slugger()
  const cleaned = stripFencedCode(mdxBody)
  const lines = cleaned.split(/\r?\n/)
  const headings: TocHeading[] = []

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim())
    if (!match) continue
    const depth = match[1].length as 2 | 3
    const text = match[2].replace(/\s+#+\s*$/, "").trim()
    const id = slugger.slug(text)
    headings.push({ id, text, depth })
  }

  return headings
}

function parseFrontmatter(raw: string): { data: BlogFrontmatter; content: string } {
  const { data, content } = matter(raw)
  const fm = data as Partial<BlogFrontmatter>
  if (!fm.title || !fm.description || !fm.date || !Array.isArray(fm.tags)) {
    throw new Error("Invalid blog frontmatter: title, description, date, and tags are required.")
  }
  return {
    data: {
      title: fm.title,
      description: fm.description,
      date: fm.date,
      tags: fm.tags,
      coverImage: fm.coverImage,
    },
    content,
  }
}

/** Fast listing: reads each file once for metadata only. */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_CONTENT_DIR)) return []

  const files = fs.readdirSync(BLOG_CONTENT_DIR).filter((f) => f.endsWith(".mdx"))
  const posts: BlogPostMeta[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_CONTENT_DIR, file), "utf8")
    const { data } = parseFrontmatter(raw)
    posts.push({
      ...data,
      slug: file.replace(/\.mdx$/, ""),
    })
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export type CompiledPost = {
  meta: BlogPostMeta
  headings: TocHeading[]
  content: ReactElement
}

export async function getPostBySlug(slug: string): Promise<CompiledPost | null> {
  const filePath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content: mdxBody } = parseFrontmatter(raw)
  const headings = extractTocHeadings(mdxBody)

  const { content } = await compileMDX({
    source: mdxBody,
    components: getMdxComponents(),
    options: {
      // Allow MDX JSX (embedded components); content is trusted local files only.
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        /** Pretty-code antes de slug: convierte fences en <figure>+Shiki. */
        rehypePlugins: [rehypePrettyBlogPlugin, rehypeSlug],
      },
    },
  })

  return {
    meta: { ...data, slug },
    headings,
    content,
  }
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}
