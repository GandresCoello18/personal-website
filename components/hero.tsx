"use client"

import { ArrowRight, Github, Linkedin, Youtube, Mail, Download } from "lucide-react"
import { TrackedAnchor } from "@/components/tracked-link"
import { UmamiEvents } from "@/lib/umami"

export function Hero() {
  return (
    <section
      id="about"
      className="relative hero-gradient py-10 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-0" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-32 h-32 md:hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-2xl" />
                <img
                  src="/profile.jpeg"
                  alt="Andrés Coello — Backend Engineer"
                  className="relative w-full h-full rounded-full object-cover border-4 border-accent shadow-2xl"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="section-title">
                Andrés Coello
                <br />
                <span className="text-accent">Backend Engineer</span>
              </h1>
              <p className="section-subtitle">
                Ingeniero de software backend con 8+ años construyendo APIs y plataformas SaaS en
                Node.js/TypeScript sobre AWS. Diseño sistemas que escalan sin volverse una carga
                técnica para el equipo: multi-tenant, orientados a eventos y listos para producción.
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                Node.js · TypeScript · NestJS · PostgreSQL · AWS · LLM/RAG
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <TrackedAnchor
                href="#projects"
                event={UmamiEvents.viewProjects}
                eventData={{ source: "hero" }}
                className="btn-primary flex items-center justify-center gap-1 group"
              >
                Ver Proyectos
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </TrackedAnchor>
              <TrackedAnchor
                href="/pdf/Andres_Coello_Goyes_full_stack_developer_2026.pdf"
                download
                event={UmamiEvents.downloadCv}
                eventData={{ source: "hero" }}
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-1"
              >
                Descargar CV
                <Download size={20} />
              </TrackedAnchor>
            </div>

            <div className="flex gap-4 pt-4">
              <TrackedAnchor
                href="https://github.com/GandresCoello18"
                event={UmamiEvents.socialClick}
                eventData={{ network: "github", source: "hero" }}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
                title="GitHub"
              >
                <Github size={20} className="text-muted-foreground hover:text-foreground" />
              </TrackedAnchor>
              <TrackedAnchor
                href="https://www.linkedin.com/in/andrescoellogoyes/"
                event={UmamiEvents.socialClick}
                eventData={{ network: "linkedin", source: "hero" }}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={20} className="text-muted-foreground hover:text-foreground" />
              </TrackedAnchor>
              <TrackedAnchor
                href="mailto:goyeselcoca@gmail.com"
                event={UmamiEvents.contactEmail}
                eventData={{ source: "hero" }}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
                title="Email"
              >
                <Mail size={20} className="text-muted-foreground hover:text-foreground" />
              </TrackedAnchor>
              <TrackedAnchor
                href="https://www.youtube.com/@andrescoellogoyes"
                event={UmamiEvents.socialClick}
                eventData={{ network: "youtube", source: "hero" }}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
                title="Youtube"
              >
                <Youtube size={20} className="text-muted-foreground hover:text-foreground" />
              </TrackedAnchor>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center gap-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl w-80 h-80" />
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full" />
                <img
                  src="/profile.jpeg"
                  alt="Andrés Coello — Backend Engineer"
                  className="relative w-full h-full rounded-full object-cover border-4 border-accent shadow-2xl"
                />
              </div>
            </div>

            <div className="bg-white/90 dark:bg-slate-950/90 backdrop-blur rounded-full px-6 py-3 shadow-lg">
              <p className="text-sm font-semibold text-foreground">Backend Engineer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
