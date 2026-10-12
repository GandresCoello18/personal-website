import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const CASES_DIR = path.join(process.cwd(), "content", "proyectos")
const FEATURED_ORDER = ["tayos", "meniuz", "order-lifecycle"]

export type CaseFrontmatter = {
  title: string
  description: string
  summary: string
  role: string
  period: string
  stack: string[]
  coverImage?: string
  external?: string
  github?: string
  featured: boolean
}

export type CaseMeta = CaseFrontmatter & {
  slug: string
}

export function parseCaseFrontmatter(raw: string): { data: CaseFrontmatter; content: string } {
  const { data, content } = matter(raw)
  const fm = data as Partial<CaseFrontmatter>
  if (!fm.title || !fm.description || !fm.summary || !fm.role || !fm.period) {
    throw new Error("Invalid case frontmatter: title, description, summary, role, period required.")
  }
  if (!Array.isArray(fm.stack)) {
    throw new Error("Invalid case frontmatter: stack must be an array.")
  }
  return {
    data: {
      title: fm.title,
      description: fm.description,
      summary: fm.summary,
      role: fm.role,
      period: fm.period,
      stack: fm.stack,
      coverImage: fm.coverImage,
      external: fm.external,
      github: fm.github,
      featured: fm.featured !== false,
    },
    content,
  }
}

export function getAllCases(): CaseMeta[] {
  if (!fs.existsSync(CASES_DIR)) return []

  const files = fs.readdirSync(CASES_DIR).filter((f) => f.endsWith(".mdx"))
  const cases: CaseMeta[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CASES_DIR, file), "utf8")
    const { data } = parseCaseFrontmatter(raw)
    cases.push({
      ...data,
      slug: file.replace(/\.mdx$/, ""),
    })
  }

  return cases.sort((a, b) => FEATURED_ORDER.indexOf(a.slug) - FEATURED_ORDER.indexOf(b.slug))
}

export function getFeaturedCases(): CaseMeta[] {
  return getAllCases().filter((item) => item.featured)
}

export function getAllCaseSlugs(): string[] {
  return getAllCases().map((item) => item.slug)
}

export function readCaseFile(slug: string): { meta: CaseMeta; body: string } | null {
  const filePath = path.join(CASES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = parseCaseFrontmatter(raw)
  return { meta: { ...data, slug }, body: content }
}
