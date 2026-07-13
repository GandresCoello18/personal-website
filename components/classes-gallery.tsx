'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const classesData = [
  {
    id: 1,
    title: 'Explorando y primeros pasos en Reat Native / Santiago 🇩🇴',
    description:
      'Aplicativo móbil para emergencias, y botón de pánico. Ligado a un servidor de Express y MySQL',
    image: '/experiencia/classgap/mentoria-react-native-firebase-rd.png',
  },
  {
    id: 2,
    title: 'Probando caracteristicas principales de React 🇪🇸',
    description:
      'Mostrando y explicando los superpoderes que tiene React y en que casos o escenarios se aplican.',
    image: '/experiencia/classgap/1743796086423.jpg',
  },
  {
    id: 3,
    title: 'Crud usando Express y MongoDB',
    description:
      'En esta ocasión me encontré con un 🇪🇨 compatriota ecuatoriano que reside en España, donde ayudamos a crear un CRUD basico con Express y MongoDB, documentar con swagger y desplegarlo en render.',
    image: '/experiencia/classgap/1747074307592.jpg',
  },
  {
    id: 4,
    title: 'Proyecto Landing #1 con HTML Y CSS',
    description: 'Pasos fundamentales para crear un landing page con HTML y CSS',
    image: '/experiencia/codings-academy/1750369336004.jpg',
  },
  {
    id: 5,
    title: 'Ejemplo de como validar e ingresar datos a MySql desde PHP v8',
    description:
      'Creamos una aplicación para el registro 🇦🇷 de estudiantes a clases con profesores de distintas materias.',
    image: '/experiencia/classgap/1750623706368.jpg',
  },
  {
    id: 6,
    title: 'Terminar Landing #2 con HTML, CSS3, animaciones y LOAD de JavaScript',
    description:
      'Ahora el proyecto tiene estilos y se ve mas profesional, además de tener un formulario de contacto funcional.',
    image: '/experiencia/codings-academy/1750477519988.jpg',
  },
  {
    id: 8,
    title: 'Usar swagger para guiarnos en las peticiones',
    description:
      'Como frontend developer en ocasiones no sabemos como está estructurado o que debería de recibir la API para su exitosa respuesta. Para ello nos guiaremos con Swagger',
    image: '/experiencia/codings-academy/1753638148472.jpg',
  },
  {
    id: 9,
    title: 'Implementar Monitoreo',
    description:
      'Parte del desarrollo de software es saber lo que está pasando con nuestro código y aplicación general en producción, así que implementamos Sentry para que haga el seguimiento del mismo.',
    image: '/experiencia/codings-academy/1754780006264.jpg',
  },
  {
    id: 7,
    title: 'Despligue con Vercel',
    description:
      'Finalmente, lanzamos nuestra aplicación web a producción y vimos todo lo que debemos tener en cuento en esta ambiente, ya es diferente al de desarrollo.',
    image: '/experiencia/codings-academy/1754780080756.jpg',
  },
  {
    id: 10,
    title: 'Instalar dependencias desde npm',
    description: 'Instalando y configurando Yup, React From Hook, React Boostrap, etc',
    image: '/experiencia/codings-academy/1752774909609.jpg',
  },
  {
    id: 11,
    title: 'Haciendo debuger en sitio web con Node + ejs',
    description:
      'Error con las rutas, explicando la diferencia entre la ruta del servidor (endpoint) y las rutas del cliente. 🇪🇦',
    image: '/experiencia/classgap/mentoria-react-js-espana.png',
  },
  {
    id: 12,
    title: 'Haciendo debuger con Nest js + cron',
    description:
      'Felipe necesita enviar una notificación por correo cuando ciertos usuarios se acercan a una fecha específica. Como está usando un ORM + PostgreSql tenemos un error de relación entre tablas.',
    image: '/experiencia/classgap/1756346816810.jpg',
  },
  {
    id: 14,
    title: 'Presentacion de IA Generativa',
    description:
      'En esta presentacion comparto mi experiencia como desarrollador y como use IA para crear productos y proyectos digitales para ayudar a los estudiantes a usarlo.',
    image: '/experiencia/crack-the-code/crack-the-code-002.png',
  }
]

export function ClassesGallery() {
  const [current, setCurrent] = useState(0)
  const slide = classesData[current]

  const next = () => {
    setCurrent((prev) => (prev + 1) % classesData.length)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + classesData.length) % classesData.length)
  }

  const goToSlide = (index: number) => {
    setCurrent(index)
  }

  return (
    <section className="bg-gradient-to-b from-background to-card/30 py-20" id="clases">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="section-title mb-4">Mis Clases en Acción</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Más de 5 años enseñando. Aquí puedes ver el tipo de contenido y metodología que utilizo en mis
            sesiones educativas
          </p>
        </div>

        <div className="relative">
          <div className="mx-auto w-full lg:w-[70%]">
            <div className="card-elevated overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-muted/40 sm:aspect-video">
                <Image
                  src={slide.image || '/placeholder.svg'}
                  alt={slide.title}
                  fill
                  className="object-contain p-2 sm:p-3"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  priority
                />
              </div>

              <div className="border-t border-border p-5 md:p-6">
                <h3 className="text-xl font-bold text-foreground md:text-2xl">{slide.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">{slide.description}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={prev}
                className="rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex gap-2">
                {classesData.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === current ? 'w-8 bg-primary' : 'w-2 bg-muted'
                    }`}
                    aria-label={`Ir a diapositiva ${index + 1}`}
                    aria-current={index === current ? 'true' : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                className="rounded-full bg-primary p-2 text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
                aria-label="Siguiente"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
