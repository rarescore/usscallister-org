import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { FlowTrack } from "@/components/flow-track";
import { StudioFooter } from "@/components/studio-footer";
import { installAudio, playNav, playOpen, setSoundEnabled } from "@/lib/hover-sound";
import { getLenis } from "@/lib/use-lenis";
import { sendStudioNote } from "@/lib/send-note";
import { useFilm } from "@/lib/use-film";

const HERO_MARK = "Los Angeles".split(" ");

export function StudioPage() {
  const heroVideo = useRef<HTMLVideoElement>(null);
  const [clock, setClock] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [away, setAway] = useState(false);
  const [formNote, setFormNote] = useState("");
  const [leadNote, setLeadNote] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useFilm(heroVideo, "hero");
  useEffect(() => installAudio(), []);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "America/Los_Angeles",
          hour12: true,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("home");
      const pastHero = !!hero && hero.getBoundingClientRect().bottom < 80;
      setAway(pastHero);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function replayHero() {
    const video = heroVideo.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
  }

  function go(id: string) {
    const target = document.getElementById(id === "contact" ? "reel" : id);
    const lenis = getLenis();
    if (lenis && target) lenis.scrollTo(target);
    else target?.scrollIntoView({ behavior: "auto" });
  }

  async function onLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    playOpen();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const companyName = String(data.get("companyName") || "").trim();
    const trap = String(data.get("company") || "").trim();
    if (!name || !email.includes("@")) {
      setLeadNote("Name and email.");
      return;
    }
    setLeadNote("Sending.");
    try {
      await sendStudioNote({
        kind: "project",
        name,
        email,
        phone,
        brief: companyName ? `Company: ${companyName}` : "",
        trap,
      });
      setLeadNote("Message has been sent.");
      event.currentTarget.reset();
    } catch {
      setLeadNote("Could not send. Write to usscallisterllc@gmail.com.");
    }
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
      <a className="skip" href="#index">
        Skip to projects
      </a>
      <aside className={away ? "panel is-away" : menuOpen ? "panel is-menu" : "panel"}>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <div className="panel-top">
          <h1 className="name">USSCALLISTER</h1>
        </div>
        <nav className="nav" aria-label="Studio">
          <a href="#home" onPointerEnter={playNav} onClick={() => { setMenuOpen(false); go("home"); }}>
            Home
          </a>
          <a href="#index" onPointerEnter={playNav} onClick={() => { setMenuOpen(false); go("index"); }}>
            Projects
          </a>
          <Link to="/journal" onPointerEnter={playNav} onClick={() => setMenuOpen(false)}>
            Journal
          </Link>
          <Link to="/contact" onPointerEnter={playNav} onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </nav>
        <div className="panel-foot">
          <p className="meta">
            <a href="mailto:usscallisterllc@gmail.com" onPointerEnter={playNav}>
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
            }}
          >
            <i aria-hidden="true" />
            {soundOn ? "Sound on" : "Sound off"}
          </button>
        </div>
      </aside>

      <section className="hero" id="home">
        <div className="hero-drift">
          <video
            ref={heroVideo}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/media/hero-boat-poster.jpg?v=1"
            preload="auto"
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                "(function(){var v=document.querySelector('.hero-video');if(!v||v.getAttribute('src')||v.currentSrc)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=navigator.connection;var slow=!!(c&&(c.saveData||c.effectiveType==='slow-2g'||c.effectiveType==='2g'||c.effectiveType==='3g'||(typeof c.downlink==='number'&&c.downlink<1.5)));var phone=matchMedia('(max-width: 800px)').matches;v.src=slow||phone?'/media/hero-boat-m.mp4?v=1':'/media/hero-boat.mp4?v=1';})();",
            }}
          />
        </div>
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
              <span key={word} className="split-word" style={{ "--i": i } as CSSProperties}>
                {word}
              </span>
            ))}
          </span>
          <time suppressHydrationWarning className="split-word" style={{ "--i": HERO_MARK.length } as CSSProperties}>
            {clock}
          </time>
        </div>
        <div className="hero-bottom">
          <p className="hero-tagline">Independent creative studio</p>
          <p className="hero-support">We build websites.</p>
        </div>
        <form className="lead-card" onSubmit={onLead}>
          <input className="trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <label>
            Name
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            Company
            <input name="companyName" type="text" autoComplete="organization" />
          </label>
          <label>
            Number
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <button type="submit">Send</button>
          {leadNote ? <p className="lead-note">{leadNote}</p> : null}
        </form>
      </section>

      <FlowTrack formNote={formNote} onSubmit={onSubmit} />
      <StudioFooter />
    </main>
  );
}
