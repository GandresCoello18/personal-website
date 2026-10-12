import { CompactProjectRow } from "@/components/compact-project-row"
import { FeaturedProjectCard } from "@/components/featured-project-card"
import { getCompactProjects, getFeaturedProjects } from "@/lib/projects"

export function Projects() {
  const featured = getFeaturedProjects()
  const compact = getCompactProjects()

  return (
    <section id="projects" className="bg-background px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4">
          <h2 className="section-title">Proyectos</h2>
          <p className="section-subtitle max-w-2xl">
            Importadora Sacón está en pruebas; Tayos y Meniuz siguen en producción. El resto abre
            galería en el sitio: miniatura, qué es y stack.
          </p>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {featured.map((project, index) => (
            <FeaturedProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div>
          <h3 className="mb-6 text-xl font-medium tracking-[-0.02em] text-foreground">
            Más proyectos
          </h3>
          <ul className="divide-y divide-border border-y border-border">
            {compact.map((project) => (
              <CompactProjectRow key={project.id} project={project} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
