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
      const reel = document.getElementById("reel");
      const pastHero = !!hero && hero.getBoundingClientRect().bottom < 80;
      const formOnScreen = !!reel && reel.getBoundingClientRect().top < window.innerHeight * 0.55;
      setAway(pastHero && !formOnScreen);
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
      <aside className={away ? "panel is-away" : "panel"}>
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
          <Link to="/journal" onPointerEnter={playNav}>
            Journal
          </Link>
          <Link to="/contact" onPointerEnter={playNav}>
            Contact
          </Link>
        </nav>
        <div className="panel-foot">
          <p className="meta">
            <a href="tel:8189136158" onPointerEnter={playNav}>
              818-913-6158
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
            poster="/media/hero-poster.jpg?v=6"
            preload="auto"
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                "(function(){var v=document.querySelector('.hero-video');if(!v||v.getAttribute('src')||v.currentSrc)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=navigator.connection;var slow=!!(c&&(c.saveData||c.effectiveType==='slow-2g'||c.effectiveType==='2g'||c.effectiveType==='3g'||(typeof c.downlink==='number'&&c.downlink<1.5)));var phone=matchMedia('(max-width: 800px)').matches;var hevc=document.createElement('video').canPlayType('video/mp4; codecs=\"hvc1.1.6.L120.90\"')!=='';v.src=slow||phone?'/media/hero-m.mp4?v=6':(hevc?'/media/hero-4k.h265.mp4?v=7':'/media/hero-4k.mp4?v=7');})();",
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
          <div className="hero-actions">
            <a
              className="hero-brief"
              href="#reel"
              onClick={(event) => {
                event.preventDefault();
                go("contact");
              }}
            >
              Start a brief
            </a>
            <a className="hero-call" href="tel:8189136158">
              818-913-6158
            </a>
          </div>
        </div>
      </section>

      <FlowTrack formNote={formNote} onSubmit={onSubmit} />
      <StudioFooter />
      <div className={away ? "convert-bar is-on" : "convert-bar"}>
        <a href="tel:8189136158">Call</a>
        <a
          href="#reel"
          onClick={(event) => {
            event.preventDefault();
            go("contact");
          }}
        >
          Start a brief
        </a>
      </div>
    </main>
  );
}
