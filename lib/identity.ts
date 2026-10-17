export const PERSON_NAME = "Andrés Coello Goyes"
export const PERSON_SHORT_NAME = "Andrés Coello"
export const PERSON_GIVEN_NAME = "Andrés"
export const PERSON_FAMILY_NAME = "Coello Goyes"
export const PERSON_ALTERNATE_NAMES = [
  "Andrés Coello",
  "Andres Coello Goyes",
  "Andrés Roberto Coello Goyes",
] as const
export const PERSON_JOB_TITLE = "Backend Software Engineer"
export const PERSON_JOB_TITLE_SHORT = "Backend Engineer"
export const PERSON_WORKS_FOR = "DevLokos"
export const PERSON_LOCALITY = "Ambato"
export const PERSON_COUNTRY_CODE = "EC"
export const PERSON_COUNTRY_NAME = "Ecuador"
export const PERSON_ALUMNI_OF = "Tecnológico Superior Babahoyo"
export const PERSON_KNOWS_LANGUAGE = "es"

export const PERSON_SAME_AS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/andrescoellogoyes/" },
  { label: "GitHub", href: "https://github.com/GandresCoello18" },
  { label: "YouTube", href: "https://www.youtube.com/@andrescoellogoyes" },
  { label: "Classgap", href: "https://www.classgap.com/me/andres-coello-web-tech" },
  { label: "X", href: "https://x.com/acoellogoyes" },
] as const

export const CV_PDF_PATH = "/pdf/Andres_Coello_Goyes_full_stack_developer_2026.pdf"

export const SITE_TITLE_DEFAULT = `${PERSON_NAME} — ${PERSON_JOB_TITLE_SHORT}`
export const SITE_TITLE_TEMPLATE = `%s | ${PERSON_NAME}`
export const SITE_DESCRIPTION = `${PERSON_NAME}, ${PERSON_JOB_TITLE} en Ecuador. APIs y SaaS en Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.`
export const PERSON_SCHEMA_DESCRIPTION = `${PERSON_JOB_TITLE_SHORT}. APIs y plataformas SaaS en Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.`

export const PERSON_KNOWS_ABOUT = [
  "Node.js",
  "TypeScript",
  "NestJS",
  "PostgreSQL",
  "AWS",
  "LLM",
  "RAG",
  "Express",
  "Fastify",
  "Prisma",
] as const
