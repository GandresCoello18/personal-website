import Image from 'next/image';

interface ExperienceItem {
  title: string
  company: string
  period: string
  description: string
  image: string
}

const experiences: ExperienceItem[] = [
  {
    image: "novacomp_logo.png",
    title: "Software Engineer ||",
    company: "Novacomp",
    period: "2026 - Presente",
    description: "Analizar y planificar las mejoras y sostenibilidad de la aplicación actual para soporte a gran escala con nivel horizontal y agregar gamaficacion estratégica en base a data lake y en la toma de desiciones con la recolección de datos",
  },
  {
    image: "meniuz.jpeg",
    title: "CTO / Tech Lead / SRE",
    company: "Meniuz",
    period: "2021 - Presente",
    description: "Crear infraestructura escalable para gestionar miles de restaurantes, cafeterías, heladerías y licorerías del Ecuador, ayudando al turista en la decisión gastronómica del lugar, esto incluye precio, ambiente, servicio en general y menú. Implementé pipelines de CI/CD use Docker, Redis y Qdrant, para obtener una busqueda avanzada por coincidencias mediante vectores y respuestas rapdias optimizadas. Mi rol de CTO me ayuda a liderar el equipo de desarrollo y en la toma de decisiones para la empresa con respecto a herramientas y tecnologias.",
  },
  {
    image: "mims_tech_corp_logo.jpg",
    title: "Semi-Senior Backend Developer",
    company: "MIMS Tech Corp",
    period: "2025 - 2025",
    description:
      "Lideré el desarrollo de un SDK orientado a facilitar la integración de múltiples servicios y funcionalidades mediante paquetes npm. Mi rol incluye la definición de la arquitectura, diseño de APIs internas, aseguramiento de calidad del código y aplicación de estándares de seguridad, incluyendo Row-Level Security (RLS) para el control granular de acceso a los datos. Además, colaboro estrechamente con equipos de producto y QA para garantizar la escalabilidad, mantenibilidad y cumplimiento de las mejores prácticas de desarrollo seguro en entornos modernos de distribución de software.",
  },
  {
    image: "classgap_logo.jpg",
    title: "Profesor de clases particulares / Programación",
    company: "Classgap",
    period: "2023 - Presente",
    description:
      "Guíe a estudiantes en la implementación de proyectos reales, fomentando buenas prácticas de programación, optimización de código y resolución de problemas. Impartí más de 150 clases (pagadas) personalizadas de desarrollo web y móvil a estudiantes de diversos niveles, adaptando los contenidos a sus necesidades y objetivos específicos.",
  },
  {
    image: "codingsweb_logo.jpg",
    title: "Maestro de Frontend Developer / React / Bootcamp",
    company: "Codings Academy",
    period: "2025-06 - 2022-09",
    description: "Entablé una relación directa entre tutor y estudiantes para guiarlos en el camino del front-end developer, no solo tratando temas de programación sino también, de diseño, rendimiento, tiempo de respuestas, resolviendo sus dudas en el transcurso de la clase, dejando tareas y pequeños proyectos para reforzar lo aprendido. Finalmente, realizamos deploy en vercel del proyecto ecomerce que con Front-end (JS React) y Api Rest (Python Flask)",
  },
  {
    image: "ggtech.jpeg",
    title: "Full Stack Developer",
    company: "GGTech Entertainment",
    period: "2022 - 2025",
    description:
      "Desarrollé y optimicé múltiples formatos de competición en la plataforma, mejorando la experiencia de usuario y aumentando la tasa de participación en un 30%, además de crear scripts para migración y actualización de bases de datos.  Analicé y optimicé el rendimiento de las aplicaciones, logrando una reducción del tiempo de carga en un 35% mediante mejoras en el manejo de sockets y optimización de consultas a la base de datos, implementando mejoras que resultaron en una reducción del tiempo de carga y una experiencia de usuario más fluida. Analicé y optimicé el rendimiento de las aplicaciones, implementando mejoras que resultaron en una reducción del tiempo de carga y una experiencia de usuario más fluida.",
  },
  {
    image: "logo-dgd-quito.png",
    title: "Mentor / Ponente / Charlas / Talleres",
    company: "Google Developer Group Quito",
    period: "2023 - 2025",
    description: "Como mentor, brindé orientación y apoyo técnico a estudiantes y desarrolladores interesados en tecnología. Como ponente, compartí mis conocimientos y experiencias en charlas y talleres, y como charlista, participé en eventos y comunidades tecnológicas para compartir mis conocimientos y experiencias. Me gusta conocer mas de cerca a la proxima generación de desarrolladores para ayudarlos a crecer en su carrera y en su vida personal.",
  },
  {
    image: "ativar.jpeg",
    title: "Full Stack Developer",
    company: "Ativar",
    period: "2021 - 2022",
    description: "Consultoría en desarrollo de aplicaciones web y móviles multiplataforma, incluyendo la interacción directa con clientes para la recopilación de requerimientos y especificaciones técnicas. Administración y subida de Aplicaciones móviles a tiendas como Play Store, Apple Store y AppGallery",
  },
  {
    image: "good-better.jpeg",
    title: "Full Stack Developer",
    company: "Good Better Best",
    period: "2020 - 2021",
    description: "Conectar y manejar API de YouTube para abstraer información de canales, perfiles, videos y meta datos de videos. Esto con el fin de verificar los pasos que se requiere en el modelo de negocio, como menciones, etiquetas o links en la descripción del video.",
  },
]

