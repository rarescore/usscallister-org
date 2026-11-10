import { useState, type FormEvent } from "react";
import { sendStudioNote } from "@/lib/send-note";

type Scores = {
  loadSpeed: number | null;
  seoBasics: number | null;
  mobileReadiness: number | null;
  firstImpression: number | null;
  overallScore: number | null;
  error?: string;
};

const LINES: { key: keyof Scores; label: string }[] = [
  { key: "loadSpeed", label: "Load speed" },
  { key: "seoBasics", label: "SEO basics" },
  { key: "mobileReadiness", label: "Mobile readiness" },
  { key: "firstImpression", label: "First impression" },
];

const EMPTY: Scores = {
  loadSpeed: null,
  seoBasics: null,
  mobileReadiness: null,
  firstImpression: null,
  overallScore: null,
  error: "Could not score that site.",
};

export function SiteCheck() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [report, setReport] = useState<Scores | null>(null);

  async function onScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setReport(null);
    setBusy(true);
    try {
      const response = await fetch("/.netlify/functions/pagespeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await response.json().catch(() => null)) as Scores | null;
      setReport(
        data && "loadSpeed" in data
          ? {
              loadSpeed: data.loadSpeed ?? null,
              seoBasics: data.seoBasics ?? null,
              mobileReadiness: data.mobileReadiness ?? null,
              firstImpression: data.firstImpression ?? null,
              overallScore: data.overallScore ?? null,
              error: data.error,
            }
          : EMPTY,
      );
    } catch {
      setReport(EMPTY);
    } finally {
      setBusy(false);
    }
  }

  async function onEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = email.trim();
    if (!address.includes("@")) {
      setNote("Leave a real email.");
      return;
    }
    setNote("Sending.");
    try {
      await sendStudioNote({
        kind: "project",
        name: "Site report",
        email: address,
        brief: `Fix request for ${url.trim()}. Scores ${JSON.stringify(report)}`,
      });
      setNote("We'll send it.");
      setEmail("");
    } catch {
      setNote("Could not send. Write to usscallisterllc@gmail.com.");
    }
  }

  return (
    <section className="site-check" aria-label="Check your site">
      <h2>Check your site.</h2>
      <form className="site-check-row" onSubmit={onScore}>
        <input
          type="text"
          inputMode="url"
          placeholder="yourwebsite.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          aria-label="Website"
          required
        />
        <button type="submit" disabled={busy}>
          Get score.
        </button>
      </form>
      {busy ? <p className="site-check-wait">scoring</p> : null}
      {report ? (
        <>
          <ul className="site-check-lines">
            {LINES.map((line) => {
              const value = report[line.key];
              return (
                <li key={line.key}>
                  <strong>{typeof value === "number" ? value : "unavailable"}</strong>
                  <span>{line.label}</span>
                </li>
              );
            })}
          </ul>
          <form className="site-check-mail" onSubmit={onEmail}>
            <p>Want us to fix it?</p>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
            />
            {note ? <p className="site-check-note">{note}</p> : null}
          </form>
        </>
      ) : null}
    </section>
  );
}
