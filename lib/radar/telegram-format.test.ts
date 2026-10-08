import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { ApplyRecord } from "./types.ts"
import {
  TELEGRAM_MAX_CALLBACK_DATA_BYTES,
  TELEGRAM_MAX_MESSAGE_CHARS,
  callbackData,
  clipTelegramText,
  escapeTelegramHtml,
  formatManualApplyNotice,
  formatYaResponse,
  splitTelegramMessages,
  utf8ByteLength,
} from "./telegram-format.ts"

function record(overrides: Partial<ApplyRecord> = {}): ApplyRecord {
  return {
    fp: "9c1e5a77d2b04f13",
    urlKey: "li:job:4012345678",
    company: "Acme Cloud",
    position: "Full Stack Developer",
    email: "talento@acme.example",
    channel: "apply_manual",
    appliedAt: "2026-10-05T15:42:30.000Z",
    identityWeak: false,
    ...overrides,
  }
}

describe("escapeTelegramHtml", () => {
  it("escapes company names inside the manual notice", () => {
    const text = formatManualApplyNotice(
      record({ company: "Acme <script>alert(1)</script> & Co", position: "Dev" }),
    )
    assert.equal(text.includes("<script>"), false)
    assert.ok(text.includes("&lt;script&gt;"))
    assert.ok(text.includes("&amp;"))
    assert.match(text, /Postulación manual registrada/)
  })

  it("shows <script> and & literally", () => {
    assert.equal(
      escapeTelegramHtml('<script>alert("x")</script> & más'),
      '&lt;script&gt;alert("x")&lt;/script&gt; &amp; más',
    )
  })

  it("does not escape quotes (Telegram HTML only needs & < >)", () => {
    assert.equal(escapeTelegramHtml(`"hola"`), `"hola"`)
  })
})

describe("callback_data", () => {
  it("stays at or under 64 bytes for normal tokens", () => {
    const data = callbackData("send", "0123456789abcdef0123456789abcdef")
    assert.ok(utf8ByteLength(data) <= TELEGRAM_MAX_CALLBACK_DATA_BYTES)
    assert.match(data, /^a:send:/)
  })

  it("truncates an oversized token so the payload fits 64 bytes", () => {
    const data = callbackData("confirm", "x".repeat(200))
    assert.equal(utf8ByteLength(data), TELEGRAM_MAX_CALLBACK_DATA_BYTES)
    assert.ok(data.startsWith("a:confirm:"))
  })
})

describe("message length", () => {
  it("clips notices to 4096 characters", () => {
    const notice = formatManualApplyNotice(
      record({
        company: "A".repeat(5000),
        position: "B".repeat(5000),
      }),
    )
    assert.ok(notice.length <= TELEGRAM_MAX_MESSAGE_CHARS)
    assert.ok(notice.endsWith("…"))
  })

  it("splits a long draft into chunks of at most 4096", () => {
    const long = `${"Hola\n".repeat(1200)}fin`
    const chunks = splitTelegramMessages(long)
    assert.ok(chunks.length > 1)
    for (const chunk of chunks) {
      assert.ok(chunk.length <= TELEGRAM_MAX_MESSAGE_CHARS)
    }
    assert.ok(chunks.join("").includes("fin") || chunks.at(-1)?.includes("fin"))
  })

  it("clipTelegramText is a no-op under the limit", () => {
    assert.equal(clipTelegramText("corto"), "corto")
  })
})

describe("formatYaResponse", () => {
  it("says Ya aplicaste when there is a record", () => {
    const text = formatYaResponse({
      status: "applied",
      match: "url",
      record: record(),
      softWarnings: [],
      identityWeak: false,
      historyUnavailable: false,
    })
    assert.match(text, /Ya aplicaste el/)
    assert.match(text, /Acme Cloud/)
  })

  it("says No hay registro when new", () => {
    assert.equal(
      formatYaResponse({
        status: "new",
        match: null,
        record: null,
        softWarnings: [],
        identityWeak: false,
        historyUnavailable: false,
      }),
      "No hay registro",
    )
  })
})
