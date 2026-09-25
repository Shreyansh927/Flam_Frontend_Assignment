import { useEffect, useState } from "react";
import "./flashCardDeck.css";

export default function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  const move = (delta) => {
    setFlipped(false);
    setIndex((i) => Math.max(0, Math.min(cards.length - 1, i + delta)));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setFlipped((v) => !v);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cards.length]);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">FLASHCARDS</div>
          <h2>Active recall</h2>
        </div>
        <span className="counter">
          {index + 1} / {cards.length}
        </span>
      </div>

      <button
        className={`flashcard ${flipped ? "is-flipped" : ""}`}
        onClick={() => setFlipped((v) => !v)}
      >
        <span className="difficulty">{card.difficulty}</span>
        <span className="card-label">{flipped ? "ANSWER" : "QUESTION"}</span>
        <strong>{flipped ? card.answer : card.question}</strong>
        <span className="flip-hint">← → navigate · Enter flip</span>
      </button>

      <div className="card-actions">
        <button
          className="secondary"
          onClick={() => move(-1)}
          disabled={index === 0}
        >
          ← Previous
        </button>

        <button
          className="primary"
          onClick={() => move(1)}
          disabled={index === cards.length - 1}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
