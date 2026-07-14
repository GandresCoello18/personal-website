"use client"

import { AccessGate } from "@/components/apply/access-gate"
import { PreviewPanel } from "@/components/apply/preview-panel"
import { SourceForm } from "@/components/apply/source-form"
import { useApplyFlow } from "@/hooks/use-apply-flow"

export function ApplyApp() {
  const flow = useApplyFlow()

  if (flow.checkingSession) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Cargando…
      </div>
    )
  }

  if (!flow.unlocked) {
    return (
      <AccessGate
        secret={flow.secret}
        onSecretChange={flow.setSecret}
        onSubmit={flow.unlock}
        unlocking={flow.unlocking}
        error={flow.unlockError}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Privado</p>
        <h1 className="section-title">Asistente de postulaciones</h1>
        <p className="section-subtitle">
          Analiza una vacante, genera el correo con tu CV y revisa todo antes de enviar.
        </p>
      </header>

      <SourceForm
        mode={flow.mode}
        onModeChange={flow.setMode}
        text={flow.text}
        onTextChange={flow.setText}
        imageFile={flow.imageFile}
        onImageChange={flow.setImageFile}
        analyzing={flow.analyzing}
        error={flow.analyzeError || flow.result?.error || ""}
        onAnalyze={flow.analyze}
        needsCategoryConfirm={flow.result?.needsCategoryConfirm}
        needsManualCv={flow.result?.needsManualCv}
        categoryOverride={flow.categoryOverride}
        onCategoryChange={flow.setCategoryOverride}
        manualCv={flow.manualCv}
        onManualCvChange={flow.setManualCv}
      />

      {flow.result && !flow.result.draft && flow.result.needsManualCv ? (
        <p className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Confirma categoría y CV, luego pulsa <strong>Analizar</strong> otra vez para generar el borrador.
        </p>
      ) : null}

      {flow.preview ? (
        <PreviewPanel
          preview={flow.preview}
          onChange={flow.setPreview}
          emailMissing={Boolean(flow.result?.emailMissing)}
          canSend={flow.canSend}
          sending={flow.sending}
          sendError={flow.sendError}
          sendSuccess={flow.sendSuccess}
          onSend={flow.send}
        />
      ) : null}

      {flow.result?.extract ? (
        <aside className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">Resumen detectado</p>
          <p>{flow.result.extract.summary || "—"}</p>
          {flow.result.extract.requirements.length > 0 ? (
            <ul className="mt-3 list-inside list-disc">
              {flow.result.extract.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          ) : null}
        </aside>
      ) : null}
    </div>
  )
}
