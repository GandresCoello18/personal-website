"use client"

import { useState } from "react"
import Image from "next/image"

import { ProjectGalleryDialog } from "@/components/project-gallery-dialog"
import { ProjectNavLinks } from "@/components/project-nav-links"
import type { SiteProject } from "@/lib/projects"
import {
  getProjectImageAlt,
  getProjectImageFit,
  getProjectImagePosition,
  projectImageSrc,
} from "@/lib/project-media"
import { cn } from "@/lib/utils"

type CompactProjectRowProps = {
  project: SiteProject
}

export function CompactProjectRow({ project }: CompactProjectRowProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const cover = project.images[0]
  const fit = cover ? getProjectImageFit(cover) : "cover"
  const position = cover ? getProjectImagePosition(cover) : "center"

  return (
    <li className="grid grid-cols-1 gap-3 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-6">
      <button
        type="button"
        onClick={() => setGalleryOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Abrir galería de ${project.title}`}
        className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-3 text-left sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-4"
      >
        <span className="relative size-14 overflow-hidden border border-border bg-muted sm:size-16">
          {cover ? (
            <Image
              src={projectImageSrc(cover)}
              alt={getProjectImageAlt(project.title, cover, 0)}
              fill
              className={cn(
                fit === "contain" ? "object-contain p-0.5" : "object-cover",
                position === "top" ? "object-top" : "object-center",
              )}
              sizes="72px"
            />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block font-medium text-foreground">{project.title}</span>
          <span className="mt-1 block text-sm text-muted-foreground">{project.summary}</span>
          <span className="mt-1 block font-mono text-xs text-muted-foreground">
            {project.stack.join(" · ")}
          </span>
        </span>
      </button>
      <ProjectNavLinks project={project} source="home-compact" />
      {galleryOpen ? (
        <ProjectGalleryDialog
          project={project}
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
          source="home-compact-gallery"
        />
      ) : null}
    </li>
  )
}
