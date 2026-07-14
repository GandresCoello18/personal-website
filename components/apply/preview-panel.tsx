"use client"

import { Loader2 } from "lucide-react"
import type { PreviewState } from "@/hooks/use-apply-flow"
import type { JobCategory } from "@/lib/apply/types"
import { CV_FILES } from "@/lib/apply/cv"

type PreviewPanelProps = {
  preview: PreviewState
  onChange: (next: PreviewState) => void
  emailMissing: boolean
  canSend: boolean
  canDraft: boolean
  drafting: boolean
  draftError: string
  onGenerateDraft: () => void
  sending: boolean
  sendError: string
  sendSuccess: boolean
  onSend: () => void
}

export function PreviewPanel({
  preview,
  onChange,
  emailMissing,
  canSend,
  canDraft,
  drafting,
  draftError,
  onGenerateDraft,
  sending,
  sendError,
  sendSuccess,
  onSend,
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
        <p className="text-sm text-green-700 dark:text-green-400">Postulación enviada correctamente.</p>
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
