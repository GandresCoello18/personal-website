"use client"

import { useEffect, useState } from "react"
import { ExternalLink, MapPin, Users } from "lucide-react"

import { cn } from "@/lib/utils"

export interface Talk {
  id: string
  title: string
  subtitle: string
  location: string
  attendees?: string
  images: string[]
  tags: string[]
  badges: string[]
  url?: string
}

const talks: Talk[] = [
  {
    id: "1",
    title: "Introducción a la programacion web",
    subtitle: "Historia de la web y como se desarrollo hasta llegar a lo que es hoy en dia, consejos para proximos proyectos y conseguir tu primer trabajo en el mundo TECH.",
    location: "ESPOL · Guayaquil, Ecuador",
    attendees: "Comunidad",
    images: ["/charla-espol.jpg"],
    tags: ["Web", "Programacion", "Historia", "Trabajo Remoto"],
    badges: ["Charla", "Ecuador"],
    url: "https://www.linkedin.com/in/andrescoellogoyes/",
  },
  {
    id: "2",
    title: "¿Que es, como funciona y cuando usar Meteor js?",
    subtitle: "Meteor js es un framework para desarrollar aplicaciones web y móviles, es un framework full stack que permite desarrollar aplicaciones web y móviles de manera rapida y sencilla.",
    location: "Quito Cumbayá · DevFest 2025 Ecuador",
    attendees: "120+ asistentes",
    images: ["/1764597973595.jpg"],
    tags: ["Meteor js", "Framework", "Full Stack", "Web"],
    badges: ["Charla", "Ecuador", "DevFest 2025"],
  },
  {
    id: "3",
    title: "DevTools más allá de la consola",
    subtitle: "Herramientas para depurar y perfilar en el navegador con sentido, deja de usar console.logp para todo y haz debugger como un profesional.",
    location: "Quito Cumbayá · DevFest 2023 Ecuador",
    attendees: "60 asistentes",
    images: ["/conf-quito-cumbaya.jpg"],
    tags: ["Chrome", "DevTools", "Web"],
    badges: ["Workshop", "Ecuador", "DevFest 2023"],
  },
  {
    id: "4",
    title: "Comunidad GDG Ecuador 2026",
    subtitle: "Comunidad GDG Ecuador 2023, charlas, talleres, proyectos, y mas, una comunidad que busca crecer juntos y aprender mas de la tecnologia.",
    location: "Quito Cumbayá · GDG Ecuador 2023",
    attendees: "Comunidad",
    images: ["/1764597984863.jpg"],
    tags: ["GDG", "Comunidad", "Ecuador"],
    badges: ["Charla", "Ecuador", "GDG Ecuador 2025"],
  },
  {
    id: "5",
    title: "JavaScript es Rock pero TypeScript es Jazz",
    subtitle: "TypeScript es un super poder que te permite programar con mas seguridad y confianza, ademas de que es mas facil de entender y leer para otros desarrolladores.",
    location: "Santo Domingo de los Tsachilas · GDG Ecuador 2025",
    attendees: "Comunidad",
    images: ["/1748913774221.jpg"],
    tags: ["GDG", "Comunidad", "Ecuador"],
    badges: ["Charla", "Ecuador", "Santo Domingo de los Tsachilas"],
  },
  {
    id: "6",
    title: "Aprender React js y no morir en el intento",
    subtitle: "Aprender React js y no morir en el intento, consejos para empezar a programar y no desistir. Ademas de agregar SSR a tu proyecto con Next.js.",
    location: "Codings Academy · Guayaquil, Ecuador",
    attendees: "Comunidad",
    images: ["/charla-codings.jpg"],
    tags: ["React js", "Next.js", "SSR"],
    badges: ["Charla", "Ecuador", "Codings Academy"],
  },
  {
    id: "7",
    title: "Live en Platzi",
    subtitle: "Como es trabajar para la industria de la tecnologia y en lo Sports para el continente europeo",
    location: "Bogotá · Platzi",
    attendees: "En vivo",
    images: ["/andres-coello-live-platzi.png"],
    tags: ["Platzi", "Live", "Ecuador"],
    badges: ["Live", "Ecuador", "Platzi"],
  }
]

