"use client"

import { Star, Award, Users, Clock } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { UmamiEvents } from "@/lib/umami"

export function ClassgapSection() {
  return (
    <section
      id="classgap"
      className="border-y border-border bg-background px-4 py-16 sm:px-6 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 space-y-4 md:mb-16">
          <p className="section-kicker">Classgap Verified Tutor</p>
          <h2 className="section-title">Clases particulares en Classgap</h2>
          <p className="section-subtitle max-w-2xl">
            Profesor verificado en Classgap, abr. 2023 – ago. 2026. Más de 160 clases de desarrollo
            web y móvil.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="card-elevated p-6">
            <div className="mb-3 flex items-center gap-3">
              <Clock className="size-5 text-foreground" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Experiencia
              </span>
            </div>
            <p className="font-mono text-3xl text-foreground">3+</p>
            <p className="text-sm text-muted-foreground">Años · abr. 2023 – ago. 2026</p>
          </div>

          <div className="card-elevated p-6">
            <div className="mb-3 flex items-center gap-3">
              <Star className="size-5 text-foreground" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Reseñas
              </span>
            </div>
            <p className="font-mono text-3xl text-foreground">17+</p>
            <p className="text-sm text-muted-foreground">Calificaciones 5 estrellas</p>
          </div>

          <div className="card-elevated p-6">
            <div className="mb-3 flex items-center gap-3">
              <Users className="size-5 text-foreground" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Estudiantes
              </span>
            </div>
            <p className="font-mono text-3xl text-foreground">160+</p>
            <p className="text-sm text-muted-foreground">Clases particulares</p>
          </div>

          <div className="card-elevated p-6">
            <div className="mb-3 flex items-center gap-3">
              <Award className="size-5 text-foreground" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Calificación
              </span>
            </div>
            <p className="font-mono text-3xl text-foreground">4.9/5</p>
            <p className="text-sm text-muted-foreground">Rating promedio</p>
          </div>
        </div>

        <div className="mb-8 grid items-start gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-2xl font-medium tracking-[-0.02em] text-foreground">
              Profesor verificado en Classgap
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Entre abr. 2023 y ago. 2026 impartí más de 160 clases particulares de desarrollo web
                y móvil. Diseñé planes según el objetivo de cada persona: proyectos reales,
                portafolio y presencia profesional.
              </p>
              <p>
                Mis estudiantes valoran mi capacidad para explicar conceptos complejos de forma
                clara, adaptarme a diferentes estilos de aprendizaje y proporcionar feedback
                constructivo que impulsa el crecimiento profesional.
              </p>
              <p className="border border-border p-4 text-sm">
                Las 17+ reseñas positivas reflejan mi compromiso con la excelencia educativa y la
                satisfacción del estudiante.
              </p>
            </div>
          </div>

          <div className="card-elevated p-8">
            <h4 className="mb-4 text-lg font-medium text-foreground">Áreas de Especialización</h4>
            <ul className="mb-6 space-y-3">
              {[
                "Desarrollo Web Full Stack",
                "React y Modern JavaScript",
                "Node y Servicios distribuidos",
                "Mentoría en Carrera Dev",
                "Proyectos Prácticos",
                "Consultoría Técnica",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 font-mono text-foreground" aria-hidden>
                    +
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <TrackedLink
              href="https://www.classgap.com/me/andres-coello-web-tech"
              target="_blank"
              rel="noopener noreferrer"
              event={UmamiEvents.classgapProfile}
              className="btn-primary w-full"
            >
              Ver Perfil en Classgap
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  )
}
