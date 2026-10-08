"use client"

import { AlertTriangle, History, Loader2 } from "lucide-react"
import type { PreviewState } from "@/hooks/use-apply-flow"
import { CV_FILES } from "@/lib/apply/cv"
import { formatAppliedBanner, formatCompanyWarning, formatEmailWarning } from "@/lib/radar/dates"
import type { ApplyCheckResult } from "@/lib/radar/types"
import type { JobCategory } from "@/lib/apply/types"

type PreviewPanelProps = {
  preview: PreviewState
  onChange: (next: PreviewState) => void
  emailMissing: boolean
  lowMatch?: boolean
  canSend: boolean
  canDraft: boolean
  drafting: boolean
  draftError: string
  onGenerateDraft: () => void
  sending: boolean
  sendError: string
  sendSuccess: boolean
  onSend: () => void
  history: ApplyCheckResult | null
  historyLoading: boolean
}

export function PreviewPanel({
  preview,
  onChange,
  emailMissing,
  lowMatch,
  canSend,
  canDraft,
  drafting,
  draftError,
  onGenerateDraft,
  sending,
  sendError,
  sendSuccess,
  onSend,
  history,
  historyLoading,
}: PreviewPanelProps) {
  const patch = <K extends keyof PreviewState>(key: K, value: PreviewState[K]) => {
    onChange({ ...preview, [key]: value })
  }

  const hasDraft = Boolean(preview.subject.trim() && preview.body.trim())

  return (
    <section className="space-y-6 rounded-xl border border-border bg-card p-6 md:p-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">2. Vista previa</h2>
        <p className="text-sm text-muted-foreground">
          Confirma los datos, genera el correo (2ª llamada a Gemini) y revisa antes de enviar.
        </p>
      </div>

      {historyLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Consultando historial…
        </p>
      ) : null}

      {history?.historyUnavailable ? (
        <div
          role="status"
          className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="space-y-1">
            <p className="font-medium">Historial no disponible</p>
            <p>
              No se pudo consultar Redis. Puedes enviar, pero confirma que no hayas aplicado ya a
              esta vacante.
            </p>
          </div>
        </div>
      ) : null}

      {history?.status === "applied" && history.record ? (
        <div
          role="status"
          className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <History className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div className="space-y-1">
            <p className="font-medium">Ya hay una postulación registrada</p>
            <p>{formatAppliedBanner(history.record)}</p>
            <p>El servidor bloqueará un segundo envío salvo que confirmes el duplicado.</p>
          </div>
        </div>
      ) : null}

      {history?.status === "in_progress" ? (
        <div
          role="status"
          className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>Hay otro envío en curso para esta vacante. Espera un momento antes de reintentar.</p>
        </div>
      ) : null}

      {history && !history.historyUnavailable
        ? history.softWarnings.map((warning) => (
            <div
              key={`${warning.kind}-${warning.appliedAt}`}
              role="status"
              className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground"
            >
              {warning.kind === "company"
                ? formatCompanyWarning(warning)
                : formatEmailWarning(warning)}
              . No bloquea el envío.
            </div>
          ))
        : null}

      {lowMatch ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          El match con tu perfil es bajo. Puedes enviar igual, pero revisa gaps y personaliza el
          correo con cuidado.
        </div>
      ) : null}

      {emailMissing && !preview.email.trim() ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          No se encontró un correo en la publicación. Puedes pegarlo aquí cuando lo tengas; el envío
          quedará bloqueado hasta que haya un destinatario válido.
        </div>
      ) : null}
      {!emailMissing && !preview.email.trim() ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Falta el email del destinatario para poder enviar.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Empresa" value={preview.company} onChange={(v) => patch("company", v)} />
        <Field label="Cargo" value={preview.position} onChange={(v) => patch("position", v)} />
        <Field
          label="Nombre del reclutador (opcional)"
          value={preview.recruiterName}
          onChange={(v) => patch("recruiterName", v)}
          placeholder="María Vélez"
        />
        <Field
          label="Email destinatario (opcional hasta enviar)"
          value={preview.email}
          onChange={(v) => patch("email", v)}
          type="email"
          placeholder="reclutamiento@empresa.com"
        />
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-foreground">Categoría</span>
          <select
            value={preview.category}
            onChange={(e) => {
              const category = e.target.value as JobCategory
              const cvFilename =
                category === "software"
                  ? CV_FILES.software
                  : category === "education"
                    ? CV_FILES.education
                    : preview.cvFilename
              onChange({ ...preview, category, cvFilename })
            }}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="software">software</option>
            <option value="education">education</option>
            <option value="unknown">unknown</option>
          </select>
        </label>
        <Field
          label="Confianza"
          value={String(preview.confidence)}
          onChange={(v) => patch("confidence", Number(v) || 0)}
          type="number"
        />
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-foreground">CV adjunto</span>
          <select
            value={preview.cvFilename}
            onChange={(e) => patch("cvFilename", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            <option value="">— Selecciona —</option>
            <option value={CV_FILES.software}>{CV_FILES.software}</option>
            <option value={CV_FILES.education}>{CV_FILES.education}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onGenerateDraft}
          disabled={!canDraft || drafting}
          className="btn-primary disabled:opacity-50"
        >
          {drafting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Generando correo…
            </span>
          ) : hasDraft ? (
            "Regenerar correo"
          ) : (
            "Generar correo"
          )}
        </button>
      </div>
      {draftError ? <p className="text-sm text-red-600 dark:text-red-400">{draftError}</p> : null}

      <Field label="Asunto" value={preview.subject} onChange={(v) => patch("subject", v)} />

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-foreground">Cuerpo del correo</span>
        <textarea
          rows={10}
          value={preview.body}
          onChange={(e) => patch("body", e.target.value)}
          placeholder="Pulsa «Generar correo» para crear el borrador con Gemini."
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </label>

      <p className="text-xs text-muted-foreground">
        Adjunto: {preview.cvFilename || "ninguno"} (PDF binario, no un enlace)
      </p>

      {sendError ? <p className="text-sm text-red-600 dark:text-red-400">{sendError}</p> : null}
      {sendSuccess ? (
        <p className="text-sm text-green-700 dark:text-green-400">
          Postulación enviada correctamente.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSend}
          disabled={!canSend || sending}
          className="btn-primary disabled:opacity-50"
        >
          {sending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Enviando…
            </span>
          ) : history?.status === "applied" || history?.historyUnavailable ? (
            "Enviar de todos modos"
          ) : (
            "Enviar"
          )}
        </button>
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </label>
  )
}
