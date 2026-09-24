import { useMemo, useState } from "react";
import './quiz.css'

export default function Quiz({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showWrongOnly, setShowWrongOnly] = useState(false);

  const score = useMemo(
    () =>
      questions.reduce(
        (total, q) => total + (answers[q.id] === q.answerIndex ? 1 : 0),
        0,
      ),
    [answers, questions],
  );

  const visibleQuestions = showWrongOnly
    ? questions.filter((q) => answers[q.id] !== q.answerIndex)
    : questions;

  function submit() {
    setSubmitted(true);
    setShowWrongOnly(false);
  }

  function retestWrong() {
    setSubmitted(false);
    setShowWrongOnly(true);
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">QUIZ</div>
          <h2>Check your understanding</h2>
        </div>
        {submitted && (
          <div className="score">
            {score}/{questions.length}
          </div>
        )}
      </div>

      {submitted && (
        <div className="result-banner">
          <strong>
            {score === questions.length
              ? "Perfect score."
              : `${score} correct.`}
          </strong>
          <span>
            {questions.length - score} question
            {questions.length - score === 1 ? "" : "s"} to review.
          </span>
          {score < questions.length && (
            <button className="secondary small" onClick={retestWrong}>
              Re-test wrong answers
            </button>
          )}
          {showWrongOnly && (
            <button
              className="ghost small"
              onClick={() => setShowWrongOnly(false)}
            >
              Show all
            </button>
          )}
        </div>
      )}

      <div className="quiz-list">
        {visibleQuestions.map((q, number) => {
          const selected = answers[q.id];
          const correct = submitted && selected === q.answerIndex;
          const wrong =
            submitted && selected !== undefined && selected !== q.answerIndex;

          return (
            <article
              className={`quiz-question ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
              key={q.id}
            >
              <div className="question-number">{number + 1}</div>
              <div className="question-body">
                <h3>{q.question}</h3>
                <div className="options">
                  {q.options.map((option, index) => (
                    <label className="option" key={option}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={selected === index}
                        onChange={() => {
                          if (!submitted) {
                            setAnswers((current) => ({
                              ...current,
                              [q.id]: index,
                            }));
                          }
                        }}
                        disabled={submitted}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>

                {submitted && (
                  <div className="explanation">
                    <strong>{correct ? "Correct" : "Review"}</strong>
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {!submitted && (
        <button className="primary wide" onClick={submit}>
          Submit quiz
        </button>
      )}
    </section>
  );
}
