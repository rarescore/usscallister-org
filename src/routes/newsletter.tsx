import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { FolioBar } from "@/components/article";
import { sendStudioNote } from "@/lib/send-note";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "Newsletter | USSCALLISTER" },
      {
        name: "description",
        content:
          "Sign up for the USSCALLISTER newsletter. Occasional notes on design, development, and new studio projects in Los Angeles.",
      },
      { name: "keywords", content: "USSCALLISTER newsletter, Los Angeles design studio, web design notes" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Newsletter | USSCALLISTER" },
      {
        property: "og:description",
        content: "Occasional notes from USSCALLISTER on design, development, and new projects.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  const [note, setNote] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const trap = String(data.get("company") || "").trim();
    if (!email.includes("@")) {
      setNote("Enter an email address.");
      return;
    }
    setNote("Sending.");
    try {
      await sendStudioNote({ kind: "newsletter", email, trap });
      setNote("You're on the list. We'll write to that address.");
    } catch {
      setNote("Could not send. Write to usscallisterllc@gmail.com.");
    }
  }

  return (
    <main className="folio">
      <FolioBar here="Newsletter" />
      <article className="folio-article">
        <p className="kicker-label">Newsletter</p>
        <h1>Sign up for the newsletter.</h1>
        <div className="folio-prose folio-prose-solo">
          <p>
            Sign up and we may email this address with studio notes and promotions: new work, offers, and updates. We
            do not sell the list. Write back any time to be taken off.
          </p>
          <form className="news-form" onSubmit={onSubmit}>
            <label htmlFor="news-email">Email</label>
            <input className="trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <input id="news-email" name="email" type="email" required autoComplete="email" placeholder="Email" />
            <button type="submit">Sign up</button>
          </form>
          <p className="form-note">{note}</p>
        </div>
      </article>
    </main>
  );
}
