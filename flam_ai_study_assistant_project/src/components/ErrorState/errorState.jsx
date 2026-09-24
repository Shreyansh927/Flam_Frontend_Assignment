import './errorState.css'

export default function ErrorState({ message, onRetry }) {
  return (
    <section className="state-card error-card" role="alert">
      <div className="error-visual">
        <div className="error-icon">
          <span>!</span>
        </div>

        <div className="error-pulse" />
      </div>

      <div className="error-content">
        <div className="error-label">
          <span className="error-status-dot" />
          GENERATION INTERRUPTED
        </div>

        <h2>We couldn't build that study set</h2>

        <p className="error-message">{message}</p>

        <div className="error-actions">
          <button className="secondary error-retry" onClick={onRetry}>
            <span className="retry-icon">↻</span>
            Try again
          </button>

          <span className="error-hint">Your input is still saved</span>
        </div>
      </div>
    </section>
  );
}
