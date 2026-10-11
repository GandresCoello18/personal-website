"use client"

import Image from "next/image"
import { ArrowRight, Github, Linkedin, Youtube, Mail, Download } from "lucide-react"
import { BlueprintFrame } from "@/components/blueprint-frame"
import { SignatureDiagram } from "@/components/signature-diagram"
import { TrackedAnchor } from "@/components/tracked-link"
import { UmamiEvents } from "@/lib/umami"

const SOCIAL = [
  {
    href: "https://github.com/GandresCoello18",
    label: "GitHub",
    event: UmamiEvents.socialClick,
    data: { network: "github", source: "hero" },
    Icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/andrescoellogoyes/",
    label: "LinkedIn",
    event: UmamiEvents.socialClick,
    data: { network: "linkedin", source: "hero" },
    Icon: Linkedin,
  },
  {
    href: "mailto:goyeselcoca@gmail.com",
    label: "Email",
    event: UmamiEvents.contactEmail,
    data: { source: "hero" },
    Icon: Mail,
  },
  {
    href: "https://www.youtube.com/@andrescoellogoyes",
    label: "Youtube",
    event: UmamiEvents.socialClick,
    data: { network: "youtube", source: "hero" },
    Icon: Youtube,
  },
] as const

export function Hero() {
  return (
    <section
      id="about"
      className="blueprint-grid relative overflow-hidden px-4 py-16 sm:px-6 md:py-24 lg:px-8"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <BlueprintFrame className="mx-auto w-28 overflow-hidden bg-card md:hidden">
              <Image
                src="/profile.jpeg"
                alt="Andrés Coello — Backend Engineer"
                width={224}
                height={224}
                className="aspect-square size-full object-cover object-top"
                priority
              />
            </BlueprintFrame>

            <div className="space-y-4">
              <h1 className="section-title">
                Andrés Coello
                <br />
                <span className="font-medium text-foreground">Backend Engineer</span>
              </h1>
              <p className="section-subtitle max-w-xl">
                Ingeniero de software backend con 8+ años construyendo APIs y plataformas SaaS en
                Node.js/TypeScript sobre AWS. Diseño sistemas que escalan sin volverse una carga
                técnica para el equipo: multi-tenant, orientados a eventos y listos para producción.
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Node.js · TypeScript · NestJS · PostgreSQL · AWS · LLM/RAG
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <TrackedAnchor
                href="#projects"
                event={UmamiEvents.viewProjects}
                eventData={{ source: "hero" }}
                className="btn-primary"
              >
                Ver Proyectos
                <ArrowRight size={18} aria-hidden />
              </TrackedAnchor>
              <TrackedAnchor
                href="/pdf/Andres_Coello_Goyes_full_stack_developer_2026.pdf"
                download
                event={UmamiEvents.downloadCv}
                eventData={{ source: "hero" }}
                className="btn-secondary"
              >
                Descargar CV
                <Download size={18} aria-hidden />
              </TrackedAnchor>
            </div>

            <div className="flex gap-2">
              {SOCIAL.map(({ href, label, event, data, Icon }) => (
                <TrackedAnchor
                  key={label}
                  href={href}
                  event={event}
                  eventData={data}
                  className="inline-flex size-11 items-center justify-center border border-border text-muted-foreground hover:border-accent hover:text-foreground"
                  title={label}
                >
                  <Icon size={18} aria-hidden />
                  <span className="sr-only">{label}</span>
                </TrackedAnchor>
              ))}
            </div>
          </div>

          <div className="hidden min-w-0 flex-col gap-6 lg:flex">
            <BlueprintFrame className="bg-background/40 p-5 text-accent">
              <SignatureDiagram className="h-auto w-full" />
            </BlueprintFrame>
            <BlueprintFrame className="mx-auto w-44 overflow-hidden">
              <Image
                src="/profile.jpeg"
                alt="Andrés Coello — Backend Engineer"
                width={176}
                height={176}
                className="aspect-square size-full object-cover object-top"
                priority
              />
            </BlueprintFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
