import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { TrackedAnchor, TrackedLink } from "@/components/tracked-link"
import { getFeaturedCases } from "@/lib/cases"
import { COMPACT_PROJECTS } from "@/lib/projects"
import { getProjectImageFit, getProjectImagePosition } from "@/lib/project-media"
import { UmamiEvents } from "@/lib/umami"
import { cn } from "@/lib/utils"

export function Projects() {
  const featured = getFeaturedCases()

  return (
    <section id="projects" className="bg-background px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4">
          <h2 className="section-title">Proyectos</h2>
          <p className="section-subtitle max-w-2xl">
            Tres casos de estudio. El resto, en una lista: nombre, qué es, stack y enlace.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {featured.map((item, index) => {
            const src = item.coverImage ?? "/placeholder.svg"
            const fit = getProjectImageFit(src)
            const position = getProjectImagePosition(src)
            return (
              <article
                key={item.slug}
                className="card-elevated flex h-full flex-col overflow-hidden"
              >
                <Link
                  href={`/proyectos/${item.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden border-b border-border bg-muted"
                >
                  <Image
                    src={src}
                    alt={item.title}
                    width={800}
                    height={500}
                    className={cn(
                      "absolute inset-0 size-full",
                      fit === "contain" ? "object-contain p-4" : "object-cover",
                      position === "top" ? "object-top" : "object-center",
                    )}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={index === 0}
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-medium tracking-[-0.02em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">
                    {item.stack.slice(0, 4).join(" · ")}
                  </p>
                  <TrackedLink
                    href={`/proyectos/${item.slug}`}
                    event={UmamiEvents.projectDemo}
                    eventData={{ project: item.title, source: "home-case" }}
                    className="btn-primary mt-6 px-4 text-sm"
                  >
                    Ver caso
                    <ArrowRight size={16} aria-hidden />
                  </TrackedLink>
                </div>
              </article>
            )
          })}
        </div>

        <div>
          <h3 className="mb-6 text-xl font-medium tracking-[-0.02em] text-foreground">
            Más proyectos
          </h3>
          <ul className="divide-y divide-border border-y border-border">
            {COMPACT_PROJECTS.map((project) => (
              <li
                key={project.title}
                className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[minmax(10rem,14rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-6"
              >
                <p className="font-medium text-foreground">{project.title}</p>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{project.summary}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {project.stack.join(" · ")}
                  </p>
                </div>
                <TrackedAnchor
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  event={UmamiEvents.projectDemo}
                  eventData={{ project: project.title, source: "home-compact" }}
                  className="inline-flex min-h-11 items-center text-sm text-foreground underline decoration-accent underline-offset-4"
                >
                  Enlace
                </TrackedAnchor>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
