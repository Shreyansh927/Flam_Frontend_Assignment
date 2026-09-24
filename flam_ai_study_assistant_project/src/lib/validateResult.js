import { z } from "zod";

const cardSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const quizSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  answerIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
});

export const studyResultSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  cards: z.array(cardSchema).min(1).max(12),
  quiz: z.array(quizSchema).min(1).max(8),
});

export function validateStudyResult(value) {
  const result = studyResultSchema.safeParse(value);

  if (!result.success) {
    return {
      ok: false,
      error: "The AI returned data in an unexpected format.",
    };
  }

  return { ok: true, data: result.data };
}
