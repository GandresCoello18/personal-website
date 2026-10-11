import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function BlueprintFrame({
  children,
  className,
  marks = true,
}: {
  children: ReactNode
  className?: string
  marks?: boolean
}) {
  return (
    <div className={cn("blueprint-frame", className)}>
      {marks ? (
        <>
          <span className="blueprint-mark blueprint-mark-tl" aria-hidden>
            +
          </span>
          <span className="blueprint-mark blueprint-mark-tr" aria-hidden>
            +
          </span>
          <span className="blueprint-mark blueprint-mark-bl" aria-hidden>
            +
          </span>
          <span className="blueprint-mark blueprint-mark-br" aria-hidden>
            +
          </span>
        </>
      ) : null}
      {children}
    </div>
  )
}
