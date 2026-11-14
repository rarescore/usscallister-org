import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useFilm } from "@/lib/use-film";
import "./landing.css";

const TRADES = ["Clinic", "Roofing", "Plumbing", "Cleaning", "Other"] as const;
const TEXT_US = "sms:+18189136158?&body=I%20want%20to%20grow!";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Speak with us | USSCALLISTER" },
      {
        name: "description",
        content: "Fill this form out to speak with USSCALLISTER. It's free.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useFilm(videoRef, "/media/floor.mp4?v=3", "/media/floor-m.mp4?v=3");
  const [clock, setClock] = useState("");
  const [trade, setTrade] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");
  const [bad, setBad] = useState<"name" | "phone" | "">("");

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  function replay() {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const site = String(data.get("site") || "").trim();
    const trap = String(data.get("company") || "").trim();
    const digits = phone.replace(/\D/g, "");

    if (trap) return;
    if (name.length < 2) {
      setStatus("error");
      setBad("name");
      setNote("Add your name.");
      return;
    }
    if (digits.length < 7) {
      setStatus("error");
      setBad("phone");
      setNote("Add a real phone number.");
      return;
    }

    setBad("");
    setStatus("sending");
    setNote("");

    const fields = new URLSearchParams();
    fields.set("form-name", "landing-leads");
    fields.set("name", name);
    fields.set("phone", phone);
    fields.set("trade", trade || "Not said");
    fields.set("site", site || "Not given");

    try {
      const response = await fetch("/netlify-forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: fields.toString(),
      });
      if (!response.ok) throw new Error("send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
      setNote("Could not send. Call 818-913-6158.");
    }
  }

  return (
    <main className="floor">
      <video
        ref={videoRef}
        className="floor-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/floor-poster.jpg?v=hd"
        preload="none"
      />
      <img className="floor-poster" src="/media/floor-poster.jpg?v=hd" alt="" />
      <div className="floor-veil" aria-hidden="true" />

      <div className="mark">
        <button className="replay" type="button" onClick={replay}>
          Replay
        </button>
        <time suppressHydrationWarning>{clock}</time>
      </div>

      <section className="panel" aria-label="Start a call">
        <div className="panel-top">
          <a className="name" href="/">
            USSCALLISTER
          </a>
          <p className="where">Los Angeles</p>
        </div>

        {status === "sent" ? (
          <div className="sent">
            <p className="ask">We’ll call you today.</p>
            <p className="promise">
              A person from the studio, not a sequence. If it’s faster, call 818-913-6158.
            </p>
            <p className="meta">
              <a href="tel:8189136158">818-913-6158</a>
            </p>
          </div>
        ) : (
          <form className="sheet" onSubmit={onSubmit} noValidate>
            <h1 className="ask">
              Fill this form out to speak with us, it’s literally <span>FREE</span>
            </h1>

            <div className="trades" role="group" aria-label="What you do">
              {TRADES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={trade === item}
                  onClick={() => setTrade(trade === item ? "" : item)}
                >
                  <i aria-hidden="true" />
                  {item}
                </button>
              ))}
            </div>

            <label className={bad === "name" ? "field is-bad" : "field"}>
              <input name="name" type="text" autoComplete="name" aria-label="Name" placeholder="Your name" required />
            </label>
            <label className={bad === "phone" ? "field is-bad" : "field"}>
              <input name="phone" type="tel" autoComplete="tel" inputMode="tel" aria-label="Phone" placeholder="Your number" required />
            </label>
            <label className="field">
              <input name="site" type="text" inputMode="url" autoComplete="url" aria-label="Site" placeholder="yoursite.com" />
            </label>

            <label className="trap" aria-hidden="true">
              Company
              <input name="company" type="text" tabIndex={-1} autoComplete="off" />
            </label>

            <button className="send" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending" : "Send"}
            </button>
            {note ? (
              <p className="note" role="status">
                {note}
              </p>
            ) : null}
            <a className="text-us" href={TEXT_US}>
              Text us directly
            </a>
          </form>
        )}
      </section>
    </main>
  );
}
