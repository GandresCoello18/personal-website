import path from "path"
import type { JobCategory } from "@/lib/apply/types"

export const CV_FILES = {
  software: "Andres_Coello_Goyes_full_stack_developer_2026.pdf",
  education: "Andres_Coello_Goyes_educator_full_stack_developer_2026.pdf",
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

export function resolveCvFilename(
  category: JobCategory,
  manualCv?: CvKey | null,
): string | null {
  if (category === "unknown") {
    return manualCv ? CV_FILES[manualCv] : null
  }
  return getCvFilename(category)
}

export function isValidCvKey(value: string): value is CvKey {
  return value === "software" || value === "education"
}
