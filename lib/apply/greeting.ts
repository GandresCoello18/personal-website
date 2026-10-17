import type { JobExtract } from "./types.ts"
import { canPersonalizeGreeting } from "./recruiter.ts"

export type GreetingInput = {
  recruiterName?: string | null
  company?: string | null
  language?: string | null
  recruiterConfidence?: JobExtract["recruiterConfidence"]
}

const FIRST_NAME_SKIP = new Set(["de", "del", "la", "las", "los", "van", "von", "da", "di"])

export function greetingFirstName(fullName: string): string {
  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter((part) => part && !FIRST_NAME_SKIP.has(part.toLowerCase()))
  return parts[0] || fullName.trim()
}

function isEnglish(language: string | null | undefined): boolean {
  const value = (language || "es").trim().toLowerCase()
  return value === "en" || value.startsWith("en-")
}

/**
 * Opening line for the application email.
 * Named greeting when a real contact name is known; otherwise "equipo de {Empresa}".
 * Never a bare "Hola," / "Hello,".
 */
export function buildEmailGreeting(input: GreetingInput): string {
  const english = isEnglish(input.language)
  const name = (input.recruiterName || "").trim()
  const confidence = input.recruiterConfidence ?? (name ? "medium" : "none")
  const useName = Boolean(name) && canPersonalizeGreeting(confidence)

  if (useName) {
    const first = greetingFirstName(name)
    return english ? `Hello ${first},` : `Hola ${first},`
  }

  const company = (input.company || "").trim()
  if (company) {
    return english ? `Hello ${company} team,` : `Hola equipo de ${company},`
  }

  return english ? "Hello team," : "Hola equipo,"
}
