"use client"

import { useEffect, useId, useRef, useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { ExperienceGallery } from "@/components/experience-gallery"

const COLLAPSED_LINES = 6

export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  description: string
  logo: string
  images?: string[]
  featured?: boolean
}

type ExperienceCardProps = {
  item: ExperienceItem
  showGallery?: boolean
}

export function ExperienceCard({ item, showGallery = true }: ExperienceCardProps) {
  const { role, company, period, description, logo, images = [], featured = false } = item
  const [expanded, setExpanded] = useState(featured)
  const [needsToggle, setNeedsToggle] = useState(false)
  const measureRef = useRef<HTMLParagraphElement>(null)
  const descriptionId = useId()

  useEffect(() => {
    if (featured || !measureRef.current) return
    const el = measureRef.current
    const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight) || 24
    const maxCollapsed = lineHeight * COLLAPSED_LINES
    setNeedsToggle(el.scrollHeight > maxCollapsed + 4)
  }, [description, featured])

  const isExpanded = featured || expanded
  const hasGallery = showGallery && images.length > 0
  const canExpand = !featured && (needsToggle || hasGallery)

  return (
    <article
      className={cn(
        "card-elevated w-full self-start border-l-4 border-l-accent p-6 md:p-8",
        featured && "ring-1 ring-accent/25",
      )}
    >
      <div className="flex gap-4">
        <div className="shrink-0">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-accent/10 ring-1 ring-border">
            <Image
              src={logo}
              alt={`Logo ${company}`}
              width={48}
              height={48}
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              {featured ? (
                <span className="mb-1 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                  Destacado
                </span>
              ) : null}
              <h3 className="text-lg font-bold leading-snug text-foreground md:text-xl">{role}</h3>
              <p className="font-medium text-accent">{company}</p>
            </div>
            <span className="shrink-0 text-sm font-medium text-muted-foreground whitespace-nowrap">{period}</span>
          </div>

          <div className="relative mt-3">
            <p
              ref={measureRef}
              id={descriptionId}
              className={cn(
                "text-muted-foreground leading-relaxed transition-[max-height] duration-300 ease-in-out",
                !isExpanded && needsToggle && "line-clamp-6",
              )}
            >
              {description}
            </p>

            {!isExpanded && needsToggle ? (
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card via-card/80 to-transparent"
                aria-hidden
              />
            ) : null}
          </div>

          {canExpand ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
              aria-expanded={isExpanded}
              aria-controls={descriptionId}
            >
              {isExpanded ? (
                <>
                  Mostrar menos
                  <ChevronUp className="size-4" aria-hidden />
                </>
              ) : (
                <>
                  {hasGallery && !needsToggle ? "Ver más" : "Leer más"}
                  <ChevronDown className="size-4" aria-hidden />
                </>
              )}
            </button>
          ) : null}

          {isExpanded && hasGallery ? (
            <ExperienceGallery images={images} altPrefix={`${company} — ${role}`} />
          ) : null}
        </div>
      </div>
    </article>
  )
}
