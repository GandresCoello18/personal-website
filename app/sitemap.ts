import type { MetadataRoute } from "next"

import { getAllCases } from "@/lib/cases"
import { getAllPosts } from "@/lib/mdx"
import { getSiteUrl } from "@/lib/site"
import { getAllVideos } from "@/lib/videos"

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const posts = getAllPosts()
  const videos = getAllVideos()

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/sobre-mi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/mentoria`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...getAllCases().map((item) => ({
      url: `${siteUrl}/proyectos/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    {
      url: `${siteUrl}/blog`,
      lastModified: posts[0] ? new Date(posts[0].date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${siteUrl}/videos`,
      lastModified: videos[0] ? new Date(videos[0].date) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...videos.map((video) => ({
      url: `${siteUrl}/videos/${video.slug}`,
      lastModified: new Date(video.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
