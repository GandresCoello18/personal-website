"use client"

import { Star, Award, Users, Clock } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { UmamiEvents } from "@/lib/umami"

export function ClassgapSection() {
  return (
    <section
      id="classgap"
      className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Classgap Verified Tutor</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 text-balance">
            5+ Años de Experiencia Comprobada
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Tutor y mentor verificado en Classgap con una trayectoria sólida ayudando a cientos de estudiantes a alcanzar sus
            objetivos en desarrollo web y programación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Experiencia</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">5+</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Años en la plataforma</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Reseñas</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">17+</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calificaciones 5 estrellas</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Estudiantes</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">150+</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Alumnos mentorados</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Calificación</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">4.9/5</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rating promedio</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Tutor y mentor Experimentado Certificado
            </h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-300">
              <p>
                Con más de 5 años activo en Classgap, he establecido una reputación sólida como mentor confiable y
                efectivo. Mi experiencia abarca desde tutorías intensivas hasta mentoría estratégica a largo plazo.
              </p>
              <p>
                Mis estudiantes valoran mi capacidad para explicar conceptos complejos de forma clara, adaptarme a
                diferentes estilos de aprendizaje y proporcionar feedback constructivo que impulsa el crecimiento
                profesional.
              </p>
              <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                Las 17+ reseñas positivas reflejan mi compromiso con la excelencia educativa y la satisfacción del
                estudiante.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Áreas de Especialización</h4>
            <ul className="space-y-3 mb-6">
              {[
                "Desarrollo Web Full Stack",
                "React y Modern JavaScript",
                "Node y Servicios distribuidos",
                "Mentoría en Carrera Dev",
                "Proyectos Prácticos",
                "Consultoría Técnica",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-teal-500 dark:text-teal-400 font-bold mt-1">✓</span>
                  <span className="text-slate-700 dark:text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
            <TrackedLink
              href="https://www.classgap.com/me/andres-coello-web-tech"
              target="_blank"
              rel="noopener noreferrer"
              event={UmamiEvents.classgapProfile}
              className="w-full inline-block text-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
            >
              Ver Perfil en Classgap →
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  )
}
