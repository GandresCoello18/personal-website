"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const MAX_VISIBLE = 4
const THUMB_SIZE = "size-[4.25rem] sm:size-[4.75rem]"

type ExperienceGalleryProps = {
  images: string[]
  altPrefix: string
}

export function ExperienceGallery({ images, altPrefix }: ExperienceGalleryProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openAt = useCallback((index: number) => {
    setActiveIndex(index)
    setOpen(true)
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, goPrev, goNext])

  if (images.length === 0) return null

  const hasOverflow = images.length > MAX_VISIBLE
  const visibleCount = hasOverflow ? MAX_VISIBLE : images.length
  const extraCount = images.length - (MAX_VISIBLE - 1)

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {Array.from({ length: visibleCount }, (_, i) => {
          const isOverlayTile = hasOverflow && i === visibleCount - 1
          const src = images[i]
          const openIndex = isOverlayTile ? MAX_VISIBLE - 1 : i

          return (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => openAt(openIndex)}
              className={cn(
                THUMB_SIZE,
                "relative shrink-0 overflow-hidden rounded-md bg-muted",
                "transition-transform duration-200 hover:scale-[1.03]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
              aria-label={
                isOverlayTile
                  ? `Ver ${extraCount} imágenes más`
                  : `Ver imagen ${i + 1} de ${images.length}`
              }
            >
              <Image
                src={src}
                alt={`${altPrefix} — miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="76px"
              />
              {isOverlayTile ? (
                <span className="absolute inset-0 flex items-center justify-center bg-background/75 text-sm font-semibold text-foreground backdrop-blur-[1px]">
                  +{extraCount}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[min(100vw-2rem,56rem)] gap-0 overflow-hidden border-border p-0 sm:max-w-3xl"
        >
          <DialogTitle className="sr-only">
            {altPrefix} — galería ({activeIndex + 1} de {images.length})
          </DialogTitle>

          <div className="relative aspect-[16/10] w-full bg-muted">
            <Image
              key={images[activeIndex]}
              src={images[activeIndex]}
              alt={`${altPrefix} — imagen ${activeIndex + 1}`}
              fill
              className="object-contain animate-in fade-in zoom-in-95 duration-200"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full border border-border bg-background/90 p-2 text-foreground shadow-sm transition-colors hover:bg-muted"
              aria-label="Cerrar galería"
            >
              <X className="size-4" />
            </button>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/90 p-2 text-foreground shadow-sm transition-colors hover:bg-muted"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/90 p-2 text-foreground shadow-sm transition-colors hover:bg-muted"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="size-5" />
                </button>
                <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {activeIndex + 1} / {images.length}
                </p>
              </>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
