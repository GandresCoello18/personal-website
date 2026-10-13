import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, it } from "node:test"
import { fileURLToPath } from "node:url"

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const html = readFileSync(path.join(root, "cv/software.html"), "utf8")

describe("software CV source", () => {
  it("keeps literal bullets and the approved DevLokos facts", () => {
    assert.match(html, /<li>\s*• /)
    assert.match(html, /Automaticé/)
    assert.doesNotMatch(html, /Automatizé/)
    assert.match(html, /<span class="role">Backend Engineer<\/span>/)
    assert.doesNotMatch(html, /Odoo Integrations/)
    assert.match(html, /Importadora Sacón/)
    assert.match(html, /Payphone/)
    assert.match(html, /NestJS, Node\.js, PostgreSQL, Prisma/)
    assert.doesNotMatch(html, /Order Lifecycle/)
  })
})
