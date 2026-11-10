import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { FlowTrack } from "@/components/flow-track";
import { StudioFooter } from "@/components/studio-footer";
import { installAudio, playNav, playOpen, setSoundEnabled } from "@/lib/hover-sound";
import { sendStudioNote } from "@/lib/send-note";

const PRINCIPLES = [
  "Motion earns its place.",
  "Speed is a design decision, not a compromise.",
  "Accessibility isn't a checkbox, it's the baseline.",
  "If it doesn't work on a phone in bad light, it doesn't work.",
  "We build for the person who almost left.",
];

const HERO_MARK = "Los Angeles".split(" ");

export function StudioPage() {
  const heroVideo = useRef<HTMLVideoElement>(null);
  const [clock, setClock] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [away, setAway] = useState(false);
  const [formNote, setFormNote] = useState("");
  const [logoReveal, setLogoReveal] = useState(false);

  useEffect(() => installAudio(), []);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home");
      setAway(!!hero && hero.getBoundingClientRect().bottom < 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("ussc-logo-seen")) return;
    sessionStorage.setItem("ussc-logo-seen", "1");
    const id = window.setTimeout(() => setLogoReveal(true), 600);
    const hide = window.setTimeout(() => setLogoReveal(false), 3200);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(hide);
    };
  }, []);

  function replayHero() {
    const video = heroVideo.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
  }

  function go(id: string) {
    const target = document.getElementById(id === "contact" ? "reel" : id);
    target?.scrollIntoView({ behavior: "auto" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    playOpen();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const brief = String(data.get("brief") || "").trim();
    const trap = String(data.get("company") || "").trim();
    if (!name || !email.includes("@")) {
      setFormNote("Name and email.");
      return;
    }
    setFormNote("Sending.");
    try {
      await sendStudioNote({ kind: "project", name, email, phone, brief, trap });
      setFormNote("Message has been sent.");
    } catch {
      setFormNote("Could not send. Write to usscallisterllc@gmail.com.");
    }
  }

  return (
    <main>
      {logoReveal ? (
        <div className="logo-reveal" aria-hidden="true">
          <svg viewBox="0 0 400 60" className="logo-draw">
            <path
              d="M20 48 C20 20 60 12 90 12 C130 12 150 28 150 44 C150 58 120 64 96 64 C64 64 40 52 40 32 C40 16 68 8 100 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              pathLength={1}
              className="logo-path"
            />
            <text x="170" y="42" fill="currentColor" fontSize="28" fontFamily="Cormorant Garamond, serif" letterSpacing="0.18em">
              USSCALLISTER
            </text>
          </svg>
        </div>
      ) : null}
      <a className="skip" href="#index">
        Skip to projects
      </a>
      <aside className={away ? "panel is-away" : "panel"} style={{"-webkit-backdrop-filter": "blur(24px) saturate(1.4)", backdropFilter: "blur(24px) saturate(1.4)"} as CSSProperties}>
        <div className="panel-top">
          <h1 className="name">USSCALLISTER</h1>
        </div>
        <nav className="nav" aria-label="Studio">
          <a href="#home" onPointerEnter={playNav} onClick={() => go("home")}>
            Home
          </a>
          <a href="#index" onPointerEnter={playNav} onClick={() => go("index")}>
            Projects
          </a>
          <a href="#info" onPointerEnter={playNav} onClick={() => go("info")}>
            Info
          </a>
          <Link to="/journal" onPointerEnter={playNav}">
            Journal
          </Link>
          <Link to="/contact" onPointerEnter={playNav}">
            Contact
          </Link>
        </nav>
        <p className="meta">
          <a href="mailto:usscallisterllc@gmail.com" onPointerEnter={playNav}">
            usscallisterllc@gmail.com
          </a>
        </p>
        <button
          className="sound"
          type="button"
          aria-pressed={soundOn}
          onClick={() => {
            const next = !soundOn;
            setSoundOn(next);
            setSoundEnabled(next);
            if (next) playOpen();
          }}}
        >
          <i aria-hidden="true" />
          {soundOn ? "Sound on" : "Sound off"}
        </button>
      </aside>

      <section className="hero" id="home">
        <video
          ref={heroVideo}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero-poster.jpg?v=2"
          preload="metadata"
          onEnded={(event) => {
            event.currentTarget.currentTime = 0;
            void event.currentTarget.play();
          }}}
        >
          <source src="/media/hero.mp4?v=2" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-mark">
          <button className="hero-replay" type="button" onClick={replayHero} aria-label="Replay film">
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path
                d="M3.2 8a4.8 4.8 0 1 0 1.2-3.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path d="M3 2.2v3.2h3.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Replay
          </button>
          <span className="hero-mark-text">
            {HERO_MARK.map((word, i) => (
              <span key={word} className="split-word" style={{"--i": i} as CSSProperties}>
                {word}
              </span>
            ))}
          </span>
          <time suppressHydrationWarning className="split-word" style={{"--i": HERO_MARK.length} as CSSProperties}>
            {clock}
          </time>
        </div>
        <div className="hero-bottom">
          <p className="hero-tagline">Independent creative studio</p>
        </div>
      </section>

      <FlowTrack
        formNote={formNote}
        onSubmit={onSubmit}
        info={
          <div className="info-hold">
            <div className="center-block">
              <p className="kicker-label">Info</p>
              <p className="intro-copy">
                USSCALLISTER is an independent creative studio based in Los Angeles. We bring design, development, branding, and film together to create websites that express who you are.
              </p>
              <a className="call-us" href="tel:8189136158">
                Call us
              </a>
            </div>
            <div className="principles" role="group" aria-label="Studio principles">
              {PRINCIPLES.map((principle, i) => (
                <p key={principle} className="principle">
                  <span className="principle-num">{String(i + 1).padStart(2, "0")}</span>
                  {principle}
                </p>
              ))}
            </div>
          </div>
        }
      />
      <StudioFooter />
    </main>
  );
}
