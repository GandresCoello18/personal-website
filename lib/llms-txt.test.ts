import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, it } from "node:test"
import { PERSON_NAME, PERSON_SAME_AS } from "./identity.ts"

describe("public/llms.txt", () => {
  const text = readFileSync(path.join(process.cwd(), "public/llms.txt"), "utf8")

  it("summarizes the confirmed identity and key URLs", () => {
    assert.ok(text.includes(PERSON_NAME))
    assert.ok(text.includes("/sobre-mi"))
    assert.ok(text.includes("/proyectos"))
    assert.ok(text.includes("/blog"))
    assert.ok(text.includes("/videos"))
    assert.ok(text.includes("Andres_Coello_Goyes_full_stack_developer_2026.pdf"))
    for (const profile of PERSON_SAME_AS) {
      assert.ok(text.includes(profile.href), `missing ${profile.label}`)
    }
    assert.equal(/\bCTO\b/i.test(text), false)
    assert.equal(/\bKubernetes\b/i.test(text), false)
  })
})
