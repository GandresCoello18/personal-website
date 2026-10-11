import { ExperienceCard, type ExperienceItem } from "@/components/experience-card"

const experiences: ExperienceItem[] = [
  {
    id: "devlokos",
    logo: "/experiencia/devlokos/devlocos_logo.jpg",
    role: "Backend Engineer (AI & Odoo Integrations)",
    company: "DevLokos",
    period: "mar. 2026 – actualidad",
    description:
      "Clientes: Tayos (repuestos automotrices) y La Casa del Turbo. Diseñé un asistente con LLM (Gemini) y RAG sobre manuales, precios, marcas y catálogos, que responde en lenguaje natural consultas de compatibilidad que una búsqueda tradicional no resolvía. Integré Odoo como fuente única de verdad detrás de una API REST en Fastify y un BFF para la app móvil (React Native/Expo) y la web (Next.js). Publiqué la app en App Store y Google Play, con despliegues en Railway, Render y DigitalOcean.",
    images: [
      "/experiencia/devlokos/odoo-app.png",
      "/experiencia/devlokos/botca.jpg",
      "/experiencia/devlokos/padeltrack.jpg",
    ],
  },
  {
    id: "meniuz",
    logo: "/experiencia/meniuz/meniuz.jpeg",
    role: "Backend & DevOps Lead",
    company: "Meniuz",
    period: "abr. 2022 – actualidad · part-time",
    description:
      "SaaS para la industria gastronómica en Ecuador, iniciativa de Kevin Morales. Me sumé en la etapa inicial, en paralelo a mi trabajo principal, y lideré la evolución técnica de una web de menús a un SaaS con más de 500 establecimientos activos. Reduje un 60 % los tiempos de despliegue con CI/CD (Docker, GitHub) y un 25 % los costos de infraestructura. Diseñé búsqueda semántica con RAG (Gemini, Qdrant) y OCR de menús, un sistema de fidelización y un backoffice con RBAC.",
    images: [
      "/experiencia/meniuz/meniuz-equipo-almuerzo.png",
      "/experiencia/meniuz/meniuz-casa-abierta-armadas.png",
      "/experiencia/meniuz/meniuz-gdg-quito-cumbaya-2025.png",
      "/experiencia/meniuz/meniuz-emprelatam.png",
    ],
  },
  {
    id: "novacomp",
    logo: "/experiencia/novacomp/novacomp_logo.png",
    role: "Software Engineer II (Backend)",
    company: "Novacomp",
    period: "ene. 2026 – abr. 2026",
    description:
      "Plataforma de fidelización y recompensas para usuarios bancarios. Rediseñé el motor de segmentación de audiencias en tiempo real sobre un Data Lake en Amazon Athena. Contribuí a aumentar hasta un 30 % la retención con gamificación y recompensas personalizadas. Microservicios en NestJS con API REST, AWS Lambda y EventBridge; autenticación por roles con Amazon Cognito y JWT.",
    images: ["/experiencia/novacomp/REFACTOR-lambda.jpg"],
  },
  {
    id: "mims",
    logo: "/experiencia/mims/mims_tech_corp_logo.jpg",
    role: "Backend Engineer",
    company: "MIMS Tech",
    period: "sept. 2025 – nov. 2025",
    description:
      "Plataforma de notarización online en Estados Unidos. Entré como Backend Engineer y guié a un equipo de 4 developers en un SDK comercial publicado en NPM. Arquitectura multi-tenant con Row-Level Security en PostgreSQL, migración progresiva a microservicios en un monorepo NX con NATS, pagos con Stripe y servicios en AWS.",
    images: [],
  },
  {
    id: "ggtech",
    logo: "/experiencia/ggtech/ggtech.jpeg",
    role: "Full Stack Engineer",
    company: "GGTECH Entertainment",
    period: "abr. 2022 – mar. 2025",
    description:
      "Plataforma global de competiciones de esports con usuarios en América, Europa y Asia. Desarrollé motores de ranking y cuatro formatos de competición (entre ellos sistema suizo y round robin), lo que ayudó a aumentar un 30 % la participación. Optimicé torneos masivos en MongoDB y WebSockets, y reduje más de un 25 % las incidencias operativas.",
    images: ["/experiencia/ggtech/ggtech-equipo-reunion.png"],
  },
  {
    id: "ativar",
    logo: "/experiencia/ativar/ativar.jpeg",
    role: "Full Stack Developer",
    company: "ATIVAR",
    period: "may. 2021 – abr. 2022",
    description:
      "Consultoría en aplicaciones web y móviles multiplataforma: levantamiento de requerimientos con clientes y publicación en Play Store, App Store y AppGallery.",
    images: ["/experiencia/ativar/meet.jpg", "/experiencia/ativar/app-store.jpg"],
  },
  {
    id: "cooproclem",
    logo: "/experiencia/cooproclem/cooploclem.jpeg",
    role: "Mobile Application Developer",
    company: "COOPROCLEM",
    period: "oct. 2020 – mar. 2021",
    description:
      "Desarrollo móvil multiplataforma: infraestructura de red y envío de datos desde dispositivos hacia servidores administrativos.",
    images: ["/experiencia/cooproclem/dev-app-pd.jpg", "/experiencia/cooproclem/1682013285766.jpg"],
  },
  {
    id: "freelance",
    logo: "/experiencia/freelancer/me.jpg",
    role: "Desarrollador freelance",
    company: "Independiente",
    period: "2018 – 2020",
    description: "Dos años de proyectos web independientes, antes de los roles formales.",
    images: [],
  },
]

