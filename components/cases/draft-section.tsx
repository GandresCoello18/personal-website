import { draftNoteForEnv } from "../../lib/draft.ts"

type DraftSectionProps = {
  question: string
}

/** Visible solo en desarrollo o con CASE_DRAFT_PREVIEW. En producción no renderiza. */
export function DraftSection({ question }: DraftSectionProps) {
  const note = draftNoteForEnv(question)
  if (!note) return null

  return (
    <aside className="my-6 border border-border bg-muted/30 p-4" role="note">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {note.label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">{note.body}</p>
    </aside>
  )
}
