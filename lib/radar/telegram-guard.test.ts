import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { authorizeTelegramWebhook } from "./telegram-guard.ts"
import { handleTelegramWebhook } from "./telegram-webhook.ts"
import { MemoryRadarStore } from "./store.ts"
import { vacancyIdentity } from "./fingerprint.ts"
import type { ApplyRecord } from "./types.ts"

const SECRET = "a".repeat(64)
const CHAT = "987654321"

function update(overrides: { chatId?: number; fromId?: number; text?: string } = {}) {
  return {
    update_id: 1,
    message: {
      message_id: 10,
      text: overrides.text ?? "/hoy",
      chat: { id: overrides.chatId ?? 987654321 },
      from: { id: overrides.fromId ?? 987654321 },
    },
  }
}

describe("authorizeTelegramWebhook", () => {
  it("fails closed when the webhook secret is missing", () => {
    const result = authorizeTelegramWebhook({
      secretHeader: SECRET,
      configuredSecret: "",
      allowedChatId: CHAT,
      chatId: CHAT,
      fromId: CHAT,
    })
    assert.equal(result.ok, false)
    if (!result.ok && "status" in result) assert.equal(result.status, 503)
  })

  it("fails closed when TELEGRAM_CHAT_ID is missing", () => {
    const result = authorizeTelegramWebhook({
      secretHeader: SECRET,
      configuredSecret: SECRET,
      allowedChatId: "",
      chatId: CHAT,
      fromId: CHAT,
    })
    assert.equal(result.ok, false)
    if (!result.ok && "status" in result) assert.equal(result.status, 503)
  })

  it("rejects a missing or wrong secret in constant-time path (401)", () => {
    const missing = authorizeTelegramWebhook({
      secretHeader: "",
      configuredSecret: SECRET,
      allowedChatId: CHAT,
      chatId: CHAT,
      fromId: CHAT,
    })
    assert.equal(missing.ok, false)
    if (!missing.ok && "status" in missing) assert.equal(missing.status, 401)

    const wrong = authorizeTelegramWebhook({
      secretHeader: "b".repeat(64),
      configuredSecret: SECRET,
      allowedChatId: CHAT,
      chatId: CHAT,
      fromId: CHAT,
    })
    assert.equal(wrong.ok, false)
    if (!wrong.ok && "status" in wrong) assert.equal(wrong.status, 401)
  })

  it("ignores another chat.id or from.id", () => {
    const otherChat = authorizeTelegramWebhook({
      secretHeader: SECRET,
      configuredSecret: SECRET,
      allowedChatId: CHAT,
      chatId: "1",
      fromId: CHAT,
    })
    assert.equal(otherChat.ok, false)
    if (!otherChat.ok) assert.equal("ignore" in otherChat && otherChat.ignore, true)

    const otherFrom = authorizeTelegramWebhook({
      secretHeader: SECRET,
      configuredSecret: SECRET,
      allowedChatId: CHAT,
      chatId: CHAT,
      fromId: "1",
    })
    assert.equal(otherFrom.ok, false)
    if (!otherFrom.ok) assert.equal("ignore" in otherFrom && otherFrom.ignore, true)
  })

  it("accepts a matching secret, chat.id and from.id", () => {
    const result = authorizeTelegramWebhook({
      secretHeader: SECRET,
      configuredSecret: SECRET,
      allowedChatId: CHAT,
      chatId: 987654321,
      fromId: 987654321,
    })
    assert.deepEqual(result, { ok: true })
  })
})

describe("handleTelegramWebhook", () => {
  it("returns 401 without the secret header", async () => {
    const result = await handleTelegramWebhook({
      secretHeader: null,
      payload: update(),
      store: new MemoryRadarStore(),
      configuredSecret: SECRET,
      allowedChatId: CHAT,
    })
    assert.equal(result.status, 401)
  })

  it("returns 503 if the secret is not configured", async () => {
    const result = await handleTelegramWebhook({
      secretHeader: SECRET,
      payload: update(),
      store: new MemoryRadarStore(),
      configuredSecret: "",
      allowedChatId: CHAT,
    })
    assert.equal(result.status, 503)
  })

  it("returns 200 empty for another chat (does not leak)", async () => {
    const result = await handleTelegramWebhook({
      secretHeader: SECRET,
      payload: update({ chatId: 1, fromId: 1, text: "/ya https://x" }),
      store: new MemoryRadarStore(),
      configuredSecret: SECRET,
      allowedChatId: CHAT,
    })
    assert.equal(result.status, 200)
    assert.equal(result.reply, undefined)
    assert.deepEqual(result.body, { ok: true })
  })

  it("answers /ya with No hay registro or Ya aplicaste", async () => {
    const store = new MemoryRadarStore()
    const empty = await handleTelegramWebhook({
      secretHeader: SECRET,
      payload: update({ text: "/ya https://www.linkedin.com/jobs/view/4012345678/" }),
      store,
      configuredSecret: SECRET,
      allowedChatId: CHAT,
    })
    assert.equal(empty.status, 200)
    assert.equal(empty.reply, "No hay registro")

    const identity = vacancyIdentity("Acme Cloud", "Full Stack Developer")
    const applied: ApplyRecord = {
      fp: identity.fp,
      urlKey: "li:job:4012345678",
      company: "Acme Cloud",
      position: "Full Stack Developer",
      email: "talento@acme.example",
      channel: "apply_manual",
      appliedAt: "2026-10-03T16:05:00.000Z",
      identityWeak: false,
    }
    await store.saveApply(applied)

    const found = await handleTelegramWebhook({
      secretHeader: SECRET,
      payload: update({ text: "/ya https://www.linkedin.com/jobs/view/4012345678/" }),
      store,
      configuredSecret: SECRET,
      allowedChatId: CHAT,
    })
    assert.match(found.reply ?? "", /Ya aplicaste el/)
  })

  it("answers /pausa and /hoy", async () => {
    const store = new MemoryRadarStore()
    const pause = await handleTelegramWebhook({
      secretHeader: SECRET,
      payload: update({ text: "/pausa" }),
      store,
      configuredSecret: SECRET,
      allowedChatId: CHAT,
      now: new Date("2026-10-05T15:00:00.000Z"),
    })
    assert.match(pause.reply ?? "", /Avisos silenciados 24 h/)

    const hoy = await handleTelegramWebhook({
      secretHeader: SECRET,
      payload: update({ text: "/hoy" }),
      store,
      configuredSecret: SECRET,
      allowedChatId: CHAT,
      now: new Date("2026-10-05T15:00:00.000Z"),
    })
    assert.match(hoy.reply ?? "", /Radar/)
    assert.match(hoy.reply ?? "", /pausa/i)
  })
})
