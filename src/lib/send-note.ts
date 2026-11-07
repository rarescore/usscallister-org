type Note = {
  kind: "project" | "newsletter";
  name?: string;
  email: string;
  phone?: string;
  brief?: string;
  trap?: string;
};

export async function sendStudioNote(input: Note) {
  if (input.trap) return;

  const response = await fetch("/.netlify/functions/submit-form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Could not send.");
  }
}