const teaching: ExperienceItem[] = [
  {
    id: "crack-the-code",
    logo: "/experiencia/crack-the-code/crack_the_code_per_logo.jpg",
    role: "Docente de IA y programación web",
    company: "Crack The Code",
    period: "feb. 2026 – oct. 2026 · parcial",
    description:
      "Enseño IA aplicada y el ciclo completo de desarrollo de software: cada grupo elige un emprendimiento local y lo convierte en un producto digital. Acompaño planificación, diseño, construcción, pruebas, despliegue y mejora continua. Prompt engineering y bitácoras de proyecto.",
    images: [
      "/experiencia/crack-the-code/crack-the-code-002.png",
      "/experiencia/crack-the-code/crack-the-code-003.png",
    ],
  },
  {
    id: "classgap",
    logo: "/experiencia/classgap/classgap_logo.jpg",
    role: "Profesor de clases particulares / Programación",
    company: "Classgap",
    period: "abr. 2023 – ago. 2026",
    description:
      "Impartí más de 160 clases particulares de desarrollo web y móvil a estudiantes y desarrolladores de distintos países. Planes de aprendizaje según el objetivo de cada persona: proyectos reales, portafolio y presencia profesional. Depuración de APIs en NestJS, rutas en Node.js y apps en Flutter.",
    images: [
      "/experiencia/classgap/mentoria-react-js-espana.png",
      "/experiencia/classgap/mentoria-react-native-firebase-rd.png",
      "/experiencia/classgap/1743796086423.jpg",
      "/experiencia/classgap/1747074307592.jpg",
      "/experiencia/classgap/1750623706368.jpg",
      "/experiencia/classgap/1756346816810.jpg",
      "/experiencia/classgap/1759533960547.jpg",
    ],
  },
  {
    id: "codings",
    logo: "/experiencia/codings-academy/codingsweb_logo.jpg",
    role: "Maestro de Frontend / React / Bootcamp",
    company: "Codings Academy",
    period: "jun. 2025 – oct. 2025 · parcial",
    description:
      "Enseñé a más de 40 estudiantes en clases grupales, de JavaScript a React, con metodología práctica orientada a portafolio. Introduje backend con Python y Flask, Swagger, autenticación, Git y despliegue en Vercel. Proyecto final: e-commerce en React conectado a una API en Flask.",
    images: [
      "/experiencia/codings-academy/clases-nocturnas-api-debug.png",
      "/experiencia/codings-academy/clases-nocturnas-react-debug.png",
      "/experiencia/codings-academy/1750369336004.jpg",
      "/experiencia/codings-academy/1750477519988.jpg",
      "/experiencia/codings-academy/1752774909609.jpg",
      "/experiencia/codings-academy/1753638148472.jpg",
      "/experiencia/codings-academy/1754780006264.jpg",
      "/experiencia/codings-academy/1754780080756.jpg",
    ],
  },
]

const educations: ExperienceItem[] = [
  {
    id: "codigo-facilito",
    role: "Ingeniería de software",
    company: "Código Facilito",
    period: "mar. 2025 – actualidad",
    description: "Formación continua en ingeniería de software y DevOps.",
  },
  {
    id: "platzi",
    logo: "/experiencia/educacion/platzi/platzi.jpeg",
    role: "Programación e ingeniería",
    company: "Platzi",
    period: "ene. 2019 – dic. 2025",
    description: "Cursos y carreras de programación, con certificaciones en AWS, DevOps e IA.",
    images: [],
  },
  {
    id: "istb",
    logo: "/experiencia/educacion/istb/ISTB-02-3.png",
    role: "Tecnólogo en desarrollo de software",
    company: "Tecnológico Superior Babahoyo",
    period: "mar. 2017 – nov. 2020",
    description: "Título de tercer nivel en desarrollo de software.",
    images: [],
  },
]

const skillGroups = [
  {
    title: "Backend",
    tone: "primary" as const,
    skills: ["Node.js", "TypeScript", "NestJS", "Express", "Fastify", "REST", "GraphQL", "Prisma"],
  },
  {
    title: "Datos",
    tone: "accent" as const,
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
  },
  {
    title: "Cloud e IA",
    tone: "secondary" as const,
    skills: ["AWS", "Docker", "CI/CD", "LLM", "RAG", "React", "Next.js", "React Native"],
  },
]

const toneClass = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  secondary: "bg-secondary/10 text-secondary",
}

const headingClass = {
  primary: "text-primary",
  accent: "text-accent",
  secondary: "text-secondary",
}

export function Experience() {
  return (
    <section id="experience" className="bg-muted/30 px-4 py-20 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Trayectoria
          </p>
          <h2 className="section-title">Experiencia</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Roles, fechas y resultados alineados con LinkedIn
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} item={exp} />
          ))}
        </div>

        <div className="my-16 space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Docencia</p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Enseñanza</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            Bootcamps, clases particulares y grupos. Fuera de los roles de producto.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2">
          {teaching.map((exp) => (
            <ExperienceCard key={exp.id} item={exp} />
          ))}
        </div>

        <div className="my-16 space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Formación</p>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Educación</h2>
          <p className="section-subtitle mx-auto max-w-2xl">Recorrido en línea y presencial</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2">
          {educations.map((exp) => (
            <ExperienceCard key={exp.id} item={exp} showGallery={false} />
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-16">
          <h3 className="mb-8 text-2xl font-bold text-foreground">Habilidades Técnicas</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.title} className="card-elevated p-6">
                <h4 className={`mb-4 text-lg font-bold ${headingClass[group.tone]}`}>
                  {group.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full px-3 py-1 text-sm ${toneClass[group.tone]}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
