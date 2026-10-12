export type SkillGroup = {
  title: string
  skills: string[]
}

/** Chips de Habilidades Técnicas en home. Orden y grupos fijos. */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Backend",
    skills: ["Node.js", "TypeScript", "NestJS", "Fastify", "GraphQL", "PostgreSQL", "Prisma"],
  },
  {
    title: "Cloud",
    skills: ["Docker", "AWS EC2", "Vercel"],
  },
  {
    title: "IA/ERP",
    skills: ["LLM", "RAG", "Gemini", "Qdrant", "Odoo"],
  },
  {
    title: "Clientes",
    skills: ["Next.js", "React Native", "Expo", "Flutter"],
  },
]
