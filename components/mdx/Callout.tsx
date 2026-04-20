import type { ReactNode } from "react"

type CalloutProps = {
  children?: ReactNode
  title?: string
  variant?: "info" | "tip"
}

/** MDX shortcode for highlighted notes. */
export function Callout({ children, title, variant = "info" }: CalloutProps) {
  const border =
    variant === "tip"
      ? "border-accent/40 bg-accent/5"
      : "border-primary/25 bg-primary/5"
  return (
    <aside
      className={`my-6 rounded-xl border p-4 ${border}`}
      role="note"
    >
      {title ? <p className="mb-2 font-semibold text-foreground">{title}</p> : null}
      <div className="text-sm leading-relaxed text-muted-foreground [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