function TalkCard({ talk }: { talk: Talk }) {
  const [index, setIndex] = useState(0)
  const [transition, setTransition] = useState(false)
  const slides = talk.images.length ? talk.images : ["/crack-the-code-001.png"]

  useEffect(() => {
    if (slides.length <= 1) return
    slides.forEach((src) => {
      const img = new Image()
      img.src = src
    })
    const t = setInterval(() => {
      setTransition(true)
      setTimeout(() => {
        setIndex((i) => (i + 1) % slides.length)
        setTimeout(() => setTransition(false), 50)
      }, 400)
    }, 4000)
    return () => clearInterval(t)
  }, [slides.length])

  const cardClass = cn(
    "card-elevated relative flex h-full flex-col overflow-hidden text-left transition-all duration-300",
    talk.url && "cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:border-accent/50 group",
  )

  return (
    <article className={cardClass} aria-labelledby={`talk-title-${talk.id}`}>
      {talk.url ? (
        <a
          href={talk.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-[1] rounded-[inherit]"
          aria-label={`${talk.title}: abrir enlace en nueva pestaña`}
        />
      ) : null}

      <div
        className={cn(
          "relative z-[2] flex min-h-0 flex-1 flex-col",
          talk.url && "pointer-events-none",
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
            {talk.badges.map((b) => (
              <span
                key={b}
                className="rounded-full bg-background/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground shadow-sm backdrop-blur-sm"
              >
                {b}
              </span>
            ))}
          </div>
          {talk.url ? (
            <span className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-1.5 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors group-hover:text-accent">
              <ExternalLink className="size-3.5" aria-hidden />
            </span>
          ) : null}

          <div className="relative size-full">
            {slides.map((src, i) => {
              const active = i === index
              const next = i === (index + 1) % slides.length
              return (
                <img
                  key={`${talk.id}-${i}`}
                  src={src}
                  alt=""
                  className={cn(
                    "absolute inset-0 size-full object-cover transition-all duration-500",
                    active
                      ? transition
                        ? "opacity-100 blur-sm scale-105"
                        : "opacity-100 blur-0 scale-100"
                      : next && transition
                        ? "opacity-0 blur-sm scale-105"
                        : "opacity-0 scale-100",
                  )}
                  style={{ zIndex: active ? 10 : next ? 5 : 1 }}
                />
              )
            })}
          </div>

          {slides.length > 1 ? (
            <div
              className={cn(
                "absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5",
                talk.url && "pointer-events-auto",
              )}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "size-1.5 rounded-full shadow-sm transition-all",
                    i === index ? "w-4 bg-white" : "bg-white/55 hover:bg-white/85",
                  )}
                  aria-label={`Ver imagen ${i + 1} de ${slides.length}`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 id={`talk-title-${talk.id}`} className="text-lg font-bold leading-snug text-foreground">
              {talk.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-accent">{talk.subtitle}</p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent/80" aria-hidden />
              <span>{talk.location}</span>
            </p>
            {talk.attendees ? (
              <p className="flex items-center gap-2">
                <Users className="size-4 shrink-0 text-accent/80" aria-hidden />
                <span>{talk.attendees}</span>
              </p>
            ) : null}
          </div>

          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-4">
            {talk.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium text-foreground/90">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export function TalksSection() {
  return (
    <section
      id="talks"
      className="border-y border-border bg-muted/30 py-20 md:py-32 px-4 sm:px-6 lg:px-8"
      aria-labelledby="talks-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Charlas</p>
          <h2 id="talks-heading" className="section-title">
            Conferencias
          </h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Charlas en conferencias y meetups centradas en desarrollo de Software, apps móviles, IA, herramientas modernas y en llevar
            productos sólidos a producción.
          </p>
          <p className="text-sm font-medium text-accent">{talks.length} charlas destacadas</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {talks.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>
      </div>
    </section>
  )
}
