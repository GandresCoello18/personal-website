import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BlogCard } from "@/components/BlogCard"
import { getAllPosts } from "@/lib/mdx"
import { getSiteUrl } from "@/lib/site"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artículos sobre desarrollo web, Next.js, APIs y buenas prácticas de software.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Andres Coello",
    description:
      "Artículos sobre desarrollo web, Next.js, APIs y buenas prácticas de software.",
    url: `${siteUrl}/blog`,
    type: "website",
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Notas técnicas, aprendizajes y recursos que comparto sobre desarrollo y arquitectura de software.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Aún no hay publicaciones. Añade un archivo `.mdx` en `content/blog`.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
