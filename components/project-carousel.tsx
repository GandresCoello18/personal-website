"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  PROJECT_CAROUSEL_MS,
  getProjectImageAlt,
  getProjectImageFit,
  getProjectImagePosition,
  nextProjectImageIndex,
  prevProjectImageIndex,
  projectImageSrc,
  shouldAutoAdvanceProjectCarousel,
} from "@/lib/project-media"
import { cn } from "@/lib/utils"

type ProjectCarouselProps = {
  title: string
  images: string[]
  sizes: string
  priority?: boolean
  onExpand?: () => void
}

export function ProjectCarousel({
  title,
  images,
  sizes,
  priority = false,
  onExpand,
}: ProjectCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const count = images.length
  const current = images[index] ?? images[0]

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setPrefersReducedMotion(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!shouldAutoAdvanceProjectCarousel(count, reduced || prefersReducedMotion, paused)) {
      return
    }
    const timer = window.setInterval(() => {
      setIndex((currentIndex) => nextProjectImageIndex(currentIndex, count))
    }, PROJECT_CAROUSEL_MS)
    return () => window.clearInterval(timer)
  }, [count, paused, prefersReducedMotion])

  if (!current) return null

  return (
    <div
      role="region"
      aria-label={`Capturas de ${title}`}
      aria-roledescription="carrusel"
      className="bg-muted"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        const next = event.relatedTarget
        if (next instanceof Node && event.currentTarget.contains(next)) return
        setPaused(false)
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted">
        {images.map((src, imageIndex) => {
          const fit = getProjectImageFit(src)
          const position = getProjectImagePosition(src)
          const isCurrent = imageIndex === index
          return (
            <Image
              key={src}
              src={projectImageSrc(src)}
              alt={isCurrent ? getProjectImageAlt(title, src, imageIndex) : ""}
              width={800}
              height={500}
              aria-hidden={!isCurrent}
              className={cn(
                "absolute inset-0 size-full transition-opacity duration-500",
                fit === "contain" ? "object-contain p-4" : "object-cover",
                position === "top" ? "object-top" : "object-center",
                isCurrent ? "opacity-100" : "opacity-0",
              )}
              sizes={sizes}
              priority={priority && imageIndex === 0}
            />
          )
        })}
        {onExpand ? (
          <button
            type="button"
            onClick={onExpand}
            className="absolute inset-0 z-10"
            aria-label={`Abrir galería de ${title}`}
          />
        ) : null}
      </div>

      {count > 1 ? (
        <div className="relative z-20 flex items-center justify-between gap-2 border-b border-border px-2 py-1">
          <button
            type="button"
            onClick={() => setIndex((currentIndex) => prevProjectImageIndex(currentIndex, count))}
            className="inline-flex size-11 items-center justify-center border border-transparent text-foreground hover:border-accent"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-1.5" role="group">
            {images.map((src, imageIndex) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(imageIndex)}
                className={cn(
                  "size-2.5 border border-foreground",
                  imageIndex === index ? "bg-foreground" : "bg-transparent",
                )}
                aria-label={`Imagen ${imageIndex + 1} de ${count}`}
                aria-current={imageIndex === index ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIndex((currentIndex) => nextProjectImageIndex(currentIndex, count))}
            className="inline-flex size-11 items-center justify-center border border-transparent text-foreground hover:border-accent"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  )
}
