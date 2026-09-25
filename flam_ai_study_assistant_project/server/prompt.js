export function buildPrompt(userInput) {
  return `You are a study-content generator. Convert the user's free-form input into a compact study set.

Return ONLY valid JSON. Do not use Markdown fences. Do not add prose before or after the JSON.

The exact required shape is:
{
  "title": "short title",
  "summary": "one or two sentence summary",
  "cards": [
    {
      "id": "card-1",
      "question": "clear recall question",
      "answer": "concise accurate answer",
      "difficulty": "easy | medium | hard"
    }
  ],
  "quiz": [
    {
      "id": "quiz-1",
      "question": "multiple choice question",
      "options": ["option A", "option B", "option C", "option D"],
      "answerIndex": 0,
      "explanation": "short explanation"
    }
  ]
}

Rules:
- Generate 6 to 10 flashcards.
- Generate 5 to 8 quiz questions.
- Every quiz question must have exactly 4 distinct options.
- answerIndex must be the zero-based index of the correct option.
- Keep answers and explanations concise.
- Only include information supported by the user's input or standard knowledge directly needed to explain it.
- Avoid duplicate questions.
- Use stable-looking IDs such as card-1 and quiz-1.
- If the input is vague, make a reasonable educational interpretation rather than returning an empty result.

User input:
${userInput}`;
}

export function buildRefinementPrompt(result, instruction) {
  return `
You are refining an existing AI-generated study set.

The user wants to modify the existing study set according to their instruction.

USER INSTRUCTION:
${instruction}

EXISTING STUDY SET:
${JSON.stringify(result)}

IMPORTANT RULES:

1. Modify the existing study set instead of creating an unrelated study set.
2. Preserve the original topic and useful information unless the user asks to change it.
3. Apply the user's instruction to the relevant parts.
4. Return the COMPLETE updated study set.
5. Keep the exact JSON structure required by the application.
6. The response must contain:
   - title
   - summary
   - cards
   - quiz
7. Each flashcard must contain:
   - id
   - question
   - answer
   - difficulty
8. Each quiz question must contain:
   - id
   - question
   - options
   - answerIndex
   - explanation
9. Every quiz question must have exactly 4 options.
10. answerIndex must be between 0 and 3.
11. Do not return markdown.
12. Return only valid JSON.

Return the complete updated study set.
`;
}
