const API_BACKEND_URL = import.meta.env.VITE_API_URL
function getApiError(payload, fallback) {
  if (payload?.code === "QUOTA_EXCEEDED") {
    return "AI usage limit reached. Please try again later.";
  }

  if (payload?.code === "AI_PROVIDER_ERROR") {
    return "The AI service is temporarily unavailable. Please try again.";
  }

  return payload?.error || fallback;
}

async function parseResponse(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an unreadable response.");
  }

  return payload;
}

export async function generateStudySet(input, signal) {
  const response = await fetch(`${API_BACKEND_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input }),
    signal,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getApiError(payload, "Unable to generate the study set."));
  }

  if (!payload?.data) {
    throw new Error("The server returned an empty study set.");
  }

  return payload.data;
}

export async function refineStudySet(result, instruction) {
  const response = await fetch(`${API_BACKEND_URL}/api/refine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      result,
      instruction,
    }),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getApiError(payload, "Failed to refine the study set."));
  }

  if (!payload?.data) {
    throw new Error("The server returned an empty refined study set.");
  }

  return payload.data;
}
