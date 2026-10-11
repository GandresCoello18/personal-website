"use client"

import { Send, Calendar, MessageSquare } from "lucide-react"
import { ContactForm } from "./contact-form"
import { TrackedAnchor } from "@/components/tracked-link"
import { UmamiEvents } from "@/lib/umami"

export function CTA() {
  return (
    <section
      id="contact"
      className="border-t border-border bg-background px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 space-y-4">
          <h2 className="section-title">Conversemos Sobre tu Proyecto</h2>
          <p className="section-subtitle">
            Estoy disponible para nuevos proyectos, colaboraciones y oportunidades de mentoría.
            Contacta conmigo y empecemos.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <TrackedAnchor
            href="mailto:goyeselcoca@gmail.com"
            event={UmamiEvents.contactEmail}
            eventData={{ source: "contact" }}
            className="card-elevated p-6"
          >
            <Send size={20} className="mb-4 text-foreground" aria-hidden />
            <h3 className="mb-2 font-medium text-foreground">Email</h3>
            <p className="font-mono text-sm text-muted-foreground">goyeselcoca@gmail.com</p>
          </TrackedAnchor>

          <TrackedAnchor
            href="https://calendly.com/goyeselcoca/30min"
            event={UmamiEvents.contactCalendly}
            eventData={{ source: "contact" }}
            className="card-elevated p-6"
          >
            <Calendar size={20} className="mb-4 text-foreground" aria-hidden />
            <h3 className="mb-2 font-medium text-foreground">Agendar Llamada</h3>
            <p className="text-sm text-muted-foreground">Consulta gratuita de 30 min</p>
          </TrackedAnchor>

          <TrackedAnchor
            href="https://www.linkedin.com/in/andrescoellogoyes/"
            event={UmamiEvents.contactLinkedin}
            eventData={{ source: "contact" }}
            className="card-elevated p-6"
          >
            <MessageSquare size={20} className="mb-4 text-foreground" aria-hidden />
            <h3 className="mb-2 font-medium text-foreground">LinkedIn</h3>
            <p className="text-sm text-muted-foreground">Respuesta en poco tiempo</p>
          </TrackedAnchor>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}
