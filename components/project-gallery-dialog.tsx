"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { ProjectNavLinks } from "@/components/project-nav-links"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import type { SiteProject } from "@/lib/projects"
import {
  getProjectImageAlt,
  getProjectImageFit,
  getProjectImagePosition,
  nextProjectImageIndex,
  prevProjectImageIndex,
  projectImageSrc,
  visibleProjectTags,
} from "@/lib/project-media"
import { cn } from "@/lib/utils"

type ProjectGalleryDialogProps = {
  project: SiteProject
  open: boolean
  onOpenChange: (open: boolean) => void
  source: string
}

export function ProjectGalleryDialog({
  project,
  open,
  onOpenChange,
  source,
}: ProjectGalleryDialogProps) {
  const [index, setIndex] = useState(0)
  const images = project.images
  const current = images[index] ?? images[0]
  const tags = visibleProjectTags(project.stack)
  const fit = current ? getProjectImageFit(current) : "cover"
  const position = current ? getProjectImagePosition(current) : "center"

  const goPrev = useCallback(() => {
    setIndex((currentIndex) => prevProjectImageIndex(currentIndex, images.length))
  }, [images.length])

  const goNext = useCallback(() => {
    setIndex((currentIndex) => nextProjectImageIndex(currentIndex, images.length))
  }, [images.length])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrev()
      if (event.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, goPrev, goNext])

  if (!current) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[min(100vw-1.5rem,52rem)] gap-0 overflow-hidden rounded-sm border-border p-0 shadow-none sm:max-w-3xl"
      >
        <div className="relative aspect-[16/10] w-full bg-muted">
          <Image
            key={current}
            src={projectImageSrc(current)}
            alt={getProjectImageAlt(project.title, current, index)}
            fill
            className={cn(
              fit === "contain" ? "object-contain p-4" : "object-cover",
              position === "top" ? "object-top" : "object-center",
            )}
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 inline-flex size-11 items-center justify-center border border-border bg-card text-foreground hover:border-accent"
            aria-label="Cerrar galería"
          >
            <X className="size-4" aria-hidden />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center border border-border bg-card text-foreground hover:border-accent"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center border border-border bg-card text-foreground hover:border-accent"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
                {index + 1} / {images.length}
              </p>
            </>
          ) : null}
        </div>

        <div className="space-y-3 border-t border-border bg-card p-5">
          <DialogTitle className="text-lg font-medium tracking-[-0.02em] text-foreground">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </DialogDescription>
          <p className="font-mono text-xs text-muted-foreground">
            {tags.shown.join(" · ")}
            {tags.extra > 0 ? ` · +${tags.extra}` : ""}
          </p>
          {images.length > 1 ? (
            <div className="flex gap-1.5 overflow-x-auto">
              {images.map((src, imageIndex) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setIndex(imageIndex)}
                  className={cn(
                    "relative size-14 shrink-0 overflow-hidden border bg-muted sm:size-16",
                    imageIndex === index ? "border-accent" : "border-border",
                  )}
                  aria-label={`Imagen ${imageIndex + 1} de ${images.length}`}
                  aria-current={imageIndex === index ? "true" : undefined}
                >
                  <Image
                    src={projectImageSrc(src)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          ) : null}
          <ProjectNavLinks project={project} source={source} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
