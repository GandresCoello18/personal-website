import fs from "fs"
import { PDFParse } from "pdf-parse"
import { getCvAbsolutePath } from "@/lib/apply/cv"

const MAX_CV_CHARS = 12_000
const textCache = new Map<string, string>()

export async function extractCvText(filename: string): Promise<string> {
  const cached = textCache.get(filename)
  if (cached) return cached

  const absolutePath = getCvAbsolutePath(filename)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CV no encontrado: ${filename}`)
  }

  const buffer = fs.readFileSync(absolutePath)
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  const text = (result.text || "").replace(/\s+\n/g, "\n").trim()

  if (!text) {
    throw new Error("No se pudo extraer texto del CV seleccionado")
  }

  const truncated =
    text.length > MAX_CV_CHARS ? `${text.slice(0, MAX_CV_CHARS)}\n…` : text

  textCache.set(filename, truncated)
  return truncated
}

export function readCvBuffer(filename: string): Buffer {
  const absolutePath = getCvAbsolutePath(filename)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`CV no encontrado: ${filename}`)
  }
  return fs.readFileSync(absolutePath)
}
