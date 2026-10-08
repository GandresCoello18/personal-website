import { createHash } from "node:crypto"

const LEGAL_SUFFIX = /\b(?:s\.?\s*a\.?\s*s?\.?|cia\.?\s*ltda\.?|inc\.?|llc\.?|ltd\.?|gmbh\.?)\b/gi

const SYNONYMS: Record<string, string> = {
  fullstack: "full stack",
  sr: "senior",
  sen: "senior",
  jr: "junior",
  dev: "developer",
}

export function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "")
}

/** Normalize company or position for fingerprinting (D7). */
export function norm(value: string): string {
  let text = stripDiacritics(value).toLowerCase()
  text = text.replace(/full[\s_-]*stack/g, "full stack")
  text = text.replace(LEGAL_SUFFIX, " ")
  text = text.replace(/[^\p{L}\p{N}\s]+/gu, " ")
  const tokens = text
    .split(/\s+/)
    .map((token) => expandSynonym(token))
    .flatMap((part) => part.split(/\s+/))
    .map((token) => token.trim())
    .filter(Boolean)
    .sort()
  return tokens.join(" ")
}

function expandSynonym(token: string): string {
  return SYNONYMS[token] ?? token
}

export function companyKey(company: string): string {
  return norm(company)
}

export function normalizeEmail(email: string | undefined | null): string | null {
  if (!email) return null
  const trimmed = email.trim().toLowerCase()
  return trimmed.includes("@") ? trimmed : null
}

export type VacancyIdentity = {
  fp: string
  companyNorm: string
  positionNorm: string
  identityWeak: boolean
}

export function vacancyIdentity(company: string, position: string): VacancyIdentity {
  const companyNorm = norm(company)
  const positionNorm = norm(position)
  const identityWeak = !companyNorm || !positionNorm
  const fp = createHash("sha256")
    .update(`${companyNorm}|${positionNorm}`)
    .digest("hex")
    .slice(0, 16)
  return { fp, companyNorm, positionNorm, identityWeak }
}

export function lockKeyFor(identity: {
  identityWeak: boolean
  fp: string
  urlKey: string | null
  email: string | null
}): string | null {
  if (!identity.identityWeak) return `fp:${identity.fp}`
  if (identity.urlKey) return `url:${identity.urlKey}`
  if (identity.email) return `email:${identity.email}`
  return null
}

export function storageIdFor(identity: {
  identityWeak: boolean
  fp: string
  urlKey: string | null
  email: string | null
}): string {
  if (!identity.identityWeak) return identity.fp
  if (identity.urlKey) return `url:${identity.urlKey}`
  if (identity.email) return `email:${identity.email}`
  return `weak:${identity.fp}`
}
