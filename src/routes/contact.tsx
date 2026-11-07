import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FolioBar } from "@/components/article";
import { pageCanonicalHead } from "@/lib/site-seo";
import { sendStudioNote } from "@/lib/send-note";

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...pageCanonicalHead("/contact"),
    meta: [
      { title: "Contact | USSCALLISTER" },
      {
        name: "description",
        content:
          "Start a project with USSCALLISTER, an independent creative studio in Los Angeles. Websites, branding, development, and film.",
      },
      { name: "keywords", content: "USSCALLISTER contact, Los Angeles design studio, start a project" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Contact | USSCALLISTER" },
      {
        property: "og:description",
        content: "Tell us about your project. USSCALLISTER builds websites, branding, and film in Los Angeles.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [note, setNote] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const brief = String(data.get("brief") || "").trim();
    const trap = String(data.get("company") || "").trim();
    if (!name || !email.includes("@")) {
      setNote("Name and email.");
      return;
    }
    setNote("Sending.");
    try {
      await sendStudioNote({ kind: "project", name, email, phone, brief, trap });
      setNote("Message has been sent.");
      event.currentTarget.reset();
    } catch {
      setNote("Could not send. Write to usscallisterllc@gmail.com.");
    }
  }

  return (
    <main className="folio">
      <FolioBar here="Contact" />
      <article className="folio-article">
        <p className="kicker-label">Contact</p>
        <h1>Start a project.</h1>
        <div className="folio-prose folio-prose-solo">
          <p>
            Tell us what you're building — a website, a brand, a film, or something that doesn't have a name yet.
            We read every message and reply within one business day.
          </p>
          <form className="news-form contact-form" onSubmit={onSubmit}>
            <input className="trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" required autoComplete="name" placeholder="Name" />
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="Email" />
            <label htmlFor="contact-phone">Phone</label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone (optional)" />
            <label htmlFor="contact-brief">Project brief</label>
            <textarea id="contact-brief" name="brief" rows={5} placeholder="What are you making?" />
            <button type="submit">Send</button>
          </form>
          <p className="form-note">{note}</p>
          <p className="contact-alt">
            Or email <a href="mailto:usscallisterllc@gmail.com">usscallisterllc@gmail.com</a>
            {" "}·{" "}
            <a href="tel:8189136158">818-913-6158</a>
          </p>
        </div>
      </article>
    </main>
  );
}
