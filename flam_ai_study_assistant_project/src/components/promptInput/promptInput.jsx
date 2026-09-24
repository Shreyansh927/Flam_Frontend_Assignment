import { useState } from "react";

export default function PromptInput({ onSubmit, loading }) {
  const [value, setValue] = useState("");

  function submit(event) {
    event.preventDefault();
    const input = value.trim();
    if (!input || loading) return;
    onSubmit(input);
  }

  return (
    <form className="prompt-card" onSubmit={submit}>
      <div className="eyebrow">AI STUDY BUILDER</div>
      <h1>Turn any topic into a study set.</h1>
      <p className="muted">
        Paste notes, a topic, or a concept. StudyForge creates flashcards and a
        short quiz from structured AI output.
      </p>

      <label htmlFor="study-input">What do you want to study?</label>
      <textarea
        id="study-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Example: Explain React hooks, including useState, useEffect, dependency arrays, and common mistakes."
        maxLength={6000}
        rows={7}
        disabled={loading}
      />

      <div className="input-footer">
        <span>{value.length}/6000</span>
        <button
          className="primary"
          type="submit"
          disabled={loading || !value.trim()}
        >
          {loading ? "Generating…" : "Generate study set"}
        </button>
      </div>
    </form>
  );
}
