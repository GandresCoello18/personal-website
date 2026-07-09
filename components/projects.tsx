"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Lock, Code2 } from "lucide-react"

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
      "/proyectos/meniuz/apps-native.jpg",
      "/proyectos/meniuz/AWS-architecture-diagram-showing-the-final-cloud-image-1.png",
      "/proyectos/meniuz/list-business-app.png",
      "/proyectos/meniuz/landing.png",
      "/proyectos/meniuz/meniuz-list-cities.png",
    ],
    tags: ["Next.js", "TypeScript", "GraphQL", "Express.js", "CI/CD", "Redis", "Kotlin", "Swift", "Stripe", "MySQL", "TailwindCSS"],
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
    featured: true,
    stats: [
      { label: "Volcan", value: "1" },
      { label: "Imagenes", value: "6" },
      { label: "Videos", value: "6" },
    ],
  },
  {
    id: "3",
    title: "Image Intelligence Platform",
    description: "Plataforma de procesamiento de imagenes, permite a los usuarios subir imagenes y procesarlas o extraier informacion de ellas para luego almacenarlas en el sistema para su futura consulta.",
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
    featured: true,
  },
  {
    id: "4",
    title: "Collage Unsplash con Astro",
    description: "Collage de imagenes de Unsplash con Astro, permite a los usuarios ver las imagenes de Unsplash y agregarlas a un collage para luego descargarlo en el equipo local y almacenarlo en el navegador para su futura consulta.",
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
    description: "Panel admin de GG Tech, gestiona los torneos, etapas, grupos, rondas y partidos ademas de los equipos, los jugadores, y mas.",
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
      "/proyectos/padel-track/videos-cuestionario.jpeg",
      "/proyectos/padel-track/padeltrack-public.png",
      "/proyectos/padel-track/unnamed (1).webp",
      "/proyectos/padel-track/unnamed (2).webp",
      "/proyectos/padel-track/unnamed (3).webp",
    ],
    tags: ["React", "Socket.io", "Express.js", "CI/CD", "MongoDB", "Chart.js", "Vimeo", "Monolito", "Arquitectura Modular"],
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
    setShowAll(true)
    setTimeout(() => {
      const projectsSection = document.getElementById("projects")
      if (projectsSection && otherProjects.length) {
        const additionalProjectsElement = projectsSection.querySelector('[data-additional-projects]')
        if (additionalProjectsElement) {
          additionalProjectsElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    }, 100)
  }

  return (
    <section id="projects" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="section-title">Proyectos Destacados</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Selección de proyectos en los que implementé soluciones innovadoras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} featured />
          ))}
        </div>

        {!showAll && otherProjects.length && (
          <div className="text-center mt-16">
            <button
              onClick={handleShowAll}
              className="btn-primary inline-flex items-center gap-2"
            >
              Ver Todos los Proyectos
              <Code2 size={20} />
            </button>
          </div>
        )}

        {showAll && otherProjects.length && (
          <div data-additional-projects className="mt-16 space-y-8">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Otros Proyectos</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Más proyectos en los que he trabajado
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 space-y-4">
              {otherProjects.map((project) => (
                <div key={project.id} className="max-w-4xl mx-auto">
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const images = project.images && project.images.length > 0 ? project.images : ["/placeholder.svg"]

  useEffect(() => {
    if (images.length <= 1) return

    // Pre-cargar todas las imágenes
    images.forEach((image) => {
      const img = new Image()
      img.src = image
    })

    const interval = setInterval(() => {
      setIsTransitioning(true)
      
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
        setTimeout(() => {
          setIsTransitioning(false)
        }, 50)
      }, 400)
    }, 3000)

    return () => clearInterval(interval)
  }, [images])

  return (
    <div className="card-elevated overflow-hidden group hover:scale-105 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 md:h-64 overflow-hidden bg-muted">
        <div className="relative w-full h-full">
          {images.map((image, index) => {
            const isActive = index === currentImageIndex
            const isNext = index === (currentImageIndex + 1) % images.length
            
            return (
              <img
                key={`${project.id}-${index}`}
                src={image || "/placeholder.svg"}
                alt={`${project.title} - Imagen ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover ${
                  isActive
                    ? isTransitioning
                      ? "opacity-100 blur-md scale-105"
                      : "opacity-100 blur-0 scale-100"
                    : isNext && isTransitioning
                    ? "opacity-0 blur-md scale-105"
                    : "opacity-0 blur-0 scale-100"
                } group-hover:scale-110`}
                style={{
                  transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), filter 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1)",
                  zIndex: isActive ? 10 : isNext ? 5 : 1,
                }}
              />
            )
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground line-clamp-2">{project.title}</h3>
        <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3 flex-1">{project.description}</p>

        {project.stats && (
          <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-border">
            {project.stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-sm font-bold text-accent">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded font-medium">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            Ver Demo
            <ExternalLink size={16} />
          </a>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              Código
              <Github size={16} />
            </a>
          )}
          {project.isPrivate && (
            <span className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              Privado
              <Lock size={16} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
