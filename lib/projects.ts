export type SiteProject = {
  id: string
  title: string
  summary: string
  stack: string[]
  images: string[]
  featured: boolean
  continuous: boolean
  sortYear: number
  caseSlug?: string
  href?: string
  github?: string
}

/**
 * Catálogo de la home. Las imágenes son las que cada ficha tenía antes del
 * rediseño de tarjetas, más assets del mismo directorio que ya estaban en
 * `public/proyectos`.
 */
export const SITE_PROJECTS: SiteProject[] = [
  {
    id: "tayos",
    title: "Tayos",
    summary: "Asistente LLM + RAG de compatibilidad de autopartes, con Odoo como fuente de verdad.",
    stack: ["TypeScript", "Fastify", "Odoo", "Gemini", "RAG", "Next.js", "React Native"],
    images: ["/proyectos/odoo-app/odoo-app.png", "/proyectos/odoo-app/odoo-app-02.png"],
    featured: true,
    continuous: true,
    sortYear: 2026,
    caseSlug: "tayos",
    href: "https://apps.apple.com/ec/app/tayos/id6776895287",
  },
  {
    id: "meniuz",
    title: "Meniuz",
    summary: "SaaS multi-tenant para restaurantes en Ecuador, con 500+ establecimientos.",
    stack: ["TypeScript", "Express", "GraphQL", "MySQL", "Redis", "Docker", "AWS", "Next.js"],
    images: [
      "/proyectos/meniuz/apps-native.jpg",
      "/proyectos/meniuz/AWS-architecture-diagram-showing-the-final-cloud-image-1.png",
      "/proyectos/meniuz/list-business-app.png",
      "/proyectos/meniuz/landing.png",
      "/proyectos/meniuz/meniuz-list-cities.png",
      "/proyectos/meniuz/view-menu-web.png",
    ],
    featured: true,
    continuous: true,
    sortYear: 2026,
    caseSlug: "meniuz",
    href: "https://onelink.to/meniuz",
  },
  {
    id: "community-ai-monitor",
    title: "Monitor de AI para comunidades",
    summary:
      "Convierte video de cámaras en información útil para una comunidad, sin reconocimiento facial.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Yolo", "Docker"],
    images: [
      "/proyectos/community-ai-monitor/monitor-park.png",
      "/proyectos/community-ai-monitor/diagram-fluj.png",
    ],
    featured: true,
    continuous: false,
    sortYear: 2026,
    href: "https://github.com/GandresCoello18/community-ai-monitor/tree/master",
    github: "https://github.com/GandresCoello18/community-ai-monitor/tree/master",
  },
  {
    id: "order-lifecycle",
    title: "Order Lifecycle Platform",
    summary: "Microservicios orientados a eventos para el ciclo de vida de una orden.",
    stack: ["NestJS", "TypeScript", "NX", "Redis", "BullMQ", "PostgreSQL", "Docker"],
    images: ["/proyectos/order-lifecycle-platform/diagram.png"],
    featured: false,
    continuous: false,
    sortYear: 2026,
    caseSlug: "order-lifecycle",
    github: "https://github.com/GandresCoello18/order-lifecycle-platform",
  },
  {
    id: "padel-track",
    title: "Dashboard Padel Track",
    summary: "Dashboard de partidos de pádel, estadísticas, jugadores y coaches.",
    stack: ["React", "Express.js", "MongoDB"],
    images: [
      "/proyectos/padel-track/videos-cuestionario.jpeg",
      "/proyectos/padel-track/padeltrack-public.png",
      "/proyectos/padel-track/unnamed (1).webp",
      "/proyectos/padel-track/unnamed (2).webp",
      "/proyectos/padel-track/unnamed (3).webp",
    ],
    featured: false,
    continuous: false,
    sortYear: 2026,
    href: "https://admin.padeltrack.app/",
  },
  {
    id: "image-intelligence",
    title: "Image Intelligence Platform",
    summary: "Sube imágenes, extrae información y consulta el resultado más tarde.",
    stack: ["TypeScript", "Nx", "Redis", "MongoDB"],
    images: [
      "/proyectos/image-intelligence-platform/image-process-inteligent.png",
      "/proyectos/image-intelligence-platform/diagram.png",
    ],
    featured: false,
    continuous: false,
    sortYear: 2025,
    href: "https://github.com/GandresCoello18/image-intelligence-job",
    github: "https://github.com/GandresCoello18/image-intelligence-job",
  },
  {
    id: "bobs-corn",
    title: "Bob's Corn",
    summary: "API REST de compras de maíz con rate limiting e historial de transacciones.",
    stack: ["TypeScript", "Node.js", "Redis"],
    images: ["/proyectos/bob-s-corn/client.png", "/proyectos/bob-s-corn/diagram.jpeg"],
    featured: false,
    continuous: false,
    sortYear: 2025,
    href: "https://github.com/GandresCoello18/Bob-s-Corn-API",
    github: "https://github.com/GandresCoello18/Bob-s-Corn-API",
  },
  {
    id: "expense-cli",
    title: "Expense balancer CLI",
    summary: "Divide gastos de viaje entre los miembros de un grupo.",
    stack: ["TypeScript", "CLI", "Node.js"],
    images: [
      "/proyectos/expense-balancer-cli/result-cli.png",
      "/proyectos/expense-balancer-cli/test-cli.png",
    ],
    featured: false,
    continuous: false,
    sortYear: 2025,
    href: "https://github.com/GandresCoello18/expense-balancer-cli",
    github: "https://github.com/GandresCoello18/expense-balancer-cli",
  },
  {
    id: "unsplash-collage",
    title: "Collage Unsplash con Astro",
    summary: "Collage de imágenes de Unsplash que se puede descargar y guardar en el navegador.",
    stack: ["Astro", "TypeScript", "Unsplash API"],
    images: [
      "/proyectos/unsplash-collage-astro/explore-collage-astro.png",
      "/proyectos/unsplash-collage-astro/generate-collage-astro.png",
      "/proyectos/unsplash-collage-astro/gallery-collage-astro.png",
    ],
    featured: false,
    continuous: false,
    sortYear: 2025,
    href: "https://unsplash-collage-astro.vercel.app",
    github: "https://github.com/GandresCoello18/unsplash-collage-astro",
  },
  {
    id: "chimborazo",
    title: "Chimborazo cerca del sol",
    summary: "Pieza educativa sobre por qué el Chimborazo es el punto más cercano al sol.",
    stack: ["Svelte", "TypeScript"],
    images: [
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-01.png",
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-02.png",
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-03.png",
      "/proyectos/chimborazo-cerca-del-sol/chimborazo-04.png",
    ],
    featured: false,
    continuous: false,
    sortYear: 2024,
    href: "https://chimborazo-near-the-sun.vercel.app",
    github: "https://github.com/GandresCoello18/Chimborazo-near-the-sun",
  },
  {
    id: "spotify-clone",
    title: "Spotify Clone",
    summary: "Web para escuchar música y gestionar playlists contra la API de Spotify.",
    stack: ["Next.js", "TypeScript", "Spotify API"],
    images: [
      "/proyectos/spotify-clone/spotify-clone-app.png",
      "/proyectos/spotify-clone/1756679537331.jpg",
    ],
    featured: false,
    continuous: false,
    sortYear: 2024,
    href: "https://andres-coello-full-stack.vercel.app/",
    github: "https://github.com/GandresCoello18/spotify-clone",
  },
  {
    id: "ggtech-public",
    title: "GG Tech panel publico",
    summary: "Panel público de torneos de League of Legends: partidos, brackets e inscripciones.",
    stack: ["Meteor.js", "Socket.io", "MongoDB"],
    images: [
      "/proyectos/ggtech-panel-publico/ggtech-info-match.png",
      "/proyectos/ggtech-panel-publico/ggtech-bracket.png",
      "/proyectos/ggtech-panel-publico/ggtech-info-round.png",
      "/proyectos/ggtech-panel-publico/ggtech-info-tournament.png",
    ],
    featured: false,
    continuous: false,
    sortYear: 2024,
    href: "https://universityesportsna.riotgames.com/competition/tournament/clol-fall-warmup/stage/shurima-group-stage?group=651b79b996fd110d91b12460",
  },
  {
    id: "ggtech-admin",
    title: "GG Tech panel admin",
    summary: "Admin de torneos, etapas, grupos, equipos y jugadores.",
    stack: ["Meteor.js", "Socket.io", "MongoDB"],
    images: [
      "/proyectos/ggtech-panel-admin/admin-ggtech-02.png",
      "/proyectos/ggtech-panel-admin/admin-ggtech-01.png",
      "/proyectos/ggtech-panel-admin/ggtech-admin-bracket.png",
      "/proyectos/ggtech-panel-admin/ggtech-admin-suizo.png",
    ],
    featured: false,
    continuous: false,
    sortYear: 2024,
    href: "https://ggtech.gg/",
  },
]

function compareProjects(a: SiteProject, b: SiteProject): number {
  if (a.continuous !== b.continuous) return a.continuous ? -1 : 1
  if (a.sortYear !== b.sortYear) return b.sortYear - a.sortYear
  return 0
}

export function getFeaturedProjects(): SiteProject[] {
  return SITE_PROJECTS.filter((item) => item.featured).toSorted(compareProjects)
}

export function getCompactProjects(): SiteProject[] {
  return SITE_PROJECTS.filter((item) => !item.featured).toSorted(compareProjects)
}

export type ProjectNavLink = {
  kind: "case" | "github" | "site"
  href: string
  label: string
  external: boolean
}

export function getProjectNavLinks(project: SiteProject): ProjectNavLink[] {
  const links: ProjectNavLink[] = []
  if (project.caseSlug) {
    links.push({
      kind: "case",
      href: `/proyectos/${project.caseSlug}`,
      label: "Ver caso",
      external: false,
    })
  }
  if (project.github) {
    links.push({
      kind: "github",
      href: project.github,
      label: "GitHub",
      external: true,
    })
  }
  if (project.href && project.href !== project.github) {
    links.push({
      kind: "site",
      href: project.href,
      label: "Sitio",
      external: true,
    })
  }
  return links
}
