export type DraftEnv = {
  NODE_ENV?: string
  CASE_DRAFT_PREVIEW?: string
}

let envOverride: DraftEnv | null = null

/** Test helper: render/strip as if this env were active. */
export function withDraftEnv<T>(env: DraftEnv, fn: () => T): T {
  const previous = envOverride
  envOverride = env
  try {
    return fn()
  } finally {
    envOverride = previous
  }
}

export function shouldShowDrafts(env: DraftEnv = envOverride ?? process.env): boolean {
  const preview = env.CASE_DRAFT_PREVIEW
  if (preview === "1" || preview === "true") return true
  return env.NODE_ENV !== "production"
}

const DRAFT_SECTION_RE = /<DraftSection\b[\s\S]*?\/>|<DraftSection\b[\s\S]*?<\/DraftSection>/g

function isVisuallyEmptySection(body: string): boolean {
  const withoutComments = body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/<!--[\s\S]*?-->/g, "")
  return withoutComments.trim().length === 0
}

function dropEmptyHeadingSections(mdx: string): string {
  const lines = mdx.split("\n")
  const chunks: { heading: string | null; lines: string[] }[] = [{ heading: null, lines: [] }]

  for (const line of lines) {
    if (/^#{2,3}\s+\S/.test(line)) {
      chunks.push({ heading: line, lines: [] })
    } else {
      chunks[chunks.length - 1].lines.push(line)
    }
  }

  const kept: string[] = []
  for (const chunk of chunks) {
    const body = chunk.lines.join("\n")
    if (chunk.heading && isVisuallyEmptySection(body)) {
      continue
    }
    if (chunk.heading) kept.push(chunk.heading)
    kept.push(...chunk.lines)
  }

  return `${kept
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()}\n`
}

/** Quita bloques DraftSection y los h2/h3 que queden sin contenido confirmado. */
export function stripDraftFromCaseBody(mdxBody: string): string {
  const withoutDrafts = mdxBody.replace(DRAFT_SECTION_RE, "")
  return dropEmptyHeadingSections(withoutDrafts)
}

export function caseBodyForEnv(
  mdxBody: string,
  env: DraftEnv = envOverride ?? process.env,
): string {
  return shouldShowDrafts(env) ? mdxBody : stripDraftFromCaseBody(mdxBody)
}

export type DraftNote = {
  label: "Borrador"
  body: string
}

/** Copy del bloque de borrador. `null` en producción pública. */
export function draftNoteForEnv(
  question: string,
  env: DraftEnv = envOverride ?? process.env,
): DraftNote | null {
  if (!shouldShowDrafts(env)) return null
  return { label: "Borrador", body: `TODO(Andrés): ${question}` }
}

export function draftNoteHtml(
  question: string,
  env: DraftEnv = envOverride ?? process.env,
): string {
  const note = draftNoteForEnv(question, env)
  if (!note) return ""
  return `<aside role="note"><p>${note.label}</p><p>${note.body}</p></aside>`
}

export function productionContentHasDraftLeak(text: string): boolean {
  return text.includes("TODO(") || text.includes("Borrador")
}
