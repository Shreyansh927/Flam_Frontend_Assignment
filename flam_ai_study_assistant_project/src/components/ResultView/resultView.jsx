import FlashcardDeck from "../FlashcardDeck/flashcardDeck.jsx";
import Quiz from "../Quiz/quiz.jsx";
import './resultView.css'

export default function ResultView({ result, onNew }) {
  return (
    <main className="result-layout">
      <header className="result-header">
        <div>
          <div className="eyebrow">STUDY SET READY</div>
          <h1>{result.title}</h1>
          <p>{result.summary}</p>
        </div>
        <button className="secondary" onClick={onNew}>
          New topic
        </button>
      </header>

      <FlashcardDeck cards={result.cards} />
      <Quiz questions={result.quiz} />
    </main>
  );
}
