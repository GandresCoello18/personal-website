import { answerInterviewQuestions } from "@/lib/ai/gemini"
import { buildInterviewContext } from "@/lib/interview/context"
import type { InterviewAnswers } from "@/lib/interview/types"

const MAX_QUESTIONS_CHARS = 6_000

export function normalizeQuestionsInput(raw: string): string {
  return raw.replace(/\r\n/g, "\n").trim()
}

export async function answerRecruiterQuestions(questionsRaw: string): Promise<InterviewAnswers> {
  const questions = normalizeQuestionsInput(questionsRaw)
  if (questions.length < 10) {
    throw new Error("Pega al menos una pregunta completa.")
  }

  const truncated =
    questions.length > MAX_QUESTIONS_CHARS
      ? `${questions.slice(0, MAX_QUESTIONS_CHARS)}\n…`
      : questions

  const context = buildInterviewContext(truncated)
  if (!context.trim()) {
    throw new Error("No hay contexto de carrera/CV disponible en content/.")
  }

  return answerInterviewQuestions(truncated, context)
}
