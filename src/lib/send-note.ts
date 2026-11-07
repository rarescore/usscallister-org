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

  const formName = input.kind === "newsletter" ? "newsletter" : "contact";
  const body = new URLSearchParams();
  body.set("form-name", formName);
  body.set("email", input.email);
  if (input.name) body.set("name", input.name);
  if (input.phone) body.set("phone", input.phone);
  if (input.brief) body.set("brief", input.brief);
  if (input.trap) body.set("company", input.trap);

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Could not send.");
  }
}
