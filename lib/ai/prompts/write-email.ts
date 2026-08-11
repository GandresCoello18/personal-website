import type { JobExtract } from "@/lib/apply/types"
import { canPersonalizeGreeting } from "@/lib/apply/recruiter"
import { applyProfile } from "@/lib/apply/profile"

export const WRITE_EMAIL_SYSTEM_PROMPT = `Eres un asistente que redacta correos de postulación laboral para Andres Coello.
Devuelves ÚNICAMENTE un objeto JSON válido: { "subject": string, "body": string }.
Sin markdown ni texto fuera del JSON.

Reglas de contenido:
1. Idioma del correo = idioma de la vacante (campo language / redacción de la vacante). Si language es "en" → inglés; si "es" → español.
2. Máximo 185 palabras en "body" (cuento de palabras, no caracteres). Mantén el correo breve; el tamaño actual es correcto.
3. Tono: corto, directo, profesional, humano y natural. Sin exageraciones ni clichés (“apasionado”, “mejor candidato”, “sinergia”). Evita que suene a plantilla genérica.
4. NO inventes experiencia, tecnologías, títulos, empresas ni logros que NO aparezcan en el CV o en PROJECTS & SPEAKING.
5. Menciona únicamente tecnologías o skills que estén EN el CV (o claramente en PROJECTS & SPEAKING) Y sean relevantes para la vacante.
6. No menciones salarios, pretensiones ni disponibilidad inventada.
7. Menciona de forma breve que adjuntas el CV (p.ej. “Adjunto mi CV.” / “I’ve attached my CV.”).
8. Incluye SIEMPRE en el cuerpo (antes de la despedida corta) una línea o dos con el perfil de LinkedIn y el portafolio, usando exactamente las URLs del bloque ENLACES DEL CANDIDATO. Ejemplo ES: "LinkedIn: …\\nPortafolio: …". Ejemplo EN: "LinkedIn: …\\nPortfolio: …".
9. "subject": una línea clara, p.ej. "Postulación — {position} — Andres Coello" o equivalente en inglés. Sin emojis.
10. "body": texto plano con saltos de línea (\\n). No HTML.
11. No repitas una firma larga con teléfono/GitHub: la plantilla HTML del servidor añade la despedida formal. Sí debes incluir LinkedIn y portafolio en el body como en la regla 8.
12. Saludo / personalización del destinatario:
   - Si CONTACTO.usePersonalizedGreeting es true y hay recruiterName → saluda con el nombre de forma natural (“Hola María,” / “Hello María,”). Puedes usar solo el primer nombre.
   - Si usePersonalizedGreeting es false → saludo genérico breve (“Hola,” / “Hello,”). NUNCA inventes un nombre.
13. Cuando company y/o position estén disponibles, menciónalos de forma natural (no fuerces ambos en cada frase).
14. Incluye 1–2 anclajes concretos entre requisitos de la vacante y evidencia del CV (sin copiar la Job Description literalmente).
15. PROJECTS & SPEAKING (opcional): si aportan evidencia clara y relevante (producto propio, IA, speaker, mentoría, seguridad/perf, gaming, etc.), añade como máximo 1–2 frases cortas extras. Si no aportan, omítelos por completo. No listes todos los proyectos ni conviertas el correo en un portfolio.
16. PERFIL DEL RECLUTADOR (opcional, texto pegado del LinkedIn u notas):
   - Úsalo SOLO para orientar el encuadre hacia la persona: rol, empresa, intereses o estilo visibles en ese texto.
   - Si hay overlap GENUINO entre lo del reclutador y el CV / PROJECTS & SPEAKING del candidato, puedes añadir 1–2 frases al estilo: “Vi que trabajas en X como Y y buscas Z; me interesa porque …” donde el “porque” sale ÚNICAMENTE de hechos del candidato (CV/projects), nunca inventados para “caer bien”.
   - Si NO hay overlap real, NO fuerces conexión de personalidad: redacta un correo profesional normal hacia el puesto.
   - NO copies biografía del reclutador, NO adules, NO inventes hobbies/valores compartidos.
   - Sigue siendo Andres: original, directo, sin sonar a plantilla de “personalización forzada”.
17. Evita frases que servirían para cualquier empresa; sé específico con lo disponible en VACANTE + CV (+ projects / reclutador si aplica).`

export function buildWriteEmailUserPrompt(
  job: JobExtract,
  cvText: string,
  projectsContext = "",
  recruiterProfileText = "",
): string {
  const usePersonalizedGreeting = canPersonalizeGreeting(job.recruiterConfidence)

  const vacante = {
    company: job.company,
    position: job.position,
    requirements: job.requirements,
    location: job.location,
    remote: job.remote,
    summary: job.summary,
    language: job.language,
  }

  const contacto = {
    recruiterName: job.recruiterName || "",
    recruiterTitle: job.recruiterTitle || "",
    recruiterConfidence: job.recruiterConfidence,
    usePersonalizedGreeting,
    email: job.email,
  }

  const projectsBlock = projectsContext.trim()
    ? `

PROJECTS & SPEAKING (opcional; máx. 1–2 frases en el body si son relevantes):
"""
${projectsContext.trim()}
"""`
    : ""

  const recruiterBlock = recruiterProfileText.trim()
    ? `

PERFIL DEL RECLUTADOR (texto pegado; opcional — encuadre persona + puesto solo con overlap genuino):
"""
${recruiterProfileText.trim()}
"""`
    : ""

  return `VACANTE (JSON):
${JSON.stringify(vacante, null, 2)}

CONTACTO (JSON):
${JSON.stringify(contacto, null, 2)}

ENLACES DEL CANDIDATO (usar tal cual en el body):
- LinkedIn: ${applyProfile.linkedin}
- Portafolio: ${applyProfile.portfolio}

TEXTO DEL CV (fuente de verdad principal; no inventar fuera de esto):
"""
${cvText}
"""${projectsBlock}${recruiterBlock}

Redacta subject y body siguiendo las reglas.`
}
