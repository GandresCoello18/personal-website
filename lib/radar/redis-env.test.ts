import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getRedisCredentials } from "./redis-env.ts"

describe("getRedisCredentials", () => {
  it("prefers UPSTASH_* over KV_*", () => {
    const creds = getRedisCredentials({
      UPSTASH_REDIS_REST_URL: "https://upstash.example",
      UPSTASH_REDIS_REST_TOKEN: "upstash-token",
      KV_REST_API_URL: "https://kv.example",
      KV_REST_API_TOKEN: "kv-token",
    })
    assert.deepEqual(creds, {
      url: "https://upstash.example",
      token: "upstash-token",
      source: "upstash",
    })
  })

  it("falls back to KV_* when Upstash is missing", () => {
    const creds = getRedisCredentials({
      KV_REST_API_URL: "https://kv.example",
      KV_REST_API_TOKEN: "kv-token",
    })
    assert.deepEqual(creds, {
      url: "https://kv.example",
      token: "kv-token",
      source: "kv",
    })
  })

  it("returns null when neither pair is complete", () => {
    assert.equal(getRedisCredentials({ UPSTASH_REDIS_REST_URL: "https://x" }), null)
    assert.equal(getRedisCredentials({}), null)
  })
})
