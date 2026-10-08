import { alreadyAppliedMessage, calendarDay } from "./dates.ts"
import { lockKeyFor, normalizeEmail, storageIdFor, vacancyIdentity } from "./fingerprint.ts"
import { urlKeyFromUrl } from "./normalize.ts"
import type { RadarStore } from "./store.ts"
import { StoreUnavailableError } from "./store.ts"
import {
  APPLY_LOCK_TTL_SECONDS,
  APPLY_SOFT_WINDOW_MS,
  type ApplyChannel,
  type ApplyCheckInput,
  type ApplyCheckResult,
  type ApplyRecord,
  type SoftWarning,
} from "./types.ts"

export type SendLikePayload = {
  company: string
  position: string
  email?: string | null
  url?: string
  findingId?: string
  subject?: string
  cvFilename?: string
  confirmDuplicate?: boolean
}

export type DedupeFailure =
  | { ok: false; code: "duplicate"; record: ApplyRecord; message: string }
  | { ok: false; code: "in_progress"; message: string }
  | { ok: false; code: "history_unavailable"; message: string }
  | { ok: false; code: "identity_missing"; message: string }

export type DedupeSuccess = { ok: true; record: ApplyRecord; alreadyExisted: boolean }

export type DedupeResult = DedupeSuccess | DedupeFailure

const IN_PROGRESS_MESSAGE = "Hay otro envío en curso. Espera un momento e inténtalo de nuevo."
const HISTORY_UNAVAILABLE_MESSAGE =
  "El historial no está disponible. Confirma si quieres enviar de todos modos."
const HISTORY_UNAVAILABLE_REGISTER =
  "El historial no está disponible. No se puede registrar la vacante ahora."
const IDENTITY_MISSING_MESSAGE =
  "Indica la URL de la vacante o la empresa y el cargo para registrarla."

function unavailableCheck(identityWeak: boolean): ApplyCheckResult {
  return {
    status: "unknown",
    match: null,
    record: null,
    softWarnings: [],
    identityWeak,
    historyUnavailable: true,
  }
}

export function resolveIdentity(input: {
  company?: string
  position?: string
  email?: string | null
  url?: string
}) {
  const urlKey = urlKeyFromUrl(input.url)
  const email = normalizeEmail(input.email)
  const identity = vacancyIdentity(input.company ?? "", input.position ?? "")
  return {
    ...identity,
    urlKey,
    email,
    lockKey: lockKeyFor({
      identityWeak: identity.identityWeak,
      fp: identity.fp,
      urlKey,
      email,
    }),
    storageId: storageIdFor({
      identityWeak: identity.identityWeak,
      fp: identity.fp,
      urlKey,
      email,
    }),
  }
}

export async function checkApply(
  input: ApplyCheckInput,
  store: RadarStore | null,
): Promise<ApplyCheckResult> {
  const resolved = resolveIdentity(input)
  if (!store) return unavailableCheck(resolved.identityWeak)

  try {
    return await checkApplyWithStore(input, store, resolved)
  } catch {
    return unavailableCheck(resolved.identityWeak)
  }
}

async function checkApplyWithStore(
  input: ApplyCheckInput,
  store: RadarStore,
  resolved: ReturnType<typeof resolveIdentity>,
): Promise<ApplyCheckResult> {
  let record: ApplyRecord | null = null
  let match: ApplyCheckResult["match"] = null

  if (resolved.urlKey) {
    record = await store.getApplyByUrl(resolved.urlKey)
    if (record) match = "url"
  }

  if (!record && !resolved.identityWeak) {
    record = await store.getApplyByFp(resolved.fp)
    if (record) match = "fp"
  }

  let status: ApplyCheckResult["status"] = record ? "applied" : "new"
  if (!record && resolved.lockKey && (await store.isLocked(resolved.lockKey))) {
    status = "in_progress"
  }

  const sinceMs = Date.now() - APPLY_SOFT_WINDOW_MS
  const softWarnings: SoftWarning[] = []

  if (resolved.companyNorm) {
    const recent = await store.getRecentByCompany(resolved.companyNorm, sinceMs)
    for (const item of recent) {
      if (record && item.fp === record.fp) continue
      if (item.position.trim() && item.position === (input.position ?? "") && match) continue
      softWarnings.push({
        kind: "company",
        company: item.company,
        position: item.position,
        appliedAt: item.appliedAt,
      })
      break
    }
  }

  if (resolved.email) {
    const recent = await store.getRecentByEmail(resolved.email, sinceMs)
    for (const item of recent) {
      if (record && item.fp === record.fp) continue
      softWarnings.push({
        kind: "email",
        email: item.email ?? resolved.email,
        appliedAt: item.appliedAt,
      })
      break
    }
  }

  return {
    status,
    match,
    record,
    softWarnings,
    identityWeak: resolved.identityWeak,
    historyUnavailable: false,
  }
}

