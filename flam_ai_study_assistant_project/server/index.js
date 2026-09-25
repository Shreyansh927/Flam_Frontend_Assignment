import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { buildPrompt, buildRefinementPrompt } from "./prompt.js";
import { parseAndValidateModelOutput } from "./validation.js";

const app = express();

const PORT = Number(process.env.PORT || 4000);
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  }),
);

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate", async (req, res) => {
  const input =
    typeof req.body?.input === "string" ? req.body.input.trim() : "";

  if (!input) {
    return res.status(400).json({
      error: "Please enter a topic or some notes.",
    });
  }

  if (input.length > 6000) {
    return res.status(400).json({
      error: "Input is too long. Please keep it under 6000 characters.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured on the server.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: buildPrompt(input) }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const providerText = await response.text();

      console.error("Gemini refinement error:", providerText.slice(0, 2000));

      let providerError;

      try {
        providerError = JSON.parse(providerText);
      } catch {
        providerError = null;
      }

      // Gemini quota limmit
      if (response.status === 429) {
        return res.status(429).json({
          error:
            providerError?.error?.message ||
            "AI usage limit reached. Please try again later.",
          code: "QUOTA_EXCEEDED",
        });
      }

      return res.status(502).json({
        error:
          providerError?.error?.message ||
          "The AI provider failed to refine the study set.",
        code: "AI_PROVIDER_ERROR",
      });
    }

    const payload = await response.json();

    const raw = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");

    const data = parseAndValidateModelOutput(raw);

    return res.json({ data });
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({
        error: "The AI request took too long. Please retry.",
      });
    }

    console.error("Generation error:", error);

    return res.status(500).json({
      error: "Unexpected server error.",
    });
  } finally {
    clearTimeout(timeout);
  }
});

app.post("/api/refine", async (req, res) => {
  const { result, instruction } = req.body || {};

  if (!result || typeof result !== "object") {
    return res.status(400).json({
      error: "A valid study set is required.",
    });
  }

  if (typeof instruction !== "string" || !instruction.trim()) {
    return res.status(400).json({
      error: "Please provide a refinement instruction.",
    });
  }

  if (instruction.length > 1000) {
    return res.status(400).json({
      error: "Refinement instruction is too long.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured.",
    });
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 900000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        signal: controller.signal,

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: buildRefinementPrompt(result, instruction.trim()),
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      const providerText = await response.text();

      console.error("Gemini refinement error:", providerText.slice(0, 2000));

      let providerError;

      try {
        providerError = JSON.parse(providerText);
      } catch {
        providerError = null;
      }

      // Gemini quota limit
      if (response.status === 429) {
        return res.status(429).json({
          error:
            providerError?.error?.message ||
            "AI usage limit reached. Please try again later.",
          code: "QUOTA_EXCEEDED",
        });
      }

      return res.status(502).json({
        error:
          providerError?.error?.message ||
          "The AI provider failed to refine the study set.",
        code: "AI_PROVIDER_ERROR",
      });
    }

    const payload = await response.json();

    const raw = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");

    const data = parseAndValidateModelOutput(raw);

    return res.json({ data });
  } catch (error) {
    if (error?.name === "AbortError") {
      return res.status(504).json({
        error: "The refinement request took too long. Please retry.",
      });
    }

    console.error("Refinement error:", error);

    return res.status(500).json({
      error: "Unexpected server error.",
    });
  } finally {
    clearTimeout(timeout);
  }
});

// it is used for react serve build
app.use(express.static(path.join(__dirname, "../dist")));

app.get("*splat", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`StudyAssistant server running on port ${PORT}`);
});
