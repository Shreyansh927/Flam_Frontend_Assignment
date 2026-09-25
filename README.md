# StudyForge — Flam Frontend Internship Assignment

An AI-powered interactive study assistant built for the Flam frontend assignment.

## What it does

The user provides free-form notes or a topic. A backend proxy sends the input to Gemini and requests a structured JSON study set containing:

- Flashcards
- Multiple-choice quiz questions
- Correct answers and explanations

The React UI then turns that structured data into interactive learning features:

- Click-to-flip flashcards
- Keyboard navigation using `←`, `→`, `Enter`, and `Space`
- Multiple-choice quiz selection
- Automatic score calculation
- Answer explanations after submission
- Re-test of wrong answers
- AI-powered study-set refinement
- Quick refinement suggestions such as making the quiz harder or simplifying explanations
- New-topic flow
- LocalStorage-based study session persistence
- Automatic restoration of the latest study session after refresh
- Loading and error states
- Responsive mobile experience

The application is intentionally **not a chatbot**. Gemini is responsible for generating study content, while the React application owns the structured data, validation, state management, interactions, persistence, and UI.


## Architecture

```text
React UI
   |
   | POST /api/generate
   v
Express Backend
   |
   | Gemini API request
   v
Gemini
   |
   | Structured JSON
   v
Server-side Zod validation
   |
   | validated JSON
   v
React-side Zod validation
   |
   v
Interactive flashcards + quiz
   |
   +-- AI Refinement
   +-- LocalStorage
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
- Docker

## Docker

The project includes a Docker setup that builds the React frontend and runs the Express server in a single container.

### Build the Docker image

```bash
docker build -t flam-study-assistant .

docker run --env-file .env -p 4001:4000 flam-study-assistant

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
- Study sets are saved only in the browser using LocalStorage, so they are not available across different browsers or devices.
- Clearing the browser's LocalStorage removes the saved study session.
- The model can still produce factually incorrect educational content; the app validates the structure of the AI response, not factual correctness.
- Gemini availability and quotas depend on the selected account/API tier.
- AI refinement requires an additional Gemini API request.
- No streaming is implemented because the project prioritizes reliable structured-data generation and validation.
- The application does not provide long-term learning analytics or spaced-repetition tracking.

## Suggested Demo Flow

1. Enter a topic such as:
   `Explain React hooks including useState, useEffect, dependency arrays, and common mistakes.`

2. Generate the study set and show the flashcards and quiz.

3. Flip a few flashcards and demonstrate the keyboard navigation.

4. Answer the quiz and intentionally get at least one question wrong.

5. Submit the quiz and show the score and answer explanations.

6. Click `Re-test wrong answers` to try the incorrect questions again.

7. Use the AI refinement feature, for example:
   `Make the quiz harder and add more conceptual questions.`

8. Show the updated study set and explain that the existing content can be refined without starting over.

9. Refresh the page and show that the latest study session is restored from LocalStorage.

10. Start a new topic to demonstrate the new-topic flow.

11. Briefly explain that the Gemini API key is kept on the server and that both the server and client validate the AI response before rendering it.

12. Point out the `requestId` logic in `src/App.jsx` that prevents stale responses from overwriting newer results, and the AI timeout/error handling in `server/index.js`.
## Time Spent

Approximately **8 hours**, including development, testing, UI refinement, error handling, AI refinement, and README/demo preparation.