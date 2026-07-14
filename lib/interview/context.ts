import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CV_DIR = path.join(process.cwd(), "content", "cv")
const FACTS_PATH = path.join(process.cwd(), "content", "profile", "career-facts.md")
const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const VIDEOS_DIR = path.join(process.cwd(), "content", "videos")

const MAX_CV_CHARS = 3_500
const MAX_FACTS_CHARS = 3_000
const MAX_CHUNK_CHARS = 700
const TOP_CHUNKS = 5
const MAX_CONTEXT_CHARS = 12_000

type ContentChunk = {
  id: string
  source: string
  text: string
  tokens: Set<string>
}

let chunkIndexCache: ContentChunk[] | null = null

function truncate(text: string, max: number): string {
  const t = text.replace(/\s+\n/g, "\n").trim()
  return t.length > max ? `${t.slice(0, max)}\n…` : t
}

function tokenize(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+#.)]+/)
    .filter((w) => w.length >= 2)
  return new Set(words)
}

function stripMdxBody(raw: string): string {
  const { content } = matter(raw)
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/import\s.+from\s.+;?/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*]\([^)]+\)/g, (m) => m.replace(/\[|\]|\([^)]*\)/g, ""))
    .replace(/#{1,6}\s*/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function chunkText(source: string, body: string): ContentChunk[] {
  const paragraphs = body
    .split(/(?<=\.)\s+|\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40)

  const chunks: ContentChunk[] = []
  let buffer = ""
  let i = 0

  const flush = () => {
    if (!buffer.trim()) return
    const text = truncate(buffer, MAX_CHUNK_CHARS)
    chunks.push({
      id: `${source}#${i++}`,
      source,
      text,
      tokens: tokenize(text),
    })
    buffer = ""
  }

  for (const p of paragraphs) {
    if ((buffer + " " + p).length > MAX_CHUNK_CHARS && buffer) flush()
    buffer = buffer ? `${buffer} ${p}` : p
  }
  flush()
  return chunks
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dir, f))
}

function buildChunkIndex(): ContentChunk[] {
  if (chunkIndexCache) return chunkIndexCache

  const chunks: ContentChunk[] = []
  for (const file of [...listMdxFiles(BLOG_DIR), ...listMdxFiles(VIDEOS_DIR)]) {
    const raw = fs.readFileSync(file, "utf8")
    const slug = path.basename(file, ".mdx")
    const body = stripMdxBody(raw)
    if (!body) continue
    chunks.push(...chunkText(slug, body))
  }

  chunkIndexCache = chunks
  return chunks
}

function scoreChunk(queryTokens: Set<string>, chunk: ContentChunk): number {
  let score = 0
  for (const t of queryTokens) {
    if (chunk.tokens.has(t)) score += t.length >= 4 ? 2 : 1
  }
  return score
}

function readCv(name: "software" | "education"): string {
  const p = path.join(CV_DIR, `${name}.txt`)
  if (!fs.existsSync(p)) return ""
  return truncate(fs.readFileSync(p, "utf8"), MAX_CV_CHARS)
}

function readFacts(): string {
  if (!fs.existsSync(FACTS_PATH)) return ""
  return truncate(fs.readFileSync(FACTS_PATH, "utf8"), MAX_FACTS_CHARS)
}

/** Build RAG-lite context for interview Q&A. */
export function buildInterviewContext(questionsText: string): string {
  const facts = readFacts()
  const software = readCv("software")
  const education = readCv("education")
  const queryTokens = tokenize(questionsText)

  const scored = buildChunkIndex()
    .map((chunk) => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_CHUNKS)

  const parts: string[] = []

  if (facts) {
    parts.push("## CAREER FACTS (prioridad para años de experiencia)\n" + facts)
  }
  if (software) {
    parts.push("## CV SOFTWARE\n" + software)
  }
  if (education) {
    parts.push("## CV EDUCATION / MENTORÍA\n" + education)
  }
  if (scored.length) {
    parts.push(
      "## CONTENIDO RELACIONADO (blog/videos)\n" +
        scored.map((s) => `[${s.chunk.source}]\n${s.chunk.text}`).join("\n\n"),
    )
  }

  let context = parts.join("\n\n---\n\n")
  if (context.length > MAX_CONTEXT_CHARS) {
    context = context.slice(0, MAX_CONTEXT_CHARS) + "\n…"
  }
  return context
}
