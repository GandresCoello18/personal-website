import fs from "fs"
import path from "path"
import { extractCvText } from "@/lib/apply/cv-text"

const PROFILE_DIR = path.join(process.cwd(), "content", "profile")
const FACTS_PATH = path.join(PROFILE_DIR, "career-facts.md")
const PROJECTS_PATH = path.join(PROFILE_DIR, "projects-and-speaking.md")
const MAX_FACTS_CHARS = 3_000
const MAX_PROJECTS_CHARS = 3_500
const MAX_CONTEXT_CHARS = 12_000

function truncate(text: string, max: number): string {
  const t = text.replace(/\s+\n/g, "\n").trim()
  return t.length > max ? `${t.slice(0, max)}\n…` : t
}

function readProfileFile(absolutePath: string, maxChars: number): string {
  if (!fs.existsSync(absolutePath)) return ""
  return truncate(fs.readFileSync(absolutePath, "utf8"), maxChars)
}

/** Projects, startups and speaking notes for email draft / match / interview. */
export function readProjectsAndSpeakingContext(): string {
  return readProfileFile(PROJECTS_PATH, MAX_PROJECTS_CHARS)
}

/**
 * Profile context for Match Score: career-facts + both CVs + projects/speaking.
 * No blog/videos MDX (keeps the score stable and explainable).
 */
export function buildProfileContextForMatching(): string {
  const parts: string[] = []

  const facts = readProfileFile(FACTS_PATH, MAX_FACTS_CHARS)
  if (facts) parts.push(`## CAREER FACTS\n${facts}`)

  try {
    parts.push(`## CV SOFTWARE\n${extractCvText("software")}`)
  } catch {
    // optional if file missing in some envs
  }

  try {
    parts.push(`## CV EDUCATION / MENTORÍA\n${extractCvText("education")}`)
  } catch {
    // optional
  }

  const projects = readProjectsAndSpeakingContext()
  if (projects) parts.push(`## PROJECTS & SPEAKING\n${projects}`)

  const joined = parts.join("\n\n").trim()
  if (!joined) {
    throw new Error("No hay contexto de perfil disponible (CVs / career-facts).")
  }

  return truncate(joined, MAX_CONTEXT_CHARS)
}

/** Build a compact JD text from extract fields (for image mode after OCR extract). */
export function buildJobTextFromExtract(fields: {
  company: string
  position: string
  summary: string
  requirements: string[]
  location: string
  remote: boolean | null
}): string {
  const lines = [
    fields.company ? `Empresa: ${fields.company}` : "",
    fields.position ? `Posición: ${fields.position}` : "",
    fields.location ? `Ubicación: ${fields.location}` : "",
    fields.remote === true
      ? "Modalidad: remoto"
      : fields.remote === false
        ? "Modalidad: presencial"
        : "",
    fields.summary ? `Resumen: ${fields.summary}` : "",
    fields.requirements.length
      ? `Requisitos:\n${fields.requirements.map((r) => `- ${r}`).join("\n")}`
      : "",
  ].filter(Boolean)

  return lines.join("\n")
}
