import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getAllCaseSlugs, readCaseFile } from "./cases.ts"
import {
  caseBodyForEnv,
  draftNoteHtml,
  productionContentHasDraftLeak,
  shouldShowDrafts,
  withDraftEnv,
} from "./draft.ts"

function headingTexts(body: string): string[] {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1])
}

function draftQuestions(body: string): string[] {
  return [...body.matchAll(/<DraftSection\b[^>]*question="([^"]*)"/g)].map((match) => match[1])
}

function renderProductionCaseHtml(slug: string): string {
  return withDraftEnv({ NODE_ENV: "production" }, () => {
    const file = readCaseFile(slug)
    assert.ok(file, `missing case ${slug}`)
    const body = caseBodyForEnv(file.body)
    const draftHtml = draftQuestions(file.body)
      .map((question) => draftNoteHtml(question))
      .join("")
    return `${body}\n${draftHtml}`
  })
}

describe("case draft visibility", () => {
  it("hides drafts in production unless the preview flag is set", () => {
    assert.equal(shouldShowDrafts({ NODE_ENV: "production" }), false)
    assert.equal(shouldShowDrafts({ NODE_ENV: "development" }), true)
    assert.equal(shouldShowDrafts({ NODE_ENV: "test" }), true)
    assert.equal(shouldShowDrafts({ NODE_ENV: "production", CASE_DRAFT_PREVIEW: "1" }), true)
  })

  it("fails if production-rendered case content contains TODO( or Borrador", () => {
    const slugs = getAllCaseSlugs()
    assert.ok(slugs.length > 0)

    for (const slug of slugs) {
      const html = renderProductionCaseHtml(slug)
      assert.equal(
        productionContentHasDraftLeak(html),
        false,
        `${slug} leaked draft markers in production HTML:\n${html}`,
      )
    }
  })

  it("drops empty draft-only sections from the production outline", () => {
    const meniuz = readCaseFile("meniuz")
    const order = readCaseFile("order-lifecycle")
    assert.ok(meniuz)
    assert.ok(order)

    const meniuzProd = caseBodyForEnv(meniuz.body, { NODE_ENV: "production" })
    const orderProd = caseBodyForEnv(order.body, { NODE_ENV: "production" })

    assert.deepEqual(headingTexts(meniuzProd), [
      "Contexto",
      "Problema",
      "Decisiones",
      "Arquitectura",
      "Resultados",
    ])
    assert.deepEqual(headingTexts(orderProd), [
      "Contexto",
      "Problema",
      "Decisiones",
      "Arquitectura",
    ])
    assert.ok(
      headingTexts(caseBodyForEnv(meniuz.body, { NODE_ENV: "development" })).includes(
        "Qué haría distinto",
      ),
    )
  })

  it("renders the draft note in development and nothing in production", () => {
    const prod = draftNoteHtml("¿x?", { NODE_ENV: "production" })
    const dev = draftNoteHtml("¿x?", { NODE_ENV: "development" })

    assert.equal(prod, "")
    assert.ok(dev.includes("TODO("))
    assert.ok(dev.includes("Borrador"))
  })
})
