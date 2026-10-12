import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { SKILL_GROUPS } from "./skills.ts"

const HEADLINE_DENYLIST = ["REST", "Express", "CI/CD", "React", "MySQL", "MongoDB", "Terraform"]

describe("home skill chips", () => {
  it("publishes the approved groups in order", () => {
    assert.deepEqual(
      SKILL_GROUPS.map((group) => [group.title, group.skills]),
      [
        [
          "Backend",
          ["Node.js", "TypeScript", "NestJS", "Fastify", "GraphQL", "PostgreSQL", "Prisma"],
        ],
        ["Cloud", ["Docker", "AWS EC2", "Vercel"]],
        ["IA/ERP", ["LLM", "RAG", "Gemini", "Qdrant", "Odoo"]],
        ["Clientes", ["Next.js", "React Native", "Expo", "Flutter"]],
      ],
    )
  })

  it("keeps demoted technologies off the headline chips", () => {
    const chips = SKILL_GROUPS.flatMap((group) => group.skills)
    for (const banned of HEADLINE_DENYLIST) {
      assert.equal(chips.includes(banned), false, banned)
    }
  })
})
