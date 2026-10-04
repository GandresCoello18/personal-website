"use client"

import type { JobMatch, MatchRecommendation } from "@/lib/apply/types"

const RECOMMENDATION_LABEL: Record<MatchRecommendation, string> = {
  strong: "Strong Match",
  good: "Good Match",
  partial: "Partial Match",
  low: "Low Match",
}

type MatchPanelProps = {
  match: JobMatch
}

export function MatchPanel({ match }: MatchPanelProps) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">Compatibilidad con tu perfil</h2>
          <p className="text-sm text-muted-foreground">
            Comparación explicable contra tus CVs y career facts.
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold tabular-nums text-foreground">
            {Math.round(match.score)}%
          </p>
          <p className="text-sm font-medium text-accent">
            {RECOMMENDATION_LABEL[match.recommendation]}
          </p>
        </div>
      </div>

      <p className="text-sm text-foreground">{match.summary}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <ListBlock title="Fortalezas" items={match.strengths} empty="—" />
        <ListBlock title="Gaps" items={match.gaps} empty="—" />
        <ListBlock title="Nice to have" items={match.niceToHave} empty="—" />
      </div>
    </section>
  )
}

function ListBlock({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
