import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlogCard } from "@/components/BlogCard"
import { getAllPosts } from "@/lib/mdx"

/** Vista previa en inicio: los 2 posts más recientes (mismo orden y cards que `/blog`). */
export function BlogSection() {
  const posts = getAllPosts().slice(0, 2)
  if (posts.length === 0) return null

  return (
    <section
      id="blog"
      className="border-y border-border bg-background py-20 md:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="blog-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Blog</p>
          <h2 id="blog-heading" className="section-title">
            Últimos artículos
          </h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Notas sobre aprendizaje, carrera y desarrollo: lo mismo que lees en el blog, en formato breve para descubrir si te interesa
            profundizar.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <BlogCard post={post} />
            </li>
          ))}
        </ul>

        <div className="mt-12 flex justify-center">
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            Ver más artículos
            <ArrowRight className="size-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
