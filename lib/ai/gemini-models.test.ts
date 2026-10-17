import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  DEFAULT_GEMINI_FALLBACK_MODELS,
  DEFAULT_GEMINI_MODEL,
  isFreeTierGeminiModel,
  resolveGeminiModelChain,
} from "./gemini-models.ts"

describe("gemini free-tier allowlist", () => {
  it("keeps the current default and only free-tier fallbacks", () => {
    assert.equal(DEFAULT_GEMINI_MODEL, "gemini-3.1-flash-lite")
    assert.equal(isFreeTierGeminiModel(DEFAULT_GEMINI_MODEL), true)
    for (const model of DEFAULT_GEMINI_FALLBACK_MODELS) {
      assert.equal(isFreeTierGeminiModel(model), true)
    }
    assert.equal(isFreeTierGeminiModel("gemini-3.1-pro-preview"), false)
    assert.equal(isFreeTierGeminiModel("gemini-2.5-pro"), false)
  })

  it("drops paid or unknown models from env", () => {
    const chain = resolveGeminiModelChain({
      GEMINI_MODEL: "gemini-2.5-pro",
      GEMINI_FALLBACK_MODELS: "gemini-3.5-flash-lite,gemini-3.1-pro-preview,gemini-2.5-flash",
    })
    assert.deepEqual(chain, ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-2.5-flash"])
  })

  it("uses the documented default fallback when env is unset", () => {
    const chain = resolveGeminiModelChain({})
    assert.equal(chain[0], "gemini-3.1-flash-lite")
    assert.ok(chain.includes("gemini-3.5-flash-lite"))
  })
})
