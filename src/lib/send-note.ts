const STUDIO = "usscallisterllc@gmail.com";

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
  const subject = input.kind === "newsletter" ? "Newsletter signup" : `Project — ${input.name || "Inquiry"}`;
  const message =
    input.kind === "newsletter"
      ? `Please add this address to the USSCALLISTER newsletter.\n\n${input.email}`
      : `${input.name || ""}\n${input.email}\n${input.phone || ""}\n\n${input.brief || ""}`;
  const response = await fetch(`https://formsubmit.co/ajax/${STUDIO}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: input.name || "Newsletter",
      email: input.email,
      phone: input.phone || "",
      message,
      _subject: subject,
      _template: "table",
      _captcha: "false",
      _replyto: input.email,
    }),
  });
  const payload = (await response.json().catch(() => null)) as { success?: boolean | string; message?: string } | null;
  const ok = response.ok && (payload?.success === true || payload?.success === "true");
  if (!ok) throw new Error(payload?.message || "Could not send.");
}
