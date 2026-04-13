"use client"

import type React from "react"
import { Users, BookOpen, Zap, Video, Globe, Smartphone, Monitor } from "lucide-react"

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
  /*{
    icon: <BookOpen className="w-8 h-8" />,
    title: "Cursos Intensivos",
    description: "Bootcamps especializados en tecnologías modernas. Aprende haciendo con proyectos reales.",
    features: [
      "Programa de 4-10 semanas",
      "25+ horas de contenido",
      "Proyectos prácticos incluidos",
      "Parte de mentoría incluida",
    ],
    price: "$199-$299",
    duration: "por curso",
  },*/
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Consultoría Técnica",
    description: "Análisis y optimización de proyectos, arquitectura de software y estrategia técnica.",
    features: [
      "Auditoría de código",
      "Diseño de arquitectura",
      "Optimización de performance",
      "Estrategia tecnológica",
    ],
    price: "Desde $9.99",
    duration: "por sesión",
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Workshops Grupales",
    description: "Sesiones de grupo sobre temas específicos. Perfecto para equipos y comunidades.",
    features: ["Sesiones interactivas", "10-30 participantes", "Q&A en tiempo real", "Materiales descargables"],
    price: "Contactar",
    duration: "flexible",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Desarrollo Web",
    description: "Aplicaciones web modernas y escalables. Proyectos a largo plazo o freelance con acompañamiento completo.",
    features: [
      "Aplicaciones web full-stack",
      "Arquitectura escalable",
      "Acompañamiento durante todo el proyecto",
      "Soporte y mantenimiento",
    ],
    price: "Contactar",
    duration: "proyecto",
  },
  {
    icon: <Monitor className="w-8 h-8" />,
    title: "Desarrollo Móvil Multiplataforma",
    description: "Aplicaciones móviles multiplataforma para iOS y Android. Una sola base de código, múltiples plataformas.",
    features: [
      "React Native / Flutter",
      "iOS y Android simultáneamente",
      "Acompañamiento técnico completo",
      "Deploy y publicación",
    ],
    price: "Contactar",
    duration: "proyecto",
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Desarrollo Móvil Nativo",
    description: "Aplicaciones nativas para iOS (Swift) y Android (Kotlin). Máximo rendimiento y experiencia de usuario.",
    features: [
      "iOS nativo (Swift)",
      "Android nativo (Kotlin)",
      "Optimización de performance",
      "Acompañamiento especializado",
    ],
    price: "Contactar",
    duration: "proyecto",
  },
  /*{
    icon: <Code2 className="w-8 h-8" />,
    title: "Code Review Profundo",
    description: "Revisión detallada de tu código con recomendaciones específicas y mejoras implementadas.",
    features: [
      "Análisis exhaustivo del código",
      "Reporte de 10-20 páginas",
      "Videoconferencia de feedback",
      "Plan de mejora personalizado",
    ],
    price: "$150",
    duration: "por repositorio",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Programa de Pasantía",
    description: "Programa de 3 meses trabajando en proyectos reales con mentoría intensiva.",
    features: ["Proyectos reales", "Mentoría diaria", "Portfolio building", "Oportunidad laboral"],
    price: "Gratis",
    duration: "o oportunidad laboral",
  },*/
]

export function Services() {
  const handleServiceRequest = (serviceTitle: string, serviceDescription: string) => {
    const params = new URLSearchParams({
      service: serviceTitle,
      description: serviceDescription,
    })
    
    // Actualizar la URL con los query params y luego hacer scroll al formulario
    const newUrl = `${window.location.pathname}?${params.toString()}#contact`
    window.history.pushState({}, "", newUrl)
    
    // Disparar evento personalizado para que ContactForm detecte el cambio
    window.dispatchEvent(new CustomEvent("urlChanged", { detail: { service: serviceTitle, description: serviceDescription } }))
    
    // Hacer scroll al formulario de contacto
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section id="services" className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
            Servicios Profesionales
          </div>
          <h2 className="section-title">Impulsemos tu Carrera y Proyectos</h2>
          <p className="section-subtitle max-w-3xl mx-auto">
            Acceso a mentoría, cursos, consultoría y desarrollo de software. Diseñado para acelerar tu crecimiento profesional y llevar tus ideas al siguiente nivel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
              <p className="text-muted-foreground">100% online por Google Meet o via Zoom. Puedes ser desde cualquier parte del mundo.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-foreground">¿Hay período de prueba?</h4>
              <p className="text-muted-foreground">Sí, primera sesión de consulta gratis para conocernos.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-foreground">¿Nivel requerido?</h4>
              <p className="text-muted-foreground">
                Desde principiantes hasta developers avanzados. Adapto el contenido.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 text-foreground">¿Seguimiento posterior?</h4>
              <p className="text-muted-foreground">Sí, recibes soporte técnico y mentoría posterior a la finalización del curso. También puedes contactarme para cualquier consulta o problema que tengas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
