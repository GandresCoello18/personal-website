import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, it } from "node:test"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")
const RESILIENCIA_SLUG = "resiliencia-backend-nodejs"

describe("blog posts", () => {
  it("publishes the resiliencia article with the live date and cover", () => {
    const files = readdirSync(BLOG_DIR).filter((name) => name.endsWith(".mdx"))
    assert.ok(files.includes(`${RESILIENCIA_SLUG}.mdx`))

    const raw = readFileSync(path.join(BLOG_DIR, `${RESILIENCIA_SLUG}.mdx`), "utf8")
    assert.match(raw, /date: "2026-10-17"/)
    assert.match(raw, /coverImage: "\/blog\/resiliencia-backend-nodejs\/timeouts.png"/)
  })

  it("keeps LinkedIn profile links and only the three resiliencia diagrams", () => {
    const raw = readFileSync(path.join(BLOG_DIR, `${RESILIENCIA_SLUG}.mdx`), "utf8")

    assert.doesNotMatch(raw, /\[enlace\]/)
    assert.doesNotMatch(raw, /fallback\.png|graceful-degradation/)
    assert.doesNotMatch(raw, /```mermaid/)
    assert.match(raw, /linkedin\.com\/in\/andrescoellogoyes/)
    assert.match(raw, /bulkhead\.png/)
    assert.match(raw, /health-checks\.png/)
  })
})
