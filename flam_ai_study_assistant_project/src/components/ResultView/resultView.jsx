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
      <section className="refinement-box">
        <div className="refinement-header">
          <div className="refinement-title">
            <div className="ai-orb">
              <span>✦</span>
            </div>

            <div>
              <div className="eyebrow">AI REFINEMENT</div>
              <h3>Shape your study set</h3>
            </div>
          </div>

          <span className="ai-badge">
            <span className="status-dot" />
            AI Powered
          </span>
        </div>

        <p className="refinement-description">
          Ask AI to improve, simplify, expand, or change your study set without
          starting over.
        </p>

        <form onSubmit={submitRefinement}>
          <div className="refinement-input-wrap">
            <input
              value={instruction}
              onChange={(event) => setInstruction(event.target.value)}
              placeholder="e.g. Make the quiz harder and add more conceptual questions"
              maxLength={500}
              disabled={refining}
            />

            <button
              className="refine-button"
              type="submit"
              disabled={!instruction.trim() || refining}
            >
              {refining ? (
                <>
                  <span className="button-spinner" />
                  Refining
                </>
              ) : (
                <>
                  <span>✦</span>
                  Refine
                </>
              )}
            </button>
          </div>

          <div className="refinement-footer">
            <div className="suggestion-list">
              <button
                type="button"
                onClick={() => setInstruction("Make the quiz harder")}
                disabled={refining}
              >
                Make it harder
              </button>

              <button
                type="button"
                onClick={() => setInstruction("Simplify the explanations")}
                disabled={refining}
              >
                Simplify
              </button>

              <button
                type="button"
                onClick={() => setInstruction("Add more conceptual questions")}
                disabled={refining}
              >
                Add concepts
              </button>
            </div>

            <span className="character-count">{instruction.length}/500</span>
          </div>
        </form>
      </section>

      <FlashcardDeck cards={result.cards} />

      <Quiz questions={result.quiz} />
    </main>
  );
}