const educations: ExperienceItem[] = [
  {
    image: "platzi.jpeg",
    title: "Software Engineer (educación online)",
    company: "Platzi",
    period: "2018 - 2025",
    description: "Realicé cursos y carreras en el area de programación, diseño web, marketing digital, SEO, entre otros, para mejorar mis habilidades y conocimientos, y poder aplicarlos en mis proyectos y en la vida cotidiana.",
  },
  {
    image: "ISTB-02-3.png",
    title: "Tecnologo en Desarrollo de Software",
    company: "ISTB Babahoyo",
    period: "2018 - 2021",
    description: "Tecnologo en Desarrollo de Software, con especialización en Desarrollo de Aplicaciones Móviles y Desarrollo de Aplicaciones Web. Realicé cursos en programación, diseño web, marketing digital, SEO, entre otros, para mejorar mis habilidades y conocimientos, y poder aplicarlos en mis proyectos y en la vida cotidiana.",
  },
]

export function Experience() {
  return (
    <section id="experience" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="section-title">Experiencia</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Recorrido profesional combinando años de desarrollo y mentoría de talento
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {experiences.map((exp, idx) => (
            <div key={idx} className="card-elevated p-6 md:p-8 border-l-4 border-l-accent">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Image src={exp.image} alt={exp.title} width={48} height={48} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">{exp.title}</h3>
                      <p className="text-accent font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{exp.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center space-y-4 my-16">
          <h2 className="section-title">Educación</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Recorrido educatico en linea y presencial
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {educations.map((exp, idx) => (
            <div key={idx} className="card-elevated p-6 md:p-8 border-l-4 border-l-accent">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Image src={exp.image} alt={exp.title} width={48} height={48} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground">{exp.title}</h3>
                      <p className="text-accent font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{exp.period}</span>
                  </div>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-16 border-t border-border">
          <h3 className="text-2xl font-bold mb-8 text-foreground">Habilidades Técnicas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-elevated p-6">
              <h4 className="font-bold text-lg mb-4 text-primary">Frontend</h4>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "Redux", "Angular", "Svelte", "Blade", "Meteor.js", "TypeScript", "Tailwind CSS", "Vue.js", "Framer Motion"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-elevated p-6">
              <h4 className="font-bold text-lg mb-4 text-accent">Backend</h4>
              <div className="flex flex-wrap gap-2">
                {["Node.js", "Metero.js", "Fastify", "GraphQl", "Express", "Python", "PostgreSQL", "MySQL", "MongoDB", "Firebase"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card-elevated p-6">
              <h4 className="font-bold text-lg mb-4 text-secondary">DevOps & Cloud</h4>
              <div className="flex flex-wrap gap-2">
                {["AWS", "Docker", "Digital Ocean", "Railway", "Render", "Monolito", "Microservicios", "Git", "CI/CD", "Vercel", "Firebase"].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
