"use client"

import type React from "react"
import { Users, Zap, BookOpen } from "lucide-react"
import { trackEvent, UmamiEvents } from "@/lib/umami"

interface Service {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  price: string
  duration: string
}

const services: Service[] = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Mentoría 1-on-1",
    description:
      "Sesiones personalizadas para acelerar tu desarrollo profesional. Guía directa y retroalimentación.",
    features: [
      "Sesiones de 1 hora y 20 minutos personalizadas",
      "Revisión de código en vivo",
      "Ayuda en proyectos reales",
      "Acceso a recursos exclusivos",
    ],
    price: "$7.99",
    duration: "por sesión",
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Clases de programación",
    description:
      "Clases particulares de desarrollo web y backend: Node.js, TypeScript, APIs y proyectos de portafolio.",
    features: [
      "Plan según el objetivo de cada persona",
      "Depuración de APIs y rutas en vivo",
      "Proyectos reales para el portafolio",
      "160+ clases impartidas en Classgap",
    ],
    price: "$7.99",
    duration: "por sesión",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Consultoría Técnica",
    description:
      "Revisión de arquitectura, APIs y decisiones de backend para quien está construyendo o aprendiendo.",
    features: [
      "Lectura de código y APIs",
      "Diseño de arquitectura",
      "Buenas prácticas de backend",
      "Siguiente paso concreto",
    ],
    price: "Desde $9.99",
    duration: "por sesión",
  },
]

export function Services() {
  const handleServiceRequest = (serviceTitle: string, serviceDescription: string) => {
    trackEvent(UmamiEvents.serviceRequest, { service: serviceTitle })

    const params = new URLSearchParams({
      service: serviceTitle,
      description: serviceDescription,
    })

    window.location.assign(`/?${params.toString()}#contact`)
  }

  return (
    <section
      id="services"
      className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
            Servicios Profesionales
          </div>
          <h2 className="section-title">Mentoría y clases de programación</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Acompañamiento 1-on-1 para aprender backend y web, con proyectos reales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="card-elevated p-6 md:p-5 flex flex-col h-full hover:border-accent/50 transition-colors group"
            >
              <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:bg-accent/20 transition-colors">
                {service.icon}
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">{service.description}</p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-border">
                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                  <p className="text-sm text-muted-foreground">{service.duration}</p>
                </div>
                <button
                  onClick={() => handleServiceRequest(service.title, service.description)}
                  className="btn-primary w-full text-center"
                >
                  Solicitar Información
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-8 md:p-12">
          <h3 className="text-2xl font-bold mb-8 text-foreground">Preguntas Frecuentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-2 text-foreground">¿Dónde son las sesiones?</h4>
              <p className="text-muted-foreground">
                100% online por Google Meet o via Zoom. Puedes ser desde cualquier parte del mundo.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-foreground">¿Hay período de prueba?</h4>
              <p className="text-muted-foreground">
                Sí, primera sesión de consulta gratis para conocernos.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-foreground">¿Nivel requerido?</h4>
              <p className="text-muted-foreground">
                Desde principiantes hasta developers avanzados. Adapto el contenido.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-foreground">¿Seguimiento posterior?</h4>
              <p className="text-muted-foreground">
                Sí, recibes soporte técnico y mentoría posterior a la finalización del curso.
                También puedes contactarme para cualquier consulta o problema que tengas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
