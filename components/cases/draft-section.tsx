type DraftSectionProps = {
  question: string
}

/** Sección incompleta: no rellena con copy inventado. */
export function DraftSection({ question }: DraftSectionProps) {
  return (
    <aside className="my-6 border border-border bg-muted/30 p-4" role="note">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Borrador
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">TODO(Andrés): {question}</p>
    </aside>
  )
}
