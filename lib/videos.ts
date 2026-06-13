import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ReactElement } from "react"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import { rehypePrettyBlogPlugin } from "@/lib/rehype-pretty-blog"
import { getMdxComponents } from "@/components/mdx-components"

/** Add new `.mdx` files here — one per video summary. */
const VIDEOS_CONTENT_DIR = path.join(process.cwd(), "content", "videos")

export type VideoFrontmatter = {
  title: string
  description: string
  /** ISO date (e.g. 2026-04-20) */
  date: string
  tags: string[]
  /** YouTube video ID (from watch?v=... or youtu.be/...) */
  youtubeId: string
  /** Optional start time in seconds (e.g. from embed ?start=...) */
  youtubeStart?: number
  /** Optional display duration, e.g. "12:34" */
  duration?: string
  /** Override thumbnail; defaults to YouTube CDN */
  coverImage?: string
}

export type VideoMeta = VideoFrontmatter & {
  slug: string
  thumbnailUrl: string
}

export function getYoutubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
}

function resolveThumbnail(data: VideoFrontmatter): string {
  if (data.coverImage) return data.coverImage
  return getYoutubeThumbnail(data.youtubeId)
}

function parseVideoFrontmatter(raw: string): { data: VideoFrontmatter; content: string } {
  const { data, content } = matter(raw)
  const fm = data as Partial<VideoFrontmatter>
  if (!fm.title || !fm.description || !fm.date || !fm.youtubeId || !Array.isArray(fm.tags)) {
    throw new Error("Invalid video frontmatter: title, description, date, youtubeId, and tags are required.")
  }
  return {
    data: {
      title: fm.title,
      description: fm.description,
      date: fm.date,
      tags: fm.tags,
      youtubeId: fm.youtubeId,
      youtubeStart: typeof fm.youtubeStart === "number" ? fm.youtubeStart : undefined,
      duration: fm.duration,
      coverImage: fm.coverImage,
    },
    content,
  }
}

export function getAllVideos(): VideoMeta[] {
  if (!fs.existsSync(VIDEOS_CONTENT_DIR)) return []

  const files = fs.readdirSync(VIDEOS_CONTENT_DIR).filter((f) => f.endsWith(".mdx"))
  const videos: VideoMeta[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(VIDEOS_CONTENT_DIR, file), "utf8")
    const { data } = parseVideoFrontmatter(raw)
    videos.push({
      ...data,
      slug: file.replace(/\.mdx$/, ""),
      thumbnailUrl: resolveThumbnail(data),
    })
  }

  return videos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export type CompiledVideo = {
  meta: VideoMeta
  content: ReactElement | null
}

export async function getVideoBySlug(slug: string): Promise<CompiledVideo | null> {
  const filePath = path.join(VIDEOS_CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content: mdxBody } = parseVideoFrontmatter(raw)
  const meta: VideoMeta = {
    ...data,
    slug,
    thumbnailUrl: resolveThumbnail(data),
  }

  if (!mdxBody.trim()) {
    return { meta, content: null }
  }

  const { content } = await compileMDX({
    source: mdxBody,
    components: getMdxComponents(),
    options: {
      blockJS: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypePrettyBlogPlugin, rehypeSlug],
      },
    },
  })

  return { meta, content }
}

export function getAllVideoSlugs(): string[] {
  return getAllVideos().map((v) => v.slug)
}
