import fs from "fs"
import {
  cvKeyFromFilename,
  getCvAbsolutePath,
  getCvTextAbsolutePath,
  type CvKey,
} from "@/lib/apply/cv"

const MAX_CV_CHARS = 4_000
const textCache = new Map<string, string>()

/**
 * Reads pre-exported plain text under content/cv/.
 * Avoids pdf-parse/pdfjs on Vercel (no DOMMatrix / canvas).
 */
export function extractCvText(cvKeyOrFilename: CvKey | string): string {
  const cvKey =
    cvKeyOrFilename === "software" || cvKeyOrFilename === "education"
      ? cvKeyOrFilename
      : cvKeyFromFilename(cvKeyOrFilename)

  if (!cvKey) {
    throw new Error(`CV de texto no reconocido: ${cvKeyOrFilename}`)
  }

  const cacheKey = `${cvKey}:${MAX_CV_CHARS}`
  const cached = textCache.get(cacheKey)
  if (cached) return cached

  const absolutePath = getCvTextAbsolutePath(cvKey)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `Falta el texto del CV: content/cv/${cvKey}.txt. Exporta el PDF a este archivo.`,
    )
  }

  const text = fs.readFileSync(absolutePath, "utf8").replace(/\s+\n/g, "\n").trim()
  if (!text) {
    throw new Error(`El archivo content/cv/${cvKey}.txt está vacío`)
  }

  const truncated =
    text.length > MAX_CV_CHARS ? `${text.slice(0, MAX_CV_CHARS)}\n…` : text

  textCache.set(cacheKey, truncated)
  return truncated
}

/** Binary PDF for Nodemailer attachment only (no parsing). */
export function readCvBuffer(filename: string): Buffer {
  const absolutePath = getCvAbsolutePath(filename)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CV PDF no encontrado: ${filename}`)
  }
  return fs.readFileSync(absolutePath)
}
