import path from "path"
import type { JobCategory } from "@/lib/apply/types"

export const CV_FILES = {
  software: "Andres_Coello_Goyes_full_stack_developer_2026.pdf",
  education: "Andres_Coello_Goyes_educator_full_stack_developer_2026.pdf",
} as const

/** Plain-text CV sources for Gemini (Vercel-safe; no PDF parsing at runtime). */
export const CV_TEXT_FILES = {
  software: "software.txt",
  education: "education.txt",
} as const

export type CvKey = keyof typeof CV_FILES

export function getCvFilename(category: JobCategory): string | null {
  if (category === "software") return CV_FILES.software
  if (category === "education") return CV_FILES.education
  return null
}

export function getCvAbsolutePath(filename: string): string {
  return path.join(process.cwd(), "public", "pdf", filename)
}

export function getCvTextAbsolutePath(cvKey: CvKey): string {
  return path.join(process.cwd(), "content", "cv", CV_TEXT_FILES[cvKey])
}

export function resolveCvFilename(
  category: JobCategory,
  manualCv?: CvKey | null,
): string | null {
  if (category === "unknown") {
    return manualCv ? CV_FILES[manualCv] : null
  }
  return getCvFilename(category)
}

export function resolveCvKey(
  category: JobCategory,
  manualCv?: CvKey | null,
  cvFilename?: string | null,
): CvKey | null {
  if (manualCv) return manualCv
  if (category === "software" || category === "education") return category
  if (cvFilename === CV_FILES.software) return "software"
  if (cvFilename === CV_FILES.education) return "education"
  return null
}

export function isValidCvKey(value: string): value is CvKey {
  return value === "software" || value === "education"
}

export function cvKeyFromFilename(filename: string): CvKey | null {
  if (filename === CV_FILES.software) return "software"
  if (filename === CV_FILES.education) return "education"
  return null
}
