"use client"

import { Loader2, Lock } from "lucide-react"

type AccessGateProps = {
  secret: string
  onSecretChange: (value: string) => void
  onSubmit: () => void
  unlocking: boolean
  error: string
}

export function AccessGate({
  secret,
  onSecretChange,
  onSubmit,
  unlocking,
  error,
}: AccessGateProps) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Lock className="size-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Acceso restringido</h1>
          <p className="text-sm text-muted-foreground">Herramienta privada</p>
        </div>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Clave de acceso"
          value={secret}
          onChange={(e) => onSecretChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
        <button type="submit" disabled={unlocking || !secret} className="btn-primary w-full disabled:opacity-50">
          {unlocking ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Validando…
            </span>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  )
}
