"use client"

import { TrackedAnchor, TrackedLink } from "@/components/tracked-link"
import type { ProjectNavLink, SiteProject } from "@/lib/projects"
import { getProjectNavLinks } from "@/lib/projects"
import { UmamiEvents } from "@/lib/umami"
import { cn } from "@/lib/utils"

type ProjectNavLinksProps = {
  project: SiteProject
  source: string
  exclude?: ProjectNavLink["kind"][]
  className?: string
  linkClassName?: string
}

export function ProjectNavLinks({
  project,
  source,
  exclude = [],
  className,
  linkClassName,
}: ProjectNavLinksProps) {
  const links = getProjectNavLinks(project).filter((link) => !exclude.includes(link.kind))
  if (links.length === 0) return null

  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}>
      {links.map((link) => (
        <li key={link.kind}>
          {link.external ? (
            <TrackedAnchor
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              event={link.kind === "github" ? UmamiEvents.projectGithub : UmamiEvents.projectDemo}
              eventData={{ project: project.title, source }}
              className={cn(
                "inline-flex min-h-11 items-center text-sm text-foreground underline decoration-accent underline-offset-4",
                linkClassName,
              )}
            >
              {link.label}
            </TrackedAnchor>
          ) : (
            <TrackedLink
              href={link.href}
              event={UmamiEvents.projectDemo}
              eventData={{ project: project.title, source }}
              className={cn(
                "inline-flex min-h-11 items-center text-sm text-foreground underline decoration-accent underline-offset-4",
                linkClassName,
              )}
            >
              {link.label}
            </TrackedLink>
          )}
        </li>
      ))}
    </ul>
  )
}
