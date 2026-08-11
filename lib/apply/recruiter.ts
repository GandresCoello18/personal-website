import type { JobExtract, RecruiterConfidence } from "@/lib/apply/types"

/** Tokens that look like mailbox roles, not people. */
const ROLE_LOCAL_PARTS = new Set([
  "hr",
  "jobs",
  "job",
  "careers",
  "career",
  "recruiting",
  "recruitment",
  "talent",
  "hiring",
  "people",
  "team",
  "info",
  "contact",
  "hello",
  "hola",
  "admin",
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "applications",
  "apply",
  "empleo",
  "vacantes",
  "rrhh",
  "seleccion",
])

const CONFIDENCE_RANK: Record<RecruiterConfidence, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
}

export function confidenceRank(c: RecruiterConfidence): number {
  return CONFIDENCE_RANK[c]
}

/** True when greeting may use the recruiter first/full name. */
export function canPersonalizeGreeting(confidence: RecruiterConfidence): boolean {
  return confidence === "high" || confidence === "medium"
}

function titleCaseToken(token: string): string {
  if (!token) return ""
  return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
}

/**
 * Infer a display name from an email local-part.
 * Examples: maria.velez@x.com → "Maria Velez" (medium);
 * hr@x.com → null (none).
 */
export function inferNameFromEmail(email: string | null | undefined): {
  name: string | null
  confidence: RecruiterConfidence
} {
  if (!email || !email.includes("@")) {
    return { name: null, confidence: "none" }
  }

  const local = email.split("@")[0]?.trim().toLowerCase() ?? ""
  if (!local) return { name: null, confidence: "none" }

  const base = local.replace(/\+.*$/, "")
  if (ROLE_LOCAL_PARTS.has(base) || ROLE_LOCAL_PARTS.has(base.replace(/[0-9]+$/g, ""))) {
    return { name: null, confidence: "none" }
  }

  // first.last / first_last / first-last
  const parts = base
    .split(/[._-]+/)
    .map((p) => p.replace(/[0-9]/g, ""))
    .filter((p) => p.length >= 2)

  if (parts.length >= 2 && parts.every((p) => /^[a-z]+$/i.test(p))) {
    const name = parts.map(titleCaseToken).join(" ")
    return { name, confidence: "medium" }
  }

  // Single alphabetic token (ambiguous: could be first name or handle)
  if (parts.length === 1 && /^[a-z]+$/i.test(parts[0]) && parts[0].length >= 3) {
    return { name: titleCaseToken(parts[0]), confidence: "low" }
  }

  return { name: null, confidence: "none" }
}

/**
 * Merge LLM extract with deterministic email inference.
 * Explicit JD name wins when confidence is at least medium.
 * Email inference fills gaps only at medium+; low never used for greeting.
 */
export function mergeRecruiterContact(extract: JobExtract): JobExtract {
  const explicitName = (extract.recruiterName || "").trim()
  const explicitConfidence = extract.recruiterConfidence ?? "none"
  const inferred = inferNameFromEmail(extract.email)

  if (explicitName && confidenceRank(explicitConfidence) >= confidenceRank("medium")) {
    return {
      ...extract,
      recruiterName: explicitName,
      recruiterConfidence: explicitConfidence,
    }
  }

  // Explicit but low confidence: keep name for UI editing, don't upgrade
  if (explicitName && explicitConfidence === "low") {
    // Prefer medium email inference over low explicit if available
    if (inferred.name && inferred.confidence === "medium") {
      return {
        ...extract,
        recruiterName: inferred.name,
        recruiterConfidence: "medium",
      }
    }
    return {
      ...extract,
      recruiterName: explicitName,
      recruiterConfidence: "low",
    }
  }

  if (!explicitName && inferred.name && inferred.confidence === "medium") {
    return {
      ...extract,
      recruiterName: inferred.name,
      recruiterConfidence: "medium",
    }
  }

  if (!explicitName && inferred.name && inferred.confidence === "low") {
    return {
      ...extract,
      recruiterName: inferred.name,
      recruiterConfidence: "low",
    }
  }

  if (!explicitName) {
    return {
      ...extract,
      recruiterName: "",
      recruiterConfidence: "none",
    }
  }

  return extract
}
