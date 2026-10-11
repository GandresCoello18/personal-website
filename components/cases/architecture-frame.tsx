import type { ReactNode } from "react"
import { BlueprintFrame } from "@/components/blueprint-frame"

export function ArchitectureFrame({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <figure className="my-8">
      <BlueprintFrame className="bg-background/40 p-4 text-accent sm:p-6">
        {children}
      </BlueprintFrame>
      <figcaption className="mt-3 font-mono text-xs text-muted-foreground">{caption}</figcaption>
    </figure>
  )
}
