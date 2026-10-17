import { PERSON_NAME } from "./identity.ts"

export const ABOUT_PARAGRAPHS = [
  `${PERSON_NAME} es ingeniero de software backend. Vive en Ambato, Ecuador. Lleva más de ocho años construyendo APIs y plataformas SaaS con Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.`,
  "Trabaja en DevLokos como Backend Engineer desde marzo de 2026. Ahí desarrolla sistemas para Tayos, Importadora Sacón y La Casa del Turbo. Desde abril de 2022 es, en paralelo y a tiempo parcial, Backend y DevOps Lead de Meniuz, un SaaS para la gastronomía en Ecuador, con más de 500 establecimientos activos.",
  "Antes pasó por Novacomp, MIMS Tech, GGTECH Entertainment, ATIVAR y COOPROCLEM, y trabajó como freelance entre 2018 y 2020.",
  "Se formó como tecnólogo en desarrollo de software en el Tecnológico Superior Babahoyo, entre marzo de 2017 y noviembre de 2020. Desde 2017 se forma en línea de forma continua, en Platzi y otras plataformas, hasta hoy.",
  "Da clases de programación: más de 160 clases particulares en Classgap, además de Crack The Code y Codings Academy. Ha dado charlas en DevFest de Google Developer Groups, TsáchiTalks, IEEE ESPOL, la Universidad Estatal de Milagro y Platzi Live.",
] as const

export const ABOUT_FACTS = [
  { term: "Vive", detail: "Ambato, Ecuador" },
  { term: "Rol", detail: "Backend Software Engineer" },
  { term: "Trabaja en", detail: "DevLokos (mar. 2026 – actualidad)" },
  { term: "Meniuz", detail: "Backend y DevOps Lead, part-time (abr. 2022 – actualidad)" },
  {
    term: "Estudió",
    detail: "Tecnólogo en desarrollo de software, Tecnológico Superior Babahoyo (2017–2020)",
  },
  { term: "Docencia", detail: "Classgap (más de 160 clases), Crack The Code y Codings Academy" },
  {
    term: "Charlas",
    detail: "DevFest GDG, TsáchiTalks, IEEE ESPOL, Universidad Estatal de Milagro y Platzi Live",
  },
] as const

export const PLATZI_CERTIFICATIONS = [
  { name: "Curso de Introducción a los Patrones de Diseño de Software", date: "oct. 2026" },
  { name: "Curso Profesional de DevOps", date: "sept. 2026" },
  { name: "Curso de Spec Driven Development", date: "sept. 2026" },
  {
    name: "Curso de Pensamiento Crítico para usar Inteligencia Artificial",
    date: "may. 2026",
  },
] as const

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function getAboutBioText(): string {
  return ABOUT_PARAGRAPHS.join(" ")
}
