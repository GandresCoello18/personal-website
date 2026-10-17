import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  IN_REQUEST_BACKOFF_MS,
  getHttpStatus,
  inRequestBackoffMs,
  isRetryableError,
  parseRetryAfterMs,
  withInRequestRetries,
} from "./retry.ts"

describe("isRetryableError", () => {
  it("retries 429, 503, overload and saturation copy", () => {
    assert.equal(isRetryableError(new Error("[429 Too Many Requests] Resource exhausted")), true)
    assert.equal(isRetryableError(new Error("[503 Service Unavailable] high demand")), true)
    assert.equal(isRetryableError({ status: 429, message: "quota" }), true)
    assert.equal(
      isRetryableError(new Error("The model is overloaded. Please try again later.")),
      true,
    )
    assert.equal(isRetryableError(new Error("Gemini está saturado (alta demanda).")), true)
  })

  it("retries network and timeout failures", () => {
    assert.equal(isRetryableError(new Error("Timeout: Gemini no respondió en 55s.")), true)
    assert.equal(isRetryableError(new Error("fetch failed")), true)
    assert.equal(isRetryableError(new Error("ECONNRESET")), true)
    assert.equal(isRetryableError({ code: "ETIMEDOUT", message: "connect ETIMEDOUT" }), true)
  })

  it("fails immediately on non-retryable 4xx", () => {
    assert.equal(isRetryableError(new Error("[400 Bad Request] INVALID_ARGUMENT")), false)
    assert.equal(isRetryableError({ status: 400, message: "bad request" }), false)
    assert.equal(isRetryableError({ status: 401, message: "API key" }), false)
    assert.equal(isRetryableError({ status: 403, message: "blocked" }), false)
    assert.equal(getHttpStatus(new Error("[400 Bad Request]")), 400)
  })
})

describe("inRequestBackoffMs", () => {
  it("uses ~1s then ~3s with jitter", () => {
    const first = inRequestBackoffMs(1, null, { random: () => 0.5 })
    const second = inRequestBackoffMs(2, null, { random: () => 0.5 })
    assert.equal(first, IN_REQUEST_BACKOFF_MS[0])
    assert.equal(second, IN_REQUEST_BACKOFF_MS[1])
    const low = inRequestBackoffMs(1, null, { random: () => 0 })
    const high = inRequestBackoffMs(1, null, { random: () => 1 })
    assert.equal(low, 800)
    assert.equal(high, 1200)
  })

  it("honors Retry-After when it is larger than the nominal backoff", () => {
    const wait = inRequestBackoffMs(1, 5_000, { random: () => 0.5 })
    assert.equal(wait, 5_000)
  })

  it("caps Retry-After so the in-request wait stays short", () => {
    const wait = inRequestBackoffMs(1, 60_000, { random: () => 0.5 })
    assert.equal(wait, 8_000)
  })
})

describe("parseRetryAfterMs", () => {
  it("reads Retry-After and Google retryDelay", () => {
    assert.equal(parseRetryAfterMs(new Error("Retry-After: 4")), 4_000)
    assert.equal(parseRetryAfterMs({ retryDelay: "2.5s" }), 2_500)
    assert.equal(parseRetryAfterMs({ errorDetails: [{ retryDelay: "8s" }] }), 8_000)
  })
})

describe("withInRequestRetries", () => {
  it("retries twice on retryable errors then succeeds", async () => {
    let calls = 0
    const sleeps: number[] = []
    const value = await withInRequestRetries(
      async () => {
        calls += 1
        if (calls < 3) throw new Error("[429] Resource exhausted")
        return "ok"
      },
      {
        sleep: async (ms) => {
          sleeps.push(ms)
        },
        random: () => 0.5,
      },
    )
    assert.equal(value, "ok")
    assert.equal(calls, 3)
    assert.deepEqual(sleeps, [1_000, 3_000])
  })

  it("does not retry a 400", async () => {
    let calls = 0
    await assert.rejects(
      () =>
        withInRequestRetries(async () => {
          calls += 1
          throw new Error("[400 Bad Request] INVALID_ARGUMENT")
        }),
      /INVALID_ARGUMENT/,
    )
    assert.equal(calls, 1)
  })
})
