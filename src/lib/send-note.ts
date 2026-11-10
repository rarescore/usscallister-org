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

  const body = new URLSearchParams();
  body.set("form-name", input.kind === "newsletter" ? "newsletter" : "contact");
  body.set("email", input.email);
  if (input.kind === "project") {
    body.set("name", input.name ?? "");
    body.set("phone", input.phone ?? "");
    body.set("brief", input.brief ?? "");
  }

  const response = await fetch("/netlify-forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Could not send.");
  }
}
