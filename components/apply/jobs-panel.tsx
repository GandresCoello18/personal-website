"use client"

import { Loader2 } from "lucide-react"
import type { ApplyJobPublic, ApplyJobStatus } from "@/lib/apply/job-types"

function statusLabel(status: ApplyJobStatus): string {
  if (status === "pending") return "En cola, se reintentará"
  if (status === "running") return "Procesando en cola"
  if (status === "ready") return "Listo para revisar"
  return "Falló tras 4 intentos"
}

function kindLabel(kind: ApplyJobPublic["kind"]): string {
  return kind === "draft" ? "Correo" : "Análisis"
}

function jobTitle(job: ApplyJobPublic): string {
  if (job.company && job.position) return `${job.company} · ${job.position}`
  if (job.company) return job.company
  if (job.position) return job.position
  return kindLabel(job.kind)
}

type JobsPanelProps = {
  jobs: ApplyJobPublic[]
  loading: boolean
  error: string
  onOpen: (job: ApplyJobPublic) => void
}

export function JobsPanel({ jobs, loading, error, onOpen }: JobsPanelProps) {
  return (
    <section className="space-y-4 rounded-none border border-border bg-card p-6 md:p-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">Trabajos en cola</h2>
        <p className="text-sm text-muted-foreground">
          Si Gemini está saturado, el análisis o el correo queda aquí y se reintenta solo. El envío
          por Gmail sigue siendo a mano.
        </p>
      </div>

      {loading && jobs.length === 0 ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Cargando cola…
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      {jobs.length === 0 && !loading ? (
        <p className="text-sm text-muted-foreground">
          No hay trabajos en cola. Si un análisis o un correo falla por saturación, aparece aquí.
        </p>
      ) : null}

      {jobs.length > 0 ? (
        <ul className="divide-y divide-border border border-border">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-foreground">{jobTitle(job)}</p>
                <p className="text-sm text-muted-foreground">
                  {kindLabel(job.kind)} · {statusLabel(job.status)}
                  {job.queueAttempts > 0 ? ` · intento ${job.queueAttempts}/4` : ""}
                </p>
                {job.status === "failed" && job.lastError ? (
                  <p className="text-sm text-red-600 dark:text-red-400">{job.lastError}</p>
                ) : null}
              </div>
              {job.status === "ready" ? (
                <button
                  type="button"
                  onClick={() => onOpen(job)}
                  className="btn-secondary min-h-11 shrink-0 px-3 text-sm"
                >
                  Abrir resultado
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
