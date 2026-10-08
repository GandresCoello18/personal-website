"use client"

import { Loader2 } from "lucide-react"
import type { SourceMode } from "@/hooks/use-apply-flow"
import type { CvKey } from "@/lib/apply/cv"
import type { JobCategory } from "@/lib/apply/types"
import { CV_FILES } from "@/lib/apply/cv"

type SourceFormProps = {
  mode: SourceMode
  onModeChange: (mode: SourceMode) => void
  text: string
  onTextChange: (value: string) => void
  recruiterProfileText: string
  onRecruiterProfileTextChange: (value: string) => void
  imageFile: File | null
  onImageChange: (file: File | null) => void
  jobUrl: string
  onJobUrlChange: (value: string) => void
  analyzing: boolean
  error: string
  onAnalyze: () => void
  needsCategoryConfirm?: boolean
  needsManualCv?: boolean
  categoryOverride: JobCategory | ""
  onCategoryChange: (value: JobCategory | "") => void
  manualCv: CvKey | ""
  onManualCvChange: (value: CvKey | "") => void
  canRegister: boolean
  registering: boolean
  registerError: string
  registerSuccess: boolean
  onRegister: () => void
}

export function SourceForm({
  mode,
  onModeChange,
  text,
  onTextChange,
  recruiterProfileText,
  onRecruiterProfileTextChange,
  imageFile,
  onImageChange,
  jobUrl,
  onJobUrlChange,
  analyzing,
  error,
  onAnalyze,
  needsCategoryConfirm,
  needsManualCv,
  categoryOverride,
  onCategoryChange,
  manualCv,
  onManualCvChange,
  canRegister,
  registering,
  registerError,
  registerSuccess,
  onRegister,
}: SourceFormProps) {
  return (
    <section className="space-y-6 rounded-xl border border-border bg-card p-6 md:p-8">
      <div>
        <h2 className="text-lg font-bold text-foreground">1. Fuente</h2>
        <p className="text-sm text-muted-foreground">
          Pega el texto de la vacante o sube una captura. La URL sirve para el historial y para no
          postular dos veces. Analizar = 1 llamada (sin redactar el correo).
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="source-mode"
            checked={mode === "text"}
            onChange={() => onModeChange("text")}
          />
          Texto
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="source-mode"
            checked={mode === "image"}
            onChange={() => onModeChange("image")}
          />
          Imagen (PNG / JPG)
        </label>
      </div>

      {mode === "text" ? (
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={12}
          placeholder="Pega aquí el texto completo de la vacante…"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      ) : (
        <div className="space-y-2">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
          />
          {imageFile ? (
            <p className="text-xs text-muted-foreground">
              {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
            </p>
          ) : null}
        </div>
      )}

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-foreground">
          URL de la vacante <span className="font-normal text-muted-foreground">(opcional)</span>
        </span>
        <p className="text-xs text-muted-foreground">
          LinkedIn o el ATS. Se normaliza para detectar si ya aplicaste, también si lo hiciste por
          Telegram o a mano.
        </p>
        <input
          type="url"
          inputMode="url"
          autoComplete="off"
          value={jobUrl}
          onChange={(e) => onJobUrlChange(e.target.value)}
          placeholder="https://www.linkedin.com/jobs/view/4012345678/"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="font-medium text-foreground">
          Perfil del reclutador{" "}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </span>
        <p className="text-xs text-muted-foreground">
          Pega About, experiencia o notas de su LinkedIn. Se usa al generar el correo para conectar
          persona + puesto solo si hay overlap real con tu perfil — sin inventar.
        </p>
        <textarea
          value={recruiterProfileText}
          onChange={(e) => onRecruiterProfileTextChange(e.target.value)}
          rows={6}
          placeholder={`Ejemplo:\nTalent Partner en Acme · interesa IA aplicada, comunidades tech, mentorship…\nAbout: …`}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </label>

      {(needsCategoryConfirm || needsManualCv) && (
        <div className="grid gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30 md:grid-cols-2">
          {needsCategoryConfirm ? (
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">
                Confirmar categoría (confianza baja)
              </span>
              <select
                value={categoryOverride}
                onChange={(e) => onCategoryChange(e.target.value as JobCategory | "")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="">—</option>
                <option value="software">software</option>
                <option value="education">education</option>
                <option value="unknown">unknown</option>
              </select>
            </label>
          ) : null}
          {needsManualCv || categoryOverride === "unknown" ? (
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Seleccionar CV</span>
              <select
                value={manualCv}
                onChange={(e) => onManualCvChange(e.target.value as CvKey | "")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                <option value="">—</option>
                <option value="software">{CV_FILES.software}</option>
                <option value="education">{CV_FILES.education}</option>
              </select>
            </label>
          ) : null}
        </div>
      )}

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {registerError ? (
        <p className="text-sm text-red-600 dark:text-red-400">{registerError}</p>
      ) : null}
      {registerSuccess ? (
        <p className="text-sm text-green-700 dark:text-green-400">
          Registrada como aplicada. No se envió correo.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={analyzing}
          className="btn-primary disabled:opacity-50"
        >
          {analyzing ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Analizando…
            </span>
          ) : (
            "Analizar"
          )}
        </button>
        <button
          type="button"
          onClick={onRegister}
          disabled={!canRegister || registering}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          {registering ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Registrando…
            </span>
          ) : (
            "Registrar como aplicada"
          )}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        «Registrar como aplicada» no envía correo. Úsalo si ya postulaste en Easy Apply u otro
        formulario.
      </p>
    </section>
  )
}
