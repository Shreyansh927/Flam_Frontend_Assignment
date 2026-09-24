export default function LoadingState() {
  return (
    <section className="state-card loading-card" aria-live="polite">
      <div className="spinner" />
      <div>
        <h2>Building your study set…</h2>
        <p className="muted">
          The AI is creating cards and checking the structured response.
        </p>
      </div>
    </section>
  );
}
