import { z } from "zod"
import { sanitizeHeaderValue } from "../security/headers.ts"

export const HONEYPOT_FIELD = "website"

export const contactFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre es demasiado largo"),
  email: z.string().trim().email("Email inválido").max(254),
  asunto: z
    .string()
    .trim()
    .min(1, "El asunto es obligatorio")
    .max(150, "El asunto es demasiado largo")
    .transform(sanitizeHeaderValue)
    .refine((value) => value.length > 0, "El asunto es obligatorio"),
  mensaje: z
    .string()
    .trim()
    .min(10, "El mensaje es demasiado corto")
    .max(4000, "El mensaje es demasiado largo"),
  [HONEYPOT_FIELD]: z.string().optional(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

export type ContactEvaluation =
  { kind: "honeypot" } | { kind: "invalid"; error: string } | { kind: "ok"; data: ContactFormInput }

export function evaluateContactSubmission(body: unknown): ContactEvaluation {
  if (body && typeof body === "object") {
    const honeypot = (body as Record<string, unknown>)[HONEYPOT_FIELD]
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return { kind: "honeypot" }
    }
  }

  const parsed = contactFormSchema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Datos de contacto inválidos"
    return { kind: "invalid", error: first }
  }

  return { kind: "ok", data: parsed.data }
}
