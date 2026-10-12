"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { ProjectCarousel } from "@/components/project-carousel"
import { ProjectGalleryDialog } from "@/components/project-gallery-dialog"
import { ProjectNavLinks } from "@/components/project-nav-links"
import { TrackedLink } from "@/components/tracked-link"
import type { SiteProject } from "@/lib/projects"
import { getProjectImageSizes, visibleProjectTags } from "@/lib/project-media"
import { UmamiEvents } from "@/lib/umami"

type FeaturedProjectCardProps = {
  project: SiteProject
  index: number
}

export function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const tags = visibleProjectTags(project.stack, 6)
  const caseHref = project.caseSlug ? `/proyectos/${project.caseSlug}` : null

  return (
    <article className="card-elevated flex h-full flex-col overflow-hidden">
      <ProjectCarousel
        title={project.title}
        images={project.images}
        sizes={getProjectImageSizes(true)}
        priority={index === 0}
        onExpand={() => setGalleryOpen(true)}
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          {tags.shown.join(" · ")}
          {tags.extra > 0 ? ` · +${tags.extra}` : ""}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {caseHref ? (
            <TrackedLink
              href={caseHref}
              event={UmamiEvents.projectDemo}
              eventData={{ project: project.title, source: "home-featured" }}
              className="btn-primary px-4 text-sm"
            >
              Ver caso
              <ArrowRight size={16} aria-hidden />
            </TrackedLink>
          ) : (
            <button
              type="button"
              onClick={() => setGalleryOpen(true)}
              className="btn-primary px-4 text-sm"
            >
              Ver capturas
              <ArrowRight size={16} aria-hidden />
            </button>
          )}
          <ProjectNavLinks
            project={project}
            source="home-featured"
            exclude={caseHref ? ["case"] : []}
          />
        </div>
      </div>
      <ProjectGalleryDialog
        project={project}
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        source="home-featured-gallery"
      />
    </article>
  )
}
