import { useRef, useState } from "react";
// import "./App.css";
import PromptInput from "./components/promptInput/promptInput.jsx";
import LoadingState from "./components/LoadingState/loadingState.jsx";
import ErrorState from "./components/ErrorState/errorState.jsx";
import ResultView from "./components/ResultView/resultView.jsx";
import './App.css'
import { generateStudySet } from "./lib/api.js";
import { validateStudyResult } from "./lib/validateResult.js";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastInput, setLastInput] = useState("");

  //here i prevent an older request from overwriting a newer request
  const requestId = useRef(0);

  async function generate(input) {
    const id = ++requestId.current;

    setLoading(true);
    setError("");
    setLastInput(input);

    try {
      const data = await generateStudySet(input);

      // ignore stale response
      if (id !== requestId.current) return;

      const validation = validateStudyResult(data);

      if (!validation.ok) {
        throw new Error(validation.error);
      }

      setResult(validation.data);
    } catch (err) {
      if (id !== requestId.current) return;

      setError(err.message || "Something went wrong.");
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }

  function reset() {
    setResult(null);
    setError("");
  }

  return (
    <div className="app-shell">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark">S</span>
          StudyAssistant
        </div>

        <span className="nav-note">Flam Frontend Assignment</span>
      </nav>

      {!result && (
        <div className="home">
          <PromptInput onSubmit={generate} loading={loading} />

          {loading && <LoadingState />}

          {error && (
            <ErrorState message={error} onRetry={() => generate(lastInput)} />
          )}
        </div>
      )}

      {result && <ResultView result={result} onNew={reset} />}

      <footer>AI output is validated before being rendered.</footer>
    </div>
  );
}
