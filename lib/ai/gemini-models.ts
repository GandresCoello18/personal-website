/**
 * Gemini models allowed for this project: Google AI Studio free tier, text+image
 * in → JSON/text out. Image-generation, Live, TTS, embeddings, and Pro IDs are
 * excluded even when an env var names them.
 *
 * Source: https://ai.google.dev/gemini-api/docs/pricing (Free Tier = free of charge)
 * and https://ai.google.dev/gemini-api/docs/models (consulted 17 Oct 2026).
 *
 * 2.5 Flash / Flash-Lite remain free for projects that already used them;
 * Google now steers new work to 3.5 Flash-Lite.
 */
export const GEMINI_FREE_TIER_TEXT_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
] as const

export type GeminiFreeTierTextModel = (typeof GEMINI_FREE_TIER_TEXT_MODELS)[number]

const FREE_TIER_SET = new Set<string>(GEMINI_FREE_TIER_TEXT_MODELS)

export const DEFAULT_GEMINI_MODEL: GeminiFreeTierTextModel = "gemini-3.1-flash-lite"

/** Used when GEMINI_FALLBACK_MODELS is unset. Must stay inside the allowlist. */
export const DEFAULT_GEMINI_FALLBACK_MODELS: GeminiFreeTierTextModel[] = ["gemini-3.5-flash-lite"]

export function isFreeTierGeminiModel(modelId: string): boolean {
  return FREE_TIER_SET.has(modelId.trim())
}

function splitModelList(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export function resolveGeminiModelChain(
  env: NodeJS.ProcessEnv = process.env,
): GeminiFreeTierTextModel[] {
  const requestedPrimary = env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL
  const primary = isFreeTierGeminiModel(requestedPrimary)
    ? (requestedPrimary as GeminiFreeTierTextModel)
    : DEFAULT_GEMINI_MODEL

  const fallbackRaw = env.GEMINI_FALLBACK_MODELS
  const requestedFallbacks =
    fallbackRaw === undefined
      ? DEFAULT_GEMINI_FALLBACK_MODELS
      : fallbackRaw.trim() === ""
        ? []
        : splitModelList(fallbackRaw)

  const chain: GeminiFreeTierTextModel[] = [primary]
  const seen = new Set<string>([primary])
  for (const model of requestedFallbacks) {
    if (!isFreeTierGeminiModel(model) || seen.has(model)) continue
    seen.add(model)
    chain.push(model as GeminiFreeTierTextModel)
  }
  return chain
}
