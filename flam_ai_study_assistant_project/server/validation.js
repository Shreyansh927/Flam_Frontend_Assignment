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

export const studySchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  cards: z.array(cardSchema).min(1).max(12),
  quiz: z.array(quizSchema).min(1).max(8),
});

export function parseAndValidateModelOutput(raw) {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("The model returned an empty response.");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```json\s*([\s\S]*?)\s*```/i);
    if (!fenced) throw new Error("The model returned malformed JSON.");
    try {
      parsed = JSON.parse(fenced[1]);
    } catch {
      throw new Error("The model returned malformed JSON.");
    }
  }

  const result = studySchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("The model returned JSON with the wrong structure.");
  }

  return result.data;
}
