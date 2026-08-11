import { z } from "zod"

export const jobCategorySchema = z.enum(["software", "education", "unknown"])
export type JobCategory = z.infer<typeof jobCategorySchema>

export const recruiterConfidenceSchema = z.enum(["high", "medium", "low", "none"])
export type RecruiterConfidence = z.infer<typeof recruiterConfidenceSchema>

export const jobExtractSchema = z.object({
  company: z.string().catch(""),
  position: z.string().catch(""),
  email: z.preprocess((val) => {
    if (val === null || val === undefined || val === "" || val === "null") return null
    if (typeof val === "string" && val.includes("@")) return val.trim()
    return null
  }, z.string().email().nullable()),
  recruiterName: z.string().catch(""),
  recruiterTitle: z.string().catch(""),
  recruiterConfidence: recruiterConfidenceSchema.catch("none"),
  category: jobCategorySchema,
  confidence: z.coerce.number().min(0).max(1),
  requirements: z.array(z.string()).max(12).catch([]),
  location: z.string().catch(""),
  remote: z.boolean().nullable().catch(null),
  summary: z.string().catch(""),
  language: z.string().catch("es"),
})

export type JobExtract = z.infer<typeof jobExtractSchema>

export const emailDraftSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
})

export type EmailDraft = z.infer<typeof emailDraftSchema>

export const matchRecommendationSchema = z.enum(["strong", "good", "partial", "low"])
export type MatchRecommendation = z.infer<typeof matchRecommendationSchema>

export const jobMatchSchema = z.object({
  score: z.coerce.number().min(0).max(100),
  summary: z.string().min(1),
  strengths: z.array(z.string()).max(8).catch([]),
  gaps: z.array(z.string()).max(8).catch([]),
  niceToHave: z.array(z.string()).max(8).catch([]),
  recommendation: matchRecommendationSchema,
})

export type JobMatch = z.infer<typeof jobMatchSchema>

export const sendApplicationSchema = z.object({
  company: z.string(),
  position: z.string(),
  email: z.string().email(),
  category: jobCategorySchema,
  confidence: z.number().min(0).max(1),
  cvFilename: z.string().min(1),
  subject: z.string().min(1),
  body: z.string().min(1),
})

export type SendApplicationPayload = z.infer<typeof sendApplicationSchema>

export const CONFIDENCE_THRESHOLD = 0.7
