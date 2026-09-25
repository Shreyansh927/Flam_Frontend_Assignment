import { useState } from "react";

import FlashcardDeck from "../FlashcardDeck/flashcardDeck.jsx";
import Quiz from "../Quiz/quiz.jsx";

import "./resultView.css";

export default function ResultView({ result, onNew, onRefine, refining }) {
  const [instruction, setInstruction] = useState("");

  function submitRefinement(event) {
    event.preventDefault();

    const value = instruction.trim();

    if (!value || refining) return;

    onRefine(value);
    setInstruction("");
  }

  return (
    <main className="result-layout">
      <header className="result-header">
        <div>
          <div className="eyebrow">STUDY SET READY</div>

          <h1>{result.title}</h1>

          <p>{result.summary}</p>
        </div>

        <button className="secondary" onClick={onNew} disabled={refining}>
          New topic
        </button>
      </header>

      {/* AI refinement */}
      <form className="refinement-box" onSubmit={submitRefinement}>
        <div className="refinement-content">
          <div className="eyebrow">REFINE WITH AI</div>

          <p>Ask AI to modify this study set without starting over.</p>
        </div>

        <div className="refinement-controls">
          <input
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="Example: Make the quiz harder"
            maxLength={500}
            disabled={refining}
          />

          <button
            className="primary"
            type="submit"
            disabled={!instruction.trim() || refining}
          >
            {refining ? "Refining..." : "Refine"}
          </button>
        </div>
      </form>

      <FlashcardDeck cards={result.cards} />

      <Quiz questions={result.quiz} />
    </main>
  );
}
