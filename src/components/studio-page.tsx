import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { FlowTrack } from "@/components/flow-track";
import { SiteCheck } from "@/components/site-check";
import { StudioFooter } from "@/components/studio-footer";
import { installAudio, playNav, playOpen, setSoundEnabled } from "@/lib/hover-sound";
import { sendStudioNote } from "@/lib/send-note";

const HERO_MARK = "Los Angeles".split(" ");

const INFO_WORDS =
  "USSCALLISTER is a Los Angeles studio built on one obsession — conversion. Before a single pixel ships, we research the audience, the psychology of the click, and the exact path from first visit to action. That research is why our sites for clinics, contractors, and home services don't just look right, they perform.".split(
    /\s+/,
  );

export function StudioPage() {
  const heroVideo = useRef<HTMLVideoElement>(null);
  const infoCopyRef = useRef<HTMLParagraphElement>(null);
  const infoButtonRef = useRef<HTMLAnchorElement>(null);
  const [clock, setClock] = useState("");
  const [infoShown, setInfoShown] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [away, setAway] = useState(false);
  const [formNote, setFormNote] = useState("");

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
    const copy = infoCopyRef.current;
    const button = infoButtonRef.current;
    if (!copy) return;

    let cancelled = false;
    const timers: number[] = [];

    const showAll = () => {
      setInfoShown(INFO_WORDS.length);
      button?.classList.add("is-in");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showAll();
      return;
    }

    const revealFrom = (index: number) => {
      if (cancelled) return;
      if (index >= INFO_WORDS.length) {
        timers.push(window.setTimeout(() => button?.classList.add("is-in"), 300));
        return;
      }
      timers.push(
        window.setTimeout(() => {
          setInfoShown(index + 1);
          revealFrom(index + 1);
        }, 80),
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        revealFrom(0);
      },
      { threshold: 0.3 },
    );
    observer.observe(copy);

    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
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
      <a className="skip" href="#index">
        Skip to projects
      </a>
      <aside
        className={away ? "panel is-away" : "panel"}
        style={
          {
            WebkitBackdropFilter: "blur(24px) saturate(1.4)",
            backdropFilter: "blur(24px) saturate(1.4)",
          } as CSSProperties
        }
      >
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
            poster="/media/hero-poster.jpg?v=2"
            preload="metadata"
            onEnded={(event) => {
              event.currentTarget.currentTime = 0;
              void event.currentTarget.play();
            }}
          >
            <source src="/media/hero.mp4?v=2" type="video/mp4" />
          </video>
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
          <p className="hero-support">we build websites.</p>
        </div>
      </section>

      <FlowTrack
        formNote={formNote}
        onSubmit={onSubmit}
        info={
          <>
            <video
              className="info-bg"
              src="/media/sunset.mp4"
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
            <div className="info-shade" aria-hidden="true" />
            <div className="info-hold">
              <div className="center-block">
                <p className="kicker-label">Info</p>
                <p ref={infoCopyRef} className="intro-copy info-type">
                  {INFO_WORDS.map((word, index) => (
                    <span key={`${word}-${index}`} className={index < infoShown ? "is-on" : undefined}>
                      {word}{" "}
                    </span>
                  ))}
                </p>
                <a ref={infoButtonRef} className="call-us info-reveal" href="tel:8189136158">
                  Call us
                </a>
              </div>
              <SiteCheck />
            </div>
          </>
        }
      />
      <StudioFooter />
    </main>
  );
}
