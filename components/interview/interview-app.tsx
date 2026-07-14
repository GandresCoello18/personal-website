"use client"

import { Copy, Loader2 } from "lucide-react"
import { AccessGate } from "@/components/apply/access-gate"
import { useInterviewFlow } from "@/hooks/use-interview-flow"

export function InterviewApp() {
  const flow = useInterviewFlow()

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
        <h1 className="section-title">Respuestas a entrevistas</h1>
        <p className="section-subtitle">
          Pega las preguntas del reclutador. Respuestas cortas y profesionales basadas en tus CVs y
          career facts (experiencia desde 2018).
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-border bg-card p-6 md:p-8">
        <label className="block space-y-2 text-sm">
          <span className="font-medium text-foreground">Preguntas</span>
          <textarea
            rows={12}
            value={flow.questions}
            onChange={(e) => flow.setQuestions(e.target.value)}
            placeholder={`1. ¿Cuántos años de experiencia tenés trabajando como Backend Developer?\n2. ¿Cuántos años con Node.js y TypeScript? Indicá tu nivel de dominio.\n3. ¿Qué experiencia tenés utilizando NestJS?`}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </label>

        {flow.error ? <p className="text-sm text-red-600 dark:text-red-400">{flow.error}</p> : null}

        <button
          type="button"
          onClick={flow.submit}
          disabled={flow.loading || !flow.questions.trim()}
          className="btn-primary disabled:opacity-50"
        >
          {flow.loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Generando…
            </span>
          ) : (
            "Responder"
          )}
        </button>
      </section>

      {flow.answers.length > 0 ? (
        <section className="space-y-4 rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">Respuestas</h2>
            <button
              type="button"
              onClick={flow.copyAll}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
            >
              <Copy className="size-4" />
              Copiar todas
            </button>
          </div>
          {flow.copyStatus ? (
            <p className="text-sm text-green-700 dark:text-green-400">{flow.copyStatus}</p>
          ) : null}

          <ul className="space-y-6">
            {flow.answers.map((item, index) => (
              <li key={`${index}-${item.question.slice(0, 24)}`} className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {index + 1}. {item.question}
                </p>
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => flow.updateAnswer(index, e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  type="button"
                  onClick={() => flow.copyOne(item.answer)}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Copiar respuesta
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
