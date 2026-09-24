const API_URL = import.meta.env.VITE_API_URL;

export async function generateStudySet(input, signal) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
    signal,
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  if (!response.ok) {
    throw new Error(payload?.error || "Unable to generate the study set.");
  }

  if (!payload?.data) {
    throw new Error("The server returned an empty study set.");
  }

  return payload.data;
}
