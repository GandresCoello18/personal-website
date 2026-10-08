"use client"

import { useEffect, useRef, useState } from "react"
import { resolveHomeSectionId } from "@/lib/nav"

export function useActiveSection(sectionIds: readonly string[], enabled: boolean) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const metricsRef = useRef(new Map<string, { ratio: number; top: number }>())

  useEffect(() => {
    if (!enabled) {
      setActiveId(null)
      return
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          metricsRef.current.set(entry.target.id, {
            ratio: entry.intersectionRatio,
            top: entry.boundingClientRect.top,
          })
        }

        setActiveId(
          resolveHomeSectionId(
            sectionIds,
            [...metricsRef.current.entries()].map(([id, value]) => ({ id, ...value })),
          ),
        )
      },
      {
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
        rootMargin: "-96px 0px -45% 0px",
      },
    )

    for (const element of elements) observer.observe(element)
    return () => observer.disconnect()
  }, [enabled, sectionIds])

  return activeId
}
