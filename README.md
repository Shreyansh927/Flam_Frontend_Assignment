# StudyAssistant — Flam Frontend Internship Assignment

An AI-powered interactive study assistant built for the Flam frontend assignment.

## What it does

The user provides free-form notes or a topic. A backend proxy sends that input to Gemini and requests a strict JSON study set containing:

- Flashcards
- Multiple-choice quiz questions
- Correct answers and explanations

The React UI then turns that structured data into interactive components:

- Click-to-flip flashcards
- Quiz selection
- Score calculation
- Explanations after submission
- Re-test of wrong answers
- New-topic flow

It is intentionally **not a chatbot**.

## Architecture

```text
React UI
   |
   | POST /api/generate
   v
Express backend
   |
   | Gemini API request
   v
Gemini
   |
   | JSON
   v
Server-side Zod validation
   |
   | validated JSON
   v
React-side Zod validation
   |
   v
Interactive flashcards + quiz
```

The Gemini API key exists only on the server.

## Tech stack

- React 19 + hooks
- Vite
- Express
- Gemini API
- Zod
- Plain CSS
- Node.js 20+

## Setup

### 1. Install

```bash
npm install
```

### 2. Configure the API key

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

Never commit `.env`.

### 3. Run development mode

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend is Vite on port 5173 and the backend is Express on port 4000.

### 4. Production build

```bash
npm run build
npm start
```

The Express server serves the generated `dist` directory.

## Failure handling

The app explicitly handles:

1. Empty input — rejected before the AI call.
2. Provider failure — returned as a user-facing error.
3. Slow provider — 30-second backend timeout.
4. Empty model response — rejected.
5. Malformed JSON — rejected; a JSON fence is accepted only as a narrow recovery case.
6. Wrong JSON shape — rejected by Zod.
7. Empty cards/quiz — rejected.
8. Stale frontend requests — request IDs prevent an older response from overwriting a newer result.
9. New request — previous browser request is aborted.
10. Mobile layout — responsive CSS is included.

## Why validation exists twice

The server validates the model output before returning it. The browser validates it again before rendering.

This creates a simple trust boundary:

```text
untrusted model output
        ↓
server validation
        ↓
API response
        ↓
client validation
        ↓
React state
        ↓
UI
```

The UI never renders raw model text.

## AI usage note

AI tools were used during development for brainstorming, implementation assistance, debugging, and reviewing edge cases. The resulting architecture and code should be understood and explainable by the author. The important design decisions — structured output, validation, stale-response protection, loading/error states, and interactive rendering — are implemented explicitly in the project.

## Known limitations

- No authentication or persistent database, as neither is required by the assignment.
- Study sets are not saved between sessions.
- The model can still produce factually incorrect educational content; this app validates structure, not factual truth.
- Gemini availability and quotas depend on the selected account/API tier.
- No streaming is implemented because reliability of the core structured-data flow is prioritized.

## Suggested demo flow

1. Enter:
   `Explain React hooks including useState, useEffect, dependency arrays, and common mistakes.`
2. Generate the study set.
3. Flip several cards.
4. Answer the quiz with at least one deliberate mistake.
5. Submit and show the score/explanations.
6. Click `Re-test wrong answers`.
7. Start a new topic.
8. Explain that the API key is server-side and that both server and client validate AI output.
9. Point out `requestId` in `src/App.jsx` and the 30-second timeout in `server/index.js`.

## Time spent

Target implementation: approximately 8 hours or less, including testing and README/demo preparation.
