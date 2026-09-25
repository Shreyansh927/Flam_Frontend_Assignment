import { useEffect, useRef, useState } from "react";

import PromptInput from "./components/promptInput/promptInput.jsx";
import LoadingState from "./components/LoadingState/loadingState.jsx";
import ErrorState from "./components/ErrorState/errorState.jsx";
import ResultView from "./components/ResultView/resultView.jsx";

import { generateStudySet, refineStudySet } from "./lib/api.js";
import { validateStudyResult } from "./lib/validateResult.js";

import "./App.css";

const STORAGE_KEY = "studyforge_session";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState("");
  const [lastInput, setLastInput] = useState("");
  const [lastInstruction, setLastInstruction] = useState("");

  
  const requestId = useRef(0);

  // Restore the latest saved study session.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return;

      const session = JSON.parse(saved);

      if (session?.result) {
        setResult(session.result);
        setLastInput(session.input || "");
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  async function generate(input) {
    const id = ++requestId.current;

    setLoading(true);
    setError("");
    setLastInput(input);

    try {
      const data = await generateStudySet(input);

      // Ignore an older response.
      if (id !== requestId.current) return;

      const validation = validateStudyResult(data);

      if (!validation.ok) {
        throw new Error(validation.error);
      }

      const studySet = validation.data;

      setResult(studySet);

      // Save the results in localstorage.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          input,
          result: studySet,
        }),
      );
    } catch (err) {
      if (id === requestId.current) {
        setError(
          err.message || "Unable to generate the study set.",
        );
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  }

  async function refine(instruction) {
    if (!result || refining) return;

    setRefining(true);
    setError("");
    setLastInstruction(instruction);

    try {
      const data = await refineStudySet(
        result,
        instruction,
      );

      const validation = validateStudyResult(data);

      if (!validation.ok) {
        throw new Error(validation.error);
      }

      const updatedResult = validation.data;

      setResult(updatedResult);

      // Save the refined result.
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          input: lastInput,
          result: updatedResult,
        }),
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to refine the study set.",
      );
    } finally {
      setRefining(false);
    }
  }

  function reset() {
    setResult(null);
    setError("");
    setLastInstruction("");
    localStorage.removeItem(STORAGE_KEY);
  }

  function retry() {
    if (result) {
      refine(lastInstruction);
    } else {
      generate(lastInput);
    }
  }

  return (
    <div className="app-shell">
      <nav className="nav">
        <div className="brand">
          <span className="brand-mark">S</span>
          StudyAssistant
        </div>

        <span className="nav-note">
          Flam Frontend Assignment
        </span>
      </nav>

      {!result ? (
        <div className="home">
          <PromptInput
            onSubmit={generate}
            loading={loading}
          />

          {loading && <LoadingState />}
        </div>
      ) : (
        <ResultView
          result={result}
          onNew={reset}
          onRefine={refine}
          refining={refining}
        />
      )}

      
      {error && (
        <ErrorState
          message={error}
          onRetry={retry}
        />
      )}

      <footer>
        AI output is validated before being rendered.
      </footer>
    </div>
  );
};