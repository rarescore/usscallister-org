import { useEffect, useId, useState, type FormEvent } from "react";
import { sendStudioNote } from "@/lib/send-note";

const HIDE_KEY = "uss-news-hide";

const LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/#info", label: "Info" },
  { href: "/journal", label: "Journal" },
  { href: "/#contact", label: "Contact" },
];

function useNewsSignup() {
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

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
      setDone(true);
      setNote("You're on the list.");
      try {
        localStorage.setItem(HIDE_KEY, "joined");
      } catch {
        /* storage can be blocked */
      }
    } catch {
      setNote("Could not send. Write to usscallisterllc@gmail.com.");
    }
  }

  return { note, done, onSubmit };
}

function NewsFields({
  id,
  note,
  done,
  onSubmit,
}: {
  id: string;
  note: string;
  done: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (done) {
    return (
      <p className="news-done" role="status">
        You're on the list. We may email you about new work and promotions.
      </p>
    );
  }

  return (
    <form className="news-form" onSubmit={onSubmit}>
      <input className="trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label className="sr-only" htmlFor={id}>
        Email
      </label>
      <input id={id} name="email" type="email" required autoComplete="email" placeholder="Email address" />
      <button type="submit">Sign up</button>
      <p className="news-note" role="status">
        {note || "We may email you about new work and promotions."}
      </p>
    </form>
  );
}

export function StudioFooter() {
  const footId = useId();
  const popId = useId();
  const titleId = useId();
  const foot = useNewsSignup();
  const pop = useNewsSignup();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(HIDE_KEY)) return;
    } catch {
      return;
    }
    const id = window.setTimeout(() => setOpen(true), 6000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePop();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function closePop() {
    setOpen(false);
    try {
      if (localStorage.getItem(HIDE_KEY) !== "joined") localStorage.setItem(HIDE_KEY, "later");
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <footer className="site-foot">
        <div className="site-foot-inner">
          <div className="site-foot-top">
            <p className="site-foot-mark">USSCALLISTER</p>
            <p className="site-foot-line">An independent studio in Los Angeles. Design, development, branding, and film.</p>
          </div>

          <div className="site-foot-grid">
            <nav aria-label="Footer">
              <p>Visit</p>
              <ul>
                {LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p>Studio</p>
              <ul>
                <li>
                  <a href="mailto:usscallisterllc@gmail.com">usscallisterllc@gmail.com</a>
                </li>
                <li>
                  <a href="tel:8189136158">818-913-6158</a>
                </li>
                <li>Los Angeles</li>
              </ul>
            </div>
            <div>
              <p>Hours</p>
              <ul>
                <li>Taking new work</li>
                <li>Replies within two days</li>
              </ul>
            </div>
          </div>

          <div className="site-foot-news">
            <div>
              <p>Newsletter</p>
              <h2>Notes from the studio.</h2>
            </div>
            <NewsFields id={footId} note={foot.note} done={foot.done} onSubmit={foot.onSubmit} />
          </div>

          <div className="site-foot-legal">
            <span>© {new Date().getFullYear()} USSCALLISTER LLC</span>
            <nav aria-label="Legal">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </nav>
          </div>
        </div>
      </footer>

      {open ? (
        <div className="news-pop" role="presentation" onClick={closePop}>
          <div
            className="news-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="news-x" type="button" onClick={closePop} aria-label="Close">
              Close
            </button>
            <p>Newsletter</p>
            <h2 id={titleId}>Stay with the studio.</h2>
            <NewsFields id={popId} note={pop.note} done={pop.done} onSubmit={pop.onSubmit} />
          </div>
        </div>
      ) : null}
    </>
  );
}