export async function sendWithDedupe(options: {
  store: RadarStore | null
  payload: SendLikePayload
  channel: ApplyChannel
  confirmDuplicate?: boolean
  send?: (payload: SendLikePayload) => Promise<void>
  now?: Date
}): Promise<DedupeResult> {
  const { store, payload, channel, send, now = new Date() } = options
  const confirmDuplicate = options.confirmDuplicate ?? payload.confirmDuplicate ?? false
  const resolved = resolveIdentity(payload)

  if (!store) {
    if (!confirmDuplicate) {
      return { ok: false, code: "history_unavailable", message: HISTORY_UNAVAILABLE_MESSAGE }
    }
    if (send) await send(payload)
    return {
      ok: true,
      alreadyExisted: false,
      record: buildRecord(payload, resolved, channel, now),
    }
  }

  return withLock(store, resolved.lockKey, confirmDuplicate, async () => {
    const existing = await findExisting(store, resolved)
    if (existing && !confirmDuplicate) {
      return {
        ok: false as const,
        code: "duplicate" as const,
        record: existing,
        message: alreadyAppliedMessage(existing.appliedAt, {
          channel: existing.channel,
          email: existing.email,
        }),
      }
    }

    if (send) await send(payload)

    const record = buildRecord(payload, resolved, channel, now)
    try {
      await store.saveApply(record)
      await store.incrementStat(
        calendarDay(now),
        channel === "manual_external" ? "manual_external" : "sent",
      )
    } catch (error) {
      console.error("[radar/dedupe] no se pudo guardar el registro", error)
    }

    return { ok: true as const, record, alreadyExisted: Boolean(existing) }
  })
}

export async function registerExternalApply(options: {
  store: RadarStore | null
  input: SendLikePayload
  confirmDuplicate?: boolean
  now?: Date
}): Promise<DedupeResult> {
  const resolved = resolveIdentity(options.input)
  if (!resolved.urlKey && resolved.identityWeak) {
    return { ok: false, code: "identity_missing", message: IDENTITY_MISSING_MESSAGE }
  }

  if (!options.store) {
    return { ok: false, code: "history_unavailable", message: HISTORY_UNAVAILABLE_REGISTER }
  }

  return sendWithDedupe({
    store: options.store,
    payload: options.input,
    channel: "manual_external",
    confirmDuplicate: options.confirmDuplicate,
    now: options.now,
  })
}

async function findExisting(store: RadarStore, resolved: ReturnType<typeof resolveIdentity>) {
  if (resolved.urlKey) {
    const byUrl = await store.getApplyByUrl(resolved.urlKey)
    if (byUrl) return byUrl
  }
  if (!resolved.identityWeak) {
    return store.getApplyByFp(resolved.fp)
  }
  return null
}

async function withLock(
  store: RadarStore,
  lockKey: string | null,
  confirmDuplicate: boolean,
  fn: () => Promise<DedupeResult>,
): Promise<DedupeResult> {
  if (!lockKey) return fn()

  let acquired = false
  try {
    acquired = await store.acquireLock(lockKey, APPLY_LOCK_TTL_SECONDS)
    if (!acquired) {
      return { ok: false, code: "in_progress", message: IN_PROGRESS_MESSAGE }
    }
    return await fn()
  } catch (error) {
    if (error instanceof StoreUnavailableError) {
      if (!confirmDuplicate) {
        return { ok: false, code: "history_unavailable", message: HISTORY_UNAVAILABLE_MESSAGE }
      }
      throw error
    }
    throw error
  } finally {
    if (acquired) {
      try {
        await store.releaseLock(lockKey)
      } catch {
        // TTL of 120s is the safety net.
      }
    }
  }
}

function buildRecord(
  payload: SendLikePayload,
  resolved: ReturnType<typeof resolveIdentity>,
  channel: ApplyChannel,
  now: Date,
): ApplyRecord {
  return {
    fp: resolved.storageId,
    urlKey: resolved.urlKey,
    company: payload.company.trim(),
    position: payload.position.trim(),
    email: resolved.email,
    channel,
    subject: payload.subject,
    cvFilename: payload.cvFilename,
    appliedAt: now.toISOString(),
    findingId: payload.findingId,
    identityWeak: resolved.identityWeak,
  }
}
