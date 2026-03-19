'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const classesData = [
  {
    id: 16,
    title: 'Staff y Speakers / DevFest Ecuador 2025',
    description: 'El DevFest 2025 fue una experiencia increible, me encanto poder ser parte de este evento y poder compartir mis conocimientos con la comunidad.',
    image: '1764597984863.jpg',
  },
  {
    id: 17,
    title: 'Conferencia en Quito Cumbaya / DevFest Ecuador 2025',
    description: 'En este espacio compartie mi experiencia como desarrollador en el mundo deportivo electronico y como estar abierto a nuevas herramientas como tecnologias y frameworks.',
    image: '1764597973595.jpg',
  },
  {
    id: 18,
    title: 'Conferencia en Quito Cumbaya / DevFest Ecuador 2023',
    description: 'DevTools es mas que usar la consola de Chrome, hay mas herramientas que podemos usar para mejorar nuestro desarrollo.',
    image: 'conf-quito-cumbaya.jpg',
  },
  {
    id: 14,
    title: 'Conferencia en Quito Cumbaya / DevFest Ecuador 2023',
    description: 'DevTools es mas que usar la consola de Chrome, hay mas herramientas que podemos usar para mejorar nuestro desarrollo.',
    image: 'conf-quito-cumbaya.jpg',
  },
  {
    id: 15,
    title: 'Conferencia en Quito Cumbaya / DevFest Ecuador 2023',
    description: 'DevTools es mas que usar la consola de Chrome, hay mas herramientas que podemos usar para mejorar nuestro desarrollo.',
    image: 'conf-quito-cumbaya-2.jpeg',
  },
  {
    id: 1,
    title: 'Explorando y primeros pasos en Reat Native / Santiago 🇩🇴',
    description: 'Aplicativo móbil para emergencias, y botón de pánico. Ligado a un servidor de Express y MySQL',
    image: '1742833863032.jpg',
  },
  {
    id: 2,
    title: 'Probando caracteristicas principales de React 🇪🇸',
    description: 'Mostrando y explicando los superpoderes que tiene React y en que casos o escenarios se aplican.',
    image: '1743796086423.jpg',
  },
  {
    id: 3,
    title: 'Crud usando Express y MongoDB',
    description: 'En esta ocasión me encontré con un 🇪🇨 compatriota ecuatoriano que reside en España, donde ayudamos a crear un CRUD basico con Express y MongoDB, documentar con swagger y desplegarlo en render.',
    image: '1747074307592.jpg',
  },
  {
    id: 4,
    title: 'Proyecto Landing #1 con HTML Y CSS',
    description: 'Pasos fundamentales para crear un landing page con HTML y CSS',
    image: '1750369336004.jpg',
  },
  {
    id: 5,
    title: 'Ejemplo de como validar e ingresar datos a MySql desde PHP v8',
    description: 'Creamos una aplicación para el registro 🇦🇷 de estudiantes a clases con profesores de distintas materias.',
    image: '1750623706368.jpg',
  },
  {
    id: 6,
    title: 'Terminar Landing #2 con HTML, CSS3, animaciones y LOAD de JavaScript',
    description: 'Ahora el proyecto tiene estilos y se ve mas profesional, además de tener un formulario de contacto funcional.',
    image: '1750477519988.jpg',
  },
  {
    id: 8,
    title: 'Usar swagger para guiarnos en las peticiones',
    description: 'Como frontend developer en ocasiones no sabemos como está estructurado o que debería de recibir la API para su exitosa respuesta. Para ello nos guiaremos con Swagger',
    image: '1753638148472.jpg',
  },
  {
    id: 9,
    title: 'Implementar Monitoreo',
    description: 'Parte del desarrollo de software es saber lo que está pasando con nuestro código y aplicación general en producción, así que implementamos Sentry para que haga el seguimiento del mismo.',
    image: '1754780006264.jpg',
  },
  {
    id: 7,
    title: 'Despligue con Vercel',
    description: 'Finalmente, lanzamos nuestra aplicación web a producción y vimos todo lo que debemos tener en cuento en esta ambiente, ya es diferente al de desarrollo.',
    image: '1754780080756.jpg',
  },
  {
    id: 10,
    title: 'Instalar dependencias desde npm',
    description: 'Instalando y configurando Yup, React From Hook, React Boostrap, etc',
    image: '1752774909609.jpg',
  },
  {
    id: 11,
    title: 'Haciendo debuger en sitio web con Node + ejs',
    description: 'Error con las rutas, explicando la diferencia entre la ruta del servidor (endpoint) y las rutas del cliente. 🇪🇦',
    image: '1755110235282.jpg',
  },
  {
    id: 12,
    title: 'Haciendo debuger con Nest js + cron',
    description: 'Felipe necesita enviar una notificación por correo cuando ciertos usuarios se acercan a una fecha específica. Como está usando un ORM + PostgreSql tenemos un error de relación entre tablas.',
    image: '1756346816810.jpg',
  },
  {
    id: 13,
    title: 'Live de Platzi',
    description: 'En esta charla comparto mi experiencia como entre a trabajar como desarrollador en el mundo del Esport, explicando lo que tuve que hacer para poder entrar al mercado de trabajo.',
    image: 'andres-coello-live-platzi.png',
  },
  {
    id: 14,
    title: 'Presentacion de IA Generativa',
    description: 'En esta presentacion comparto mi experiencia como desarrollador y como use IA para crear productos y proyectos digitales para ayudar a los estudiantes a usarlo.',
    image: 'crack-the-code-002.png',
  },
  {
    id: 15,
    title: 'Conociendo a los estudiantes de 10 grado',
    description: 'En esta clase conoci a los estudiantes de 10 grado y les explique como era el proceso de como entrar al mundo del desarrollo web y como era el proceso de como entrar al mundo del desarrollo web.',
    image: 'crack-the-code-001.png',
  },
]

export function ClassesGallery() {
  const [current, setCurrent] = useState(0)

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
    <section className="py-20 bg-gradient-to-b from-background to-card/30" id="clases">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">Mis Clases en Acción</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Más de 5 años enseñando. Aquí puedes ver el tipo de contenido y metodología que utilizo en mis sesiones educativas
          </p>
        </div>

        <div className="relative">
          <div className="w-full sm:w-full lg:w-[70%] mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-2xl aspect-video bg-muted">
              <Image
                src={classesData[current].image || "/placeholder.svg"}
                alt={classesData[current].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{classesData[current].title}</h3>
                <p className="text-sm md:text-base text-gray-100">{classesData[current].description}</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 px-2">
              <button
                onClick={prev}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex gap-2">
                {classesData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === current ? 'bg-primary w-8' : 'bg-muted w-2'
                    }`}
                    aria-label={`Ir a diapositiva ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
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
