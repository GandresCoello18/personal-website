"use client"

import { useState } from "react"
import { ExternalLink, Github, Lock, Code2 } from "lucide-react"
import { TrackedAnchor } from "@/components/tracked-link"
import { trackEvent, UmamiEvents } from "@/lib/umami"
import { cn } from "@/lib/utils"
import {
  getProjectImageAlt,
  getProjectImageFit,
  getProjectImagePosition,
  getProjectImageSizes,
  shouldEagerLoadProjectImage,
  visibleProjectTags,
} from "@/lib/project-media"

interface Project {
  id: string
  title: string
  description: string
  images: string[]
  tags: string[]
  link: string
  github?: string
  isPrivate?: boolean
  featured: boolean
  stats?: {
    label: string
    value: string
  }[]
}

const projects: Project[] = [
  {
    id: "1",
    title: "Meniuz",
    description:
      "Meniuz es una aplicación móvil y web que permite a los usuarios encontrar y descubrir la castronomia de las dintintas ciudades del Ecuador, entran categorias como: restaurantes, cafeterias, heladerias y licorerias.",
    images: [
      "/proyectos/meniuz/landing.png",
      "/proyectos/meniuz/list-business-app.png",
      "/proyectos/meniuz/meniuz-list-cities.png",
      "/proyectos/meniuz/apps-native.jpg",
      "/proyectos/meniuz/AWS-architecture-diagram-showing-the-final-cloud-image-1.png",
    ],
    tags: [
      "Next.js",
      "TypeScript",
      "GraphQL",
      "Express.js",
      "CI/CD",
      "Redis",
      "Kotlin",
      "Swift",
      "Stripe",
      "MySQL",
      "TailwindCSS",
    ],
    link: "https://onelink.to/meniuz",
    github: "",
    isPrivate: true,
    featured: true,
    stats: [
      { label: "Usuarios", value: "5K+" },
      { label: "Ciudades", value: "20+" },
      { label: "Categorias", value: "4+" },
    ],
  },
  {
    id: "75",
    title: "Tayos App",
    description:
      "Tayos es la app B2B de la distribuidora de partes más grande del Ecuador. Accede a más de 30.000 productos, repuestos de las mejores marcas y soluciones para los vehículos más comerciales del país. Diseñada exclusivamente para clientes B2B, Tayos facilita la compra de repuestos automotrices desde una plataforma rápida, práctica, segura y facil de usar. Con nuestra app puedes consultar productos, revisar disponibilidad, acceder a un amplio catálogo de partes",
    images: ["/proyectos/odoo-app/odoo-app.png", "/proyectos/odoo-app/odoo-app-02.png"],
    tags: [
      "React Native",
      "Expo Go",
      "Android Studio",
      "IOS - Xcode",
      "Node.js",
      "Odoo API",
      "Whatsapp Messaging",
    ],
    link: "https://apps.apple.com/ec/app/tayos/id6776895287",
    isPrivate: true,
    featured: true,
  },
  {
    id: "234",
    title: "Monitor de AI para comunidades",
    description:
      "Transformar fuentes de video provenientes de cámaras en información útil para una comunidad, barrio o zona determinada. El sistema está orientado a detectar patrones, identificar eventos relevantes y apoyar la toma de decisiones, sin realizar reconocimiento facial ni vigilancia invasiva.",
    images: [
      "/proyectos/community-ai-monitor/monitor-park.png",
      "/proyectos/community-ai-monitor/diagram-fluj.png",
    ],
    tags: ["Python", "FastAPI", "Docker", "PostgreSQL", "Ollama", "Worker", "Camara IP", "Yolo"],
    link: "https://github.com/GandresCoello18/community-ai-monitor/tree/master",
    github: "https://github.com/GandresCoello18/community-ai-monitor/tree/master",
    isPrivate: false,
    featured: true,
    stats: [
      { label: "Cámaras", value: "10+" },
      { label: "Eventos", value: "10+" },
      { label: "Decisiones", value: "10+" },
    ],
  },
  {
    id: "3",
    title: "Image Intelligence Platform",
    description:
      "Plataforma de procesamiento de imagenes, permite a los usuarios subir imagenes y procesarlas o extraier informacion de ellas para luego almacenarlas en el sistema para su futura consulta.",
    images: [
      "/proyectos/image-intelligence-platform/image-process-inteligent.png",
      "/proyectos/image-intelligence-platform/diagram.png",
    ],
    tags: ["Nx Workspace", "Redis", "Queue", "TypeScript", "docker", "MongoDB", "Minio"],
    link: "https://github.com/GandresCoello18/image-intelligence-job",
    github: "https://github.com/GandresCoello18/image-intelligence-job",
    isPrivate: false,
    featured: true,
    stats: [
      { label: "Procesamiento de imagenes", value: "1" },
      { label: "Imagenes procesadas", value: "10+" },
    ],
  },
  {
    id: "112",
    title: "Order Lifecycle Platform",
    description:
      "Plataforma backend de microservicios con arquitectura orientada a eventos usando NestJS, NX Monorepo, Redis + BullMQ y PostgreSQL.",
    images: ["/proyectos/order-lifecycle-platform/diagram.png"],
    tags: ["Nx Workspace", "Redis", "Gateway", "Queue", "TypeScript", "docker", "MongoDB", "Minio"],
    link: "https://chimborazo-near-the-sun.vercel.app",
    github: "https://github.com/GandresCoello18/Chimborazo-near-the-sun",
    isPrivate: false,
    featured: true,
    stats: [
      { label: "Volcan", value: "1" },
      { label: "Imagenes", value: "6" },
      { label: "Videos", value: "6" },
    ],
  },
  {
    id: "222",
    title: "Bob's Corn",
    description:
      "API REST desarrollada con TypeScript y Node.js que permite a los clientes realizar compras de maíz. El sistema implementa control de rate limiting para gestionar el tráfico de solicitudes, registra las transacciones exitosas y de rate limit en base de datos y proporciona endpoints para consultar el historial de compras. Incluye validación de datos, manejo centralizado de errores y logging estructurado para facilitar el monitoreo y debugging del sistema.",
    images: ["/proyectos/bob-s-corn/client.png", "/proyectos/bob-s-corn/diagram.jpeg"],
    tags: [
      "TypeScript",
      "Node.js",
      "API",
      "Rate Limiting",
      "Database",
      "Error Handling",
      "Logging",
      "Ioredis + Redis Commands",
    ],
    link: "https://github.com/GandresCoello18/Bob-s-Corn-API",
    github: "https://github.com/GandresCoello18/Bob-s-Corn-API",
    isPrivate: false,
    featured: true,
    stats: [
      { label: "Transacciones", value: "100+" },
      { label: "Validaciones", value: "+6" },
      { label: "Rate Limit", value: "100+" },
    ],
  },
  {
    id: "7",
    title: "Spotify Clone",
    description:
      "Spotify Clone App es una aplicación web que permite a los usuarios escuchar musica, crear playlists, conocer artistas y sus albunes, puedes agregar o quitar de tus favoritos y se vera reflejado en tu perfil origial de Spotify.",
    images: [
      "/proyectos/spotify-clone/spotify-clone-app.png",
      "/proyectos/spotify-clone/1756679537331.jpg",
    ],
    tags: ["Next.js", "TypeScript", "TailwindCSS", "Api", "Spotify API"],
    link: "https://andres-coello-full-stack.vercel.app/",
    github: "https://github.com/GandresCoello18/spotify-clone",
    featured: false,
  },
  {
    id: "14",
    title: "Expense balancer CLI",
    description:
      "Calculadora de gastos compartidos que divide equitativamente los gastos de viaje entre los miembros de un grupo.",
    images: [
      "/proyectos/expense-balancer-cli/result-cli.png",
      "/proyectos/expense-balancer-cli/test-cli.png",
    ],
    tags: ["TypeScript", "CLI", "Node.js"],
    link: "https://github.com/GandresCoello18/expense-balancer-cli",
    github: "https://github.com/GandresCoello18/expense-balancer-cli",
    isPrivate: false,
    featured: false,
    stats: [
      { label: "Calculos", value: "+5" },
      { label: "Imagenes", value: "4" },
    ],
  },
  {
    id: "2",
    title: "Chimborazo cerca del sol",
    description:
      "Este proyecto muestra de manera educativa por que a pesar de que el volcan Chimborazo ubicado en el Ecuador, no es el mas grande pero si el mas cercano al sol.",
    images: [
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-01.png",
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-02.png",
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-03.png",
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-04.png",
    ],
    tags: ["Svelte", "3D CSS", "HTML", "TypeScript", "Vercel"],
    link: "https://chimborazo-near-the-sun.vercel.app",
    github: "https://github.com/GandresCoello18/Chimborazo-near-the-sun",
    isPrivate: false,
    featured: false,
    stats: [
      { label: "Volcan", value: "1" },
      { label: "Imagenes", value: "6" },
      { label: "Videos", value: "6" },
    ],
  },
  {
    id: "4",
    title: "Collage Unsplash con Astro",
    description:
      "Collage de imagenes de Unsplash con Astro, permite a los usuarios ver las imagenes de Unsplash y agregarlas a un collage para luego descargarlo en el equipo local y almacenarlo en el navegador para su futura consulta.",
    images: [
      "/proyectos/unsplash-collage-astro/explore-collage-astro.png",
      "/proyectos/unsplash-collage-astro/generate-collage-astro.png",
      "/proyectos/unsplash-collage-astro/gallery-collage-astro.png",
    ],
    tags: ["Astro", "Island", "Vercel", "TypeScript", "Unsplash API"],
    link: "https://unsplash-collage-astro.vercel.app",
    github: "https://github.com/GandresCoello18/unsplash-collage-astro",
    isPrivate: false,
    featured: false,
    stats: [
      { label: "Api Unsplash", value: "1" },
      { label: "Imagenes", value: "4" },
    ],
  },
  {
    id: "5",
    title: "GG Tech panel publico",
    description:
      "Torneo de League of Legends organizado por GG Tech, permite a los usuarios ver el historial de partidos, estadisticas de los jugadores, y mas, ademas de poder inscribirte en los torneos como jugador individual o por equipo.",
    images: [
      "/proyectos/ggtech-panel-publico/ggtech-info-match.png",
      "/proyectos/ggtech-panel-publico/ggtech-bracket.png",
      "/proyectos/ggtech-panel-publico/ggtech-info-round.png",
      "/proyectos/ggtech-panel-publico/ggtech-info-tournament.png",
    ],
    tags: ["Meteor.js", "Blade", "Socket.io", "Api", "OAuth2", "MongoDB", "Redis"],
    link: "https://universityesportsna.riotgames.com/competition/tournament/clol-fall-warmup/stage/shurima-group-stage?group=651b79b996fd110d91b12460",
    featured: false,
  },
  {
    id: "6",
    title: "GG Tech panel admin",
    description:
      "Panel admin de GG Tech, gestiona los torneos, etapas, grupos, rondas y partidos ademas de los equipos, los jugadores, y mas.",
    images: [
      "/proyectos/ggtech-panel-admin/admin-ggtech-02.png",
      "/proyectos/ggtech-panel-admin/admin-ggtech-01.png",
      "/proyectos/ggtech-panel-admin/ggtech-admin-bracket.png",
      "/proyectos/ggtech-panel-admin/ggtech-admin-suizo.png",
    ],
    tags: ["Meteor.js", "Socket.io", "Api", "OAuth2", "MongoDB", "Redis"],
    link: "https://ggtech.gg/",
    featured: false,
  },
  {
    id: "8",
    title: "Dashboard Padel Track",
    description:
      "Dashboard interactivo para el seguimiento de partidos de padel, permite a los usuarios ver el historial de partidos, estadisticas de los jugadores, y mas, ademas de poder crear partidos jugadores y coach.",
    images: [
      "/proyectos/padel-track/padeltrack-public.png",
      "/proyectos/padel-track/videos-cuestionario.jpeg",
      "/proyectos/padel-track/unnamed (1).webp",
      "/proyectos/padel-track/unnamed (2).webp",
      "/proyectos/padel-track/unnamed (3).webp",
    ],
    tags: [
      "React",
      "Socket.io",
      "Express.js",
      "CI/CD",
      "MongoDB",
      "Chart.js",
      "Vimeo",
      "Monolito",
      "Arquitectura Modular",
    ],
    link: "https://admin.padeltrack.app/",
    github: "",
    isPrivate: true,
    featured: false,
    stats: [
      { label: "Partidos", value: "10k+" },
      { label: "Jugadores", value: "100+" },
      { label: "Coachs", value: "10+" },
    ],
  },
]

