import assert from "node:assert/strict"
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { describe, it } from "node:test"

const ROOT = process.cwd()

const SCAN_ROOTS = ["app", "components", "content", "lib", "public", "README.md"]

const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".md", ".mdx", ".txt", ".json", ".html"])

const EXCLUDE_DIR_NAMES = new Set(["node_modules", ".next", ".git", "pdf"])

function isExcludedFile(rel: string): boolean {
  if (rel === "lib/copy/forbidden-words.test.ts") return true
  if (rel === "content/blog/developer-and-cto.mdx") return true
  if (rel.startsWith("docs/") || rel === "docs") return true
  if (rel.startsWith(".cursor/") || rel === ".cursor") return true
  if (rel === "UI-AUDIT.md" || rel === "DESIGN.md") return true
  return false
}

type Hit = { rule: string; file: string; excerpt: string }

function excerptAt(text: string, index: number): string {
  const start = Math.max(0, index - 40)
  const end = Math.min(text.length, index + 60)
  return text.slice(start, end).replace(/\s+/g, " ").trim()
}

function collectFiles(abs: string, rel: string, out: string[]): void {
  if (isExcludedFile(rel)) return
  const stat = statSync(abs)
  if (stat.isDirectory()) {
    if (EXCLUDE_DIR_NAMES.has(path.basename(abs))) return
    for (const name of readdirSync(abs)) {
      collectFiles(path.join(abs, name), rel ? `${rel}/${name}` : name, out)
    }
    return
  }
  if (!TEXT_EXT.has(path.extname(abs))) return
  out.push(rel)
}

const TITLE_SRE =
  /Software Engineer,?\s*SRE|\bSRE\s*\/\s*Backend|Architect\s*\/\s*SRE|\bSRE y Mentor|jobTitle[^.\n]{0,80}\bSRE\b|title:\s*["'][^"']*\bSRE\b/i

const RULES: { id: string; re: RegExp; skip?: (rel: string) => boolean }[] = [
  { id: "CTO", re: /(?<![A-Za-zÁÉÍÓÚáéíóú])CTO(?![A-Za-zÁÉÍÓÚáéíóú])/g },
  { id: "co-founder", re: /\bco-?founders?\b/gi },
  { id: "cofundador", re: /\bco-?fundador(?:a|es|as)?\b/gi },
  { id: "fundador", re: /\bfundador(?:a|es|as)?\b/gi },
  { id: "Semi-Senior", re: /\bsemi[-\s]?senior\b/gi },
  {
    id: "SRE-title",
    re: TITLE_SRE,
    skip: (rel) => rel === "lib/ai/prompts/extract-job.ts",
  },
  { id: "ZIGI", re: /zigi/gi },
  {
    id: "novacomp-app",
    re: /\b(?:app|aplicación|aplicacion)\s+(?:bancaria\s+)?["']?CG["']?\b/gi,
  },
]

function scanText(rel: string, text: string): Hit[] {
  const hits: Hit[] = []
  for (const rule of RULES) {
    if (rule.skip?.(rel)) continue
    const re = new RegExp(
      rule.re.source,
      rule.re.flags.includes("g") ? rule.re.flags : `${rule.re.flags}g`,
    )
    for (const match of text.matchAll(re)) {
      hits.push({
        rule: rule.id,
        file: rel,
        excerpt: excerptAt(text, match.index ?? 0),
      })
    }
  }
  return hits
}

describe("forbidden career copy", () => {
  it("does not treat desarrolladores or JD category lists as hits", () => {
    assert.equal(scanText("fixture.ts", "Guié a cuatro desarrolladores en un SDK.").length, 0)
    assert.equal(
      scanText("lib/ai/prompts/extract-job.ts", "mobile, devops, SRE, data engineer").length,
      0,
    )
    assert.equal(scanText("fixture.ts", "Director de ingeniería").length, 0)
    assert.ok(scanText("fixture.ts", "Rol: CTO del proyecto").length >= 1)
    assert.ok(scanText("fixture.ts", "Dirigir, como Co-founder, el SaaS").length >= 1)
    assert.ok(scanText("fixture.ts", "Full Stack Software Engineer Semi-senior").length >= 1)
    assert.ok(scanText("fixture.ts", "Backend Systems Architect / SRE").length >= 1)
    assert.ok(scanText("fixture.ts", "captura app_web_zigi.png").length >= 1)
    assert.ok(scanText("fixture.ts", "la aplicación CG del banco").length >= 1)
  })

  it("fails if site content uses a banned title or the confidential Novacomp app name", () => {
    const files: string[] = []
    for (const root of SCAN_ROOTS) {
      const abs = path.join(ROOT, root)
      try {
        collectFiles(abs, root, files)
      } catch {
        // optional path
      }
    }

    const hits = files.flatMap((rel) => scanText(rel, readFileSync(path.join(ROOT, rel), "utf8")))

    assert.equal(
      hits.length,
      0,
      hits.map((h) => `${h.file} [${h.rule}]: …${h.excerpt}…`).join("\n"),
    )
  })
})
