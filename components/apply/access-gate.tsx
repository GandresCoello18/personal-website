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
    <div className="card-elevated mx-auto max-w-md p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-11 items-center justify-center border border-border text-foreground">
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
          className="min-h-11 w-full rounded-none border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={unlocking || !secret}
          className="btn-primary w-full disabled:opacity-50"
        >
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
