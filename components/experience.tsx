import { ExperienceCard, type ExperienceItem } from "@/components/experience-card"



const experiences: ExperienceItem[] = [

  {

    id: "crack-the-code",

    logo: "/experiencia/crack-the-code/crack_the_code_per_logo.jpg",

    role: "Docente de IA & Programación Web",

    company: "Crack The Code",

    period: "03/2026 - 07/2026",

    featured: false,

    description:

      "Guío el ciclo completo de desarrollo de software en la práctica: los equipos eligen un emprendimiento local y lo transforman en un producto digital de alto impacto, desde planeación y diseño hasta construcción, pruebas, despliegue y mejoras continuas con feedback real de usuarios. Uso ejemplos de empresas reconocidas para enseñar IA aplicada, arquitectura y entrega iterativa con estándares profesionales.",

    images: [

      "/experiencia/crack-the-code/crack-the-code-001.png",

      "/experiencia/crack-the-code/crack-the-code-002.png",
      "/experiencia/crack-the-code/crack-the-code-003.png",

    ],

  },

  {

    id: "novacomp",

    logo: "/experiencia/novacomp/novacomp_logo.png",

    role: "Software Engineer Ss",

    company: "Novacomp",
    featured: false,

    period: "01/2026 - 04/2026",

    description:

      "Diseñé y escalé el motor tecnológico de una plataforma de gamificación y fidelización para el sector bancario. Transformé el procesamiento masivo de datos en estrategias de retención en tiempo real, garantizando estabilidad bajo exigencia transaccional. Desarrollé el núcleo que orquesta campañas promocionales complejas con entrega de recompensas financieras personalizadas (cashback), impactando retención, engagement y experiencia del usuario bancario.",

    images: [
      "/experiencia/novacomp/app_web_zigi.png",
      "/experiencia/novacomp/REFACTOR-lambda.jpg",
    ],

  },

  {

    id: "meniuz",

    logo: "/experiencia/meniuz/meniuz.jpeg",

    role: "CTO / Backend Systems Architect / SRE",

    company: "Meniuz",

    period: "2021 - 2026 (Autonomo)",

    featured: false,

    description:

      "Lidero la plataforma que conecta miles de restaurantes, cafeterías, heladerías y licorerías en Ecuador con decisiones gastronómicas informadas (precio, ambiente, servicio y menú). Implementé pipelines CI/CD, Docker, Redis y Qdrant para búsqueda vectorial y respuestas optimizadas. Como CTO dirijo al equipo de desarrollo, defino la estrategia tecnológica y lidero la modernización arquitectónica con migración a AWS para escalar con alta disponibilidad y eficiencia operativa.",

    images: [

      "/experiencia/meniuz/meniuz-equipo-almuerzo.png",

      "/experiencia/meniuz/meniuz-casa-abierta-armadas.png",

      "/experiencia/meniuz/meniuz-gdg-quito-cumbaya-2025.png",

      "/experiencia/meniuz/meniuz-emprelatam.png",

    ],

  },

  {

    id: "classgap",

    logo: "/experiencia/classgap/classgap_logo.jpg",

    role: "Profesor de clases particulares / Programación",

    company: "Classgap",

    period: "2023 - 2026 (Autonomo)",
    featured: false,

    description:

      "Como consultor técnico y mentor, capacito a desarrolladores internacionalmente en productos web y móviles reales. Mi enfoque va más allá del código: formo criterio de ingeniería senior, buenas prácticas, optimización y resolución de problemas escalables. Diseño planes de acción personalizados según el nivel y objetivos de cada estudiante.",

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

    id: "mims",

    logo: "/experiencia/mims/mims_tech_corp_logo.jpg",

    role: "Semi-Senior Backend Developer",

    company: "MIMS Tech Corp",

    period: "2025 - 2025",

    description:

      "Dirigí el diseño arquitectónico y el desarrollo de un SDK comercial para LegalTech, liderando ingeniería en software distribuido con seguridad extrema y escalabilidad B2B. Implementé arquitectura multi-tenant con Row-Level Security (RLS) para aislamiento de datos confidenciales. Aceleré integraciones con paquetes NPM y APIs internas, impulsando migración a monorepo para mejorar mantenibilidad del código base.",

    images: [],

  },

  {

    id: "codings",

    logo: "/experiencia/codings-academy/codingsweb_logo.jpg",

    role: "Maestro de Frontend Developer / React / Bootcamp",

    company: "Codings Academy",

    period: "2022-09 - 2025-06",
    featured: false,

    description:

      "Guié a estudiantes en el camino del frontend developer: programación, diseño, rendimiento y tiempos de respuesta. Resolví dudas en vivo, asigné proyectos prácticos y cerramos con deploy en Vercel de un e-commerce con React y API REST en Python Flask.",

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

  {

    id: "dev lokos",

    logo: "/experiencia/devlokos/devlocos_logo.jpg",

    role: "Full Stack (Freelance)",

    company: "Dev Lokos",

    period: "2023-09 - 2026 (Autonomo)",
    featured: false,

    description:

      "Desarrollo de aplicaciones web y móviles a la medida, con enfoque en la creación de soluciones tecnológicas personalizadas para satisfacer las necesidades específicas de cada cliente. Monitoreo y mantenimiento de aplicaciones web y móviles como parte de garantia de calidad y atención.",

    images: [

      "/experiencia/devlokos/botca.jpg",
      "/experiencia/devlokos/padeltrack.jpg",
    ],

  },

  {

    id: "gdg-quito",

    logo: "/experiencia/gdg-quito/logo-dgd-quito.png",

    role: "Mentor / Ponente / Charlas / Talleres",

    company: "Google Developer Group Quito",

    period: "2023 - 2025",
    featured: false,

    description:

      "Mentoría técnica, charlas y talleres para la comunidad. Comparto experiencia en productos reales, arquitectura y buenas prácticas, acompañando a la próxima generación de desarrolladores en eventos y espacios de la comunidad tech.",

    images: [

      "/experiencia/gdg-quito/conf-quito-cumbaya-2.jpeg",

      "/experiencia/gdg-quito/1764597984863.jpg",

      "/experiencia/gdg-quito/build-with-ia-2026.jpeg",

    ],

  },

  {

    id: "ggtech",

    logo: "/experiencia/ggtech/ggtech.jpeg",

    role: "Full Stack Developer",

    company: "GGTech Entertainment",
    featured: false,

    period: "2022 - 2025",

    description:

      "Desarrollé y optimicé formatos de competición en la plataforma, mejorando la experiencia de usuario y aumentando la participación en un 30%. Creé scripts de migración y actualización de bases de datos. Optimicé rendimiento con sockets y consultas, reduciendo tiempos de carga en un 35%.",

    images: ["/experiencia/ggtech/ggtech-equipo-reunion.png"],

  },

  {

    id: "ativar",

    logo: "/experiencia/ativar/ativar.jpeg",

    role: "Full Stack Developer",

    company: "Ativar",

    period: "2021 - 2022",
    featured: false,

    description:

      "Consultoría en aplicaciones web y móviles multiplataforma, recopilación de requerimientos con clientes y publicación en Play Store, App Store y AppGallery. Implementación de pruebas automatizadas para asegurar la calidad del software.",

    images: [
      "/experiencia/ativar/meet.jpg",
      "/experiencia/ativar/app-store.jpg",
    ],

  },

  {

    id: "cooproclem",

    logo: "/experiencia/cooproclem/cooploclem.jpeg",

    role: "Mobile Developer (Practicas)",

    company: "cooproclem",

    period: "2021 - 2022",
    featured: false,

    description:

      "Desarrollo de una apicación móvil multiplataforma para la gestión de parte diario, procesos y tareas repetitivas de cultivos en fincas de banana, de manera offline se toman notas y reportes, en oficina con internet se descargan estos reportes.",

    images: [
      "/experiencia/cooproclem/dev-app-pd.jpg",
      "/experiencia/cooproclem/1682013285766.jpg",
    ],

  },

  {

    id: "gbb",

    logo: "/experiencia/good-better-best/good-better.jpeg",

    role: "Full Stack Developer",

    company: "Good Better Best",

    period: "2020 - 2021",

    description:

      "Integré la API de YouTube para extraer información de canales, perfiles y videos, validando menciones, etiquetas y enlaces según el modelo de negocio del producto, plataforma web monetizada para vender el tiempo o menciones de yotubers mexicanos reconocidos",

    images: [],

  },

  {

    id: "frelance andres",

    logo: "/experiencia/freelancer/me.jpg",

    role: "Full Stack Developer (Frelance)",
    featured: false,

    company: "Servicios independientes",

    period: "2018 - 2020",

    description:

      "Integré la API de YouTube para extraer información de canales, perfiles y videos, validando menciones, etiquetas y enlaces según el modelo de negocio del producto.",

    images: [
      "/experiencia/freelancer/mi-primer-setup.jpg",
      "/experiencia/freelancer/libro-negro-programador.png",
      "/experiencia/freelancer/dom-js.jpg",
      "/experiencia/freelancer/repaso-stack.jpg",
    ],

  },

]



const educations: ExperienceItem[] = [

  {

    id: "platzi",

    logo: "/experiencia/educacion/platzi/platzi.jpeg",

    role: "Software Engineer (educación online)",

    company: "Platzi",

    period: "2018 - 2025",

    description:

      "Carreras y cursos en programación, diseño web, marketing digital y SEO aplicados a proyectos reales y crecimiento profesional continuo.",

    images: [],

  },

  {

    id: "istb",

    logo: "/experiencia/educacion/istb/ISTB-02-3.png",

    role: "Tecnólogo en Desarrollo de Software",

    company: "ISTB Babahoyo",

    period: "2018 - 2021",

    description:

      "Formación en desarrollo de software con especialización en aplicaciones móviles y web, complementada con práctica en proyectos y fundamentos de ingeniería.",

    images: [],

  },

]



export function Experience() {

  return (

    <section id="experience" className="bg-muted/30 px-4 py-20 sm:px-6 md:py-32 lg:px-8">

      <div className="mx-auto max-w-6xl">

        <div className="mb-16 space-y-4 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Trayectoria</p>

          <h2 className="section-title">Experiencia</h2>

          <p className="section-subtitle mx-auto max-w-2xl">

            Impacto técnico, liderazgo de producto y evolución profesional en empresas y proyectos reales

          </p>

        </div>



        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2">

          {experiences.map((exp) => (

            <ExperienceCard key={exp.id} item={exp} />

          ))}

        </div>



        <div className="my-16 space-y-4 text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Formación</p>

          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Educación</h2>

          <p className="section-subtitle mx-auto max-w-2xl">Recorrido educativo en línea y presencial</p>

        </div>



        <div className="grid grid-cols-1 items-start gap-6 md:gap-8 lg:grid-cols-2">

          {educations.map((exp) => (

            <ExperienceCard key={exp.id} item={exp} showGallery={false} />

          ))}

        </div>



        <div className="mt-16 border-t border-border pt-16">

          <h3 className="mb-8 text-2xl font-bold text-foreground">Habilidades Técnicas</h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">

            <div className="card-elevated p-6">

              <h4 className="mb-4 text-lg font-bold text-primary">Frontend</h4>

              <div className="flex flex-wrap gap-2">

                {["React", "Next.js", "Redux", "Angular", "Svelte", "TypeScript", "Tailwind CSS", "Vue.js"].map(

                  (skill) => (

                    <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">

                      {skill}

                    </span>

                  ),

                )}

              </div>

            </div>



            <div className="card-elevated p-6">

              <h4 className="mb-4 text-lg font-bold text-accent">Backend</h4>

              <div className="flex flex-wrap gap-2">

                {["Node.js", "GraphQL", "Express", "Python", "PostgreSQL", "MySQL", "MongoDB", "Redis"].map(

                  (skill) => (

                    <span key={skill} className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent">

                      {skill}

                    </span>

                  ),

                )}

              </div>

            </div>



            <div className="card-elevated p-6">

              <h4 className="mb-4 text-lg font-bold text-secondary">DevOps & Cloud</h4>

              <div className="flex flex-wrap gap-2">

                {["AWS", "Docker", "CI/CD", "Vercel", "Git", "Microservicios", "Monorepo"].map((skill) => (

                  <span key={skill} className="rounded-full bg-secondary/10 px-3 py-1 text-sm text-secondary">

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


