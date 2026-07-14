import { z } from "zod"

export const interviewAnswerItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
})

export const interviewAnswersSchema = z.object({
  answers: z.array(interviewAnswerItemSchema).min(1),
})

export type InterviewAnswerItem = z.infer<typeof interviewAnswerItemSchema>
export type InterviewAnswers = z.infer<typeof interviewAnswersSchema>
