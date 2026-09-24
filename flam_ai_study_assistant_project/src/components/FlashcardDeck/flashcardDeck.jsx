import { useState } from "react";

export default function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  function move(delta) {
    setFlipped(false);
    setIndex((current) =>
      Math.min(cards.length - 1, Math.max(0, current + delta)),
    );
  }

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
        onClick={() => setFlipped((value) => !value)}
        aria-label="Flip flashcard"
      >
        <span className="difficulty">{card.difficulty}</span>
        <span className="card-label">{flipped ? "ANSWER" : "QUESTION"}</span>
        <strong>{flipped ? card.answer : card.question}</strong>
        <span className="flip-hint">Click to flip</span>
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