export function Projects() {
  const [showAll, setShowAll] = useState(false)
  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  const handleShowAll = () => {
    trackEvent(UmamiEvents.showAllProjects)
    setShowAll(true)
    setTimeout(() => {
      const projectsSection = document.getElementById("projects")
      if (projectsSection && otherProjects.length) {
        const additionalProjectsElement = projectsSection.querySelector(
          "[data-additional-projects]",
        )
        if (additionalProjectsElement) {
          additionalProjectsElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }, 100)
  }

  return (
    <section id="projects" className="bg-background px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="section-title">Proyectos Destacados</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Selección de proyectos en los que implementé soluciones innovadoras
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} featured projectIndex={index} />
          ))}
        </div>

        {!showAll && otherProjects.length > 0 ? (
          <div className="mt-16 text-center">
            <button
              type="button"
              onClick={handleShowAll}
              className="btn-primary inline-flex min-h-11 items-center gap-2"
            >
              Ver Todos los Proyectos
              <Code2 size={20} aria-hidden />
            </button>
          </div>
        ) : null}

        {showAll && otherProjects.length > 0 ? (
          <div data-additional-projects className="mt-16">
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                Otros Proyectos
              </h3>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Más proyectos en los que he trabajado
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  projectIndex={featuredProjects.length + index}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  featured = false,
  projectIndex,
}: {
  project: Project
  featured?: boolean
  projectIndex: number
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = project.images.length > 0 ? project.images : ["/placeholder.svg"]
  const currentSrc = images[currentImageIndex] ?? images[0]
  const fit = getProjectImageFit(currentSrc)
  const position = getProjectImagePosition(currentSrc)
  const { shown, extra } = visibleProjectTags(project.tags)
  const eager = shouldEagerLoadProjectImage(projectIndex, currentImageIndex)

  return (
    <article className="card-elevated flex h-full flex-col overflow-hidden motion-safe:transition-shadow">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={currentSrc}
          alt={getProjectImageAlt(project.title, currentSrc, currentImageIndex)}
          width={1600}
          height={1000}
          sizes={getProjectImageSizes(featured)}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          className={cn(
            "absolute inset-0 size-full",
            fit === "contain" ? "object-contain p-4" : "object-cover",
            position === "top" ? "object-top" : "object-center",
          )}
        />

        {images.length > 1 ? (
          <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
            {images.map((image, index) => (
              <button
                key={`${project.id}-dot-${image}`}
                type="button"
                aria-label={`Ver captura ${index + 1} de ${project.title}`}
                aria-current={index === currentImageIndex}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "size-3 rounded-full border border-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  index === currentImageIndex
                    ? "bg-primary"
                    : "bg-background/70 hover:bg-background",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="text-lg font-bold text-balance text-foreground md:text-xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
          {project.description}
        </p>

        {project.stats ? (
          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {project.stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <dt className="text-muted-foreground">{stat.label}</dt>
                <dd className="font-semibold text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {shown.map((tag) => (
            <span
              key={tag}
              className="rounded bg-accent/10 px-2 py-1 text-xs font-medium text-accent"
            >
              {tag}
            </span>
          ))}
          {extra > 0 ? (
            <span className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              +{extra}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <TrackedAnchor
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            event={UmamiEvents.projectDemo}
            eventData={{ project: project.title }}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Ver proyecto
            <ExternalLink size={16} aria-hidden />
          </TrackedAnchor>
          {project.github ? (
            <TrackedAnchor
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              event={UmamiEvents.projectGithub}
              eventData={{ project: project.title }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Código
              <Github size={16} aria-hidden />
            </TrackedAnchor>
          ) : null}
          {project.isPrivate ? (
            <span className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-muted-foreground">
              <Lock size={16} aria-hidden />
              Privado
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}
