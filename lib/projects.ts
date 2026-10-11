export type CompactProject = {
  title: string
  summary: string
  stack: string[]
  href: string
  github?: string
}

/** Proyectos que no tienen caso de estudio. Copy existente, recortado a una línea. */
export const COMPACT_PROJECTS: CompactProject[] = [
  {
    title: "Monitor de AI para comunidades",
    summary:
      "Convierte video de cámaras en información útil para una comunidad, sin reconocimiento facial.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Yolo"],
    href: "https://github.com/GandresCoello18/community-ai-monitor/tree/master",
    github: "https://github.com/GandresCoello18/community-ai-monitor/tree/master",
  },
  {
    title: "Image Intelligence Platform",
    summary: "Sube imágenes, extrae información y consulta el resultado más tarde.",
    stack: ["TypeScript", "Nx", "Redis", "MongoDB"],
    href: "https://github.com/GandresCoello18/image-intelligence-job",
    github: "https://github.com/GandresCoello18/image-intelligence-job",
  },
  {
    title: "Bob's Corn",
    summary: "API REST de compras de maíz con rate limiting e historial de transacciones.",
    stack: ["TypeScript", "Node.js", "Redis"],
    href: "https://github.com/GandresCoello18/Bob-s-Corn-API",
    github: "https://github.com/GandresCoello18/Bob-s-Corn-API",
  },
  {
    title: "Spotify Clone",
    summary: "Web para escuchar música y gestionar playlists contra la API de Spotify.",
    stack: ["Next.js", "TypeScript", "Spotify API"],
    href: "https://andres-coello-full-stack.vercel.app/",
    github: "https://github.com/GandresCoello18/spotify-clone",
  },
  {
    title: "Expense balancer CLI",
    summary: "Divide gastos de viaje entre los miembros de un grupo.",
    stack: ["TypeScript", "CLI", "Node.js"],
    href: "https://github.com/GandresCoello18/expense-balancer-cli",
    github: "https://github.com/GandresCoello18/expense-balancer-cli",
  },
  {
    title: "Chimborazo cerca del sol",
    summary: "Pieza educativa sobre por qué el Chimborazo es el punto más cercano al sol.",
    stack: ["Svelte", "TypeScript"],
    href: "https://chimborazo-near-the-sun.vercel.app",
    github: "https://github.com/GandresCoello18/Chimborazo-near-the-sun",
  },
  {
    title: "Collage Unsplash con Astro",
    summary: "Collage de imágenes de Unsplash que se puede descargar y guardar en el navegador.",
    stack: ["Astro", "TypeScript", "Unsplash API"],
    href: "https://unsplash-collage-astro.vercel.app",
    github: "https://github.com/GandresCoello18/unsplash-collage-astro",
  },
  {
    title: "GG Tech panel publico",
    summary: "Panel público de torneos de League of Legends: partidos, brackets e inscripciones.",
    stack: ["Meteor.js", "Socket.io", "MongoDB"],
    href: "https://universityesportsna.riotgames.com/competition/tournament/clol-fall-warmup/stage/shurima-group-stage?group=651b79b996fd110d91b12460",
  },
  {
    title: "GG Tech panel admin",
    summary: "Admin de torneos, etapas, grupos, equipos y jugadores.",
    stack: ["Meteor.js", "Socket.io", "MongoDB"],
    href: "https://ggtech.gg/",
  },
  {
    title: "Dashboard Padel Track",
    summary: "Dashboard de partidos de pádel, estadísticas, jugadores y coaches.",
    stack: ["React", "Express.js", "MongoDB"],
    href: "https://admin.padeltrack.app/",
  },
]
