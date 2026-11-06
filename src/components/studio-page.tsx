import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { FlowTrack } from "@/components/flow-track";
import { StudioFooter } from "@/components/studio-footer";
import { installAudio, playNav, playOpen, setSoundEnabled } from "@/lib/hover-sound";
import { sendStudioNote } from "@/lib/send-note";

const INFO_COPY =
  "USSCALLISTER is an independent creative studio based in Los Angeles. We bring design, development, branding, and film together to create websites that express who you are. Every project takes its own direction, combining distinctive visuals and ambitious interactions with careful attention to speed, accessibility, and search visibility. Built with purpose, tested across devices, and ready for launch.";

export function StudioPage() {
  const heroVideo = useRef<HTMLVideoElement>(null);
  const [clock, setClock] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [away, setAway] = useState(false);
  const [formNote, setFormNote] = useState("");

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
    if (window.location.hash !== "#contact") return;
    const id = window.setTimeout(() => {
      document.getElementById("reel")?.scrollIntoView({ behavior: "auto" });
    }, 800);
    return () => window.clearTimeout(id);
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
      <aside className={away ? "panel is-away" : "panel"}>
        <div className="panel-top">
          <p className="name">USSCALLISTER</p>
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
          <a href="#contact" onPointerEnter={playNav} onClick={() => go("contact")}>
            Contact
          </a>
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
        <div className="hero-dust" aria-hidden="true" />
        <div className="hero-dust hero-dust-near" aria-hidden="true" />
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
          <span>Los Angeles</span>
          <time suppressHydrationWarning>{clock}</time>
        </div>
      </section>

      <FlowTrack
        formNote={formNote}
        onSubmit={onSubmit}
        info={
          <div className="info-hold">
            <div className="center-block">
              <p className="kicker-label">Info</p>
              <p className="intro-copy">{INFO_COPY}</p>
              <a className="call-us" href="tel:8189136158">
                Call us
              </a>
            </div>
            <div className="plain-eq" role="group" aria-label="Handwritten equations: early universe scale factor">
              <p className="eq-sr">
                3) Early universe, radiation-dominated: rho r equals rho 0 over a to the fourth, so a-dot squared
                equals 8 pi G over 3 times rho 0 over a squared, plus 2 Lambda over 3 times a squared. Multiply by a
                squared: a-dot squared equals A plus B a to the fourth, where A equals 8 pi G rho 0 over 3 and B
                equals 2 Lambda over 3. 4) Solve for a of t: Solve for a of t: a-dot equals the
                square root of A plus B a to the fourth. The integral of da over that root equals the integral of
                dt. So a of t equals A over B to the one fourth, times sinh to the one half, of two square root of
                B times t. Diagram: quantum fluctuation (vacuum), then Big Bang at t approximately 0, then inflation with a of
                t proportional to e to the root B t, then branching into parallel universes (multiverse).
              </p>
              <p className="eq-title">
                <span className="ink" style={{ "--i": 0 } as CSSProperties}>
                  3) Early universe (radiation-dominated):
                </span>
              </p>
              <p className="eq-line">
                <span className="ink" style={{ "--i": 1 } as CSSProperties}>
                  ρ
                </span>
                <sub className="ink" style={{ "--i": 2 } as CSSProperties}>
                  r
                </sub>
                <span className="ink" style={{ "--i": 3 } as CSSProperties}>
                  =
                </span>
                <span className="frac ink" style={{ "--i": 4 } as CSSProperties}>
                  <span className="num">ρ₀</span>
                  <span className="bar" />
                  <span className="den">
                    a<sup>4</sup>
                  </span>
                </span>
                <span className="ink" style={{ "--i": 5 } as CSSProperties}>
                  so
                </span>
                <span className="ink" style={{ "--i": 6 } as CSSProperties}>
                  (ȧ)² =
                </span>
                <span className="frac ink" style={{ "--i": 7 } as CSSProperties}>
                  <span className="num">8πG</span>
                  <span className="bar" />
                  <span className="den">3</span>
                </span>
                <span className="frac ink" style={{ "--i": 8 } as CSSProperties}>
                  <span className="num">ρ₀</span>
                  <span className="bar" />
                  <span className="den">
                    a<sup>2</sup>
                  </span>
                </span>
                <span className="ink" style={{ "--i": 9 } as CSSProperties}>
                  +
                </span>
                <span className="frac ink" style={{ "--i": 10 } as CSSProperties}>
                  <span className="num">2Λ</span>
                  <span className="bar" />
                  <span className="den">3</span>
                </span>
                <span className="ink" style={{ "--i": 11 } as CSSProperties}>
                  a²
                </span>
              </p>
              <p className="eq-note">
                <span className="ink" style={{ "--i": 12 } as CSSProperties}>
                  Multiply by a²:
                </span>
                <span className="ink" style={{ "--i": 13 } as CSSProperties}>
                  {" "}
                  ȧ² = A + Ba⁴,
                </span>
                <span className="ink" style={{ "--i": 14 } as CSSProperties}>
                  {" "}
                  where
                </span>
                <span className="ink" style={{ "--i": 15 } as CSSProperties}>
                  {" "}
                  A =
                </span>
                <span className="frac ink" style={{ "--i": 16 } as CSSProperties}>
                  <span className="num">8πGρ₀</span>
                  <span className="bar" />
                  <span className="den">3</span>
                </span>
                <span className="ink" style={{ "--i": 17 } as CSSProperties}>
                  , B =
                </span>
                <span className="frac ink" style={{ "--i": 18 } as CSSProperties}>
                  <span className="num">2Λ</span>
                  <span className="bar" />
                  <span className="den">3</span>
                </span>
              </p>
              <p className="eq-title" style={{ marginTop: 18 }}>
                <span className="ink" style={{ "--i": 19 } as CSSProperties}>
                  4) Solve for a(t):
                </span>
              </p>
              <p className="eq-line">
                <span className="ink" style={{ "--i": 20 } as CSSProperties}>
                  ȧ =
                </span>
                <span className="rad ink" style={{ "--i": 21 } as CSSProperties}>
                  <span>A + Ba⁴</span>
                </span>
                <span className="ink" style={{ "--i": 22 } as CSSProperties}>
                  ⇒
                </span>
                <span className="ink tall" style={{ "--i": 23 } as CSSProperties}>
                  ∫
                </span>
                <span className="frac ink" style={{ "--i": 24 } as CSSProperties}>
                  <span className="num">da</span>
                  <span className="bar" />
                  <span className="den">
                    <span className="rad">
                      <span>A + Ba⁴</span>
                    </span>
                  </span>
                </span>
                <span className="ink" style={{ "--i": 25 } as CSSProperties}>
                  = ∫ dt
                </span>
              </p>
              <p className="eq-note">
                <span className="ink" style={{ "--i": 26 } as CSSProperties}>
                  This gives (using a standard integral):
                </span>
              </p>
              <p className="eq-box">
                <span className="ink" style={{ "--i": 27 } as CSSProperties}>
                  a(t) =
                </span>
                <span className="frac ink" style={{ "--i": 28 } as CSSProperties}>
                  <span className="num">A</span>
                  <span className="bar" />
                  <span className="den">B</span>
                </span>
                <sup className="ink" style={{ "--i": 29 } as CSSProperties}>
                  1/4
                </sup>
                <span className="ink" style={{ "--i": 30 } as CSSProperties}>
                  {" "}
                  sinh
                </span>
                <sup className="ink" style={{ "--i": 31 } as CSSProperties}>
                  1/2
                </sup>
                <span className="ink" style={{ "--i": 32 } as CSSProperties}>
                  (2
                </span>
                <span className="rad ink" style={{ "--i": 33 } as CSSProperties}>
                  <span>B</span>
                </span>
                <span className="ink" style={{ "--i": 34 } as CSSProperties}>
                  {" "}
                  t)
                </span>
              </p>
              <svg className="eq-diagram" viewBox="-30 0 910 205" aria-hidden="true" focusable="false">
                <g className="chalk">
                  <path pathLength={1} style={{ "--i": 35 } as CSSProperties} d="M70 112 c-14 -4 -10 -22 4 -18 c6 -14 26 -8 22 6 c14 2 10 22 -4 18 c-6 12 -26 6 -22 -6z" />
                  <path pathLength={1} style={{ "--i": 36 } as CSSProperties} d="M120 104 C150 101 170 106 196 104 M186 96 L198 104 L186 112" />
                  <path pathLength={1} style={{ "--i": 37 } as CSSProperties} d="M236 104 l14 -16 l4 12 l16 -10 l-6 14 l18 2 l-16 8 l8 14 l-16 -6 l-4 16 l-8 -14 l-14 8 l4 -14 l-14 -6z" />
                  <path pathLength={1} style={{ "--i": 38 } as CSSProperties} d="M300 104 C330 102 350 106 376 104 M366 96 L378 104 L366 112" />
                  <path pathLength={1} style={{ "--i": 39 } as CSSProperties} d="M392 104 C450 102 500 70 580 56 M392 104 C450 106 500 138 580 152" />
                  <path pathLength={1} style={{ "--i": 40 } as CSSProperties} d="M580 56 C640 44 680 30 740 26 M580 56 C640 60 690 70 760 74 M580 152 C640 148 690 136 760 132 M580 152 C640 164 680 176 740 180" />
                  <path pathLength={1} style={{ "--i": 41 } as CSSProperties} d="M752 26 a10 10 0 1 0 0.1 0 M772 74 a10 10 0 1 0 0.1 0 M772 132 a10 10 0 1 0 0.1 0 M752 180 a10 10 0 1 0 0.1 0" />
                </g>
                <g className="chalk-label">
                  <text style={{ "--i": 35 } as CSSProperties} x="80" y="150">quantum fluctuation</text>
                  <text style={{ "--i": 35 } as CSSProperties} x="80" y="174">(vacuum)</text>
                  <text style={{ "--i": 37 } as CSSProperties} x="254" y="64">Big Bang</text>
                  <text style={{ "--i": 37 } as CSSProperties} x="254" y="160">(t ≈ 0)</text>
                  <text style={{ "--i": 39 } as CSSProperties} x="480" y="40">inflation</text>
                  <text style={{ "--i": 39 } as CSSProperties} x="500" y="158">a(t) ∝ e<tspan dy="-10" fontSize="0.7em">√B t</tspan></text>
                  <text style={{ "--i": 41 } as CSSProperties} x="680" y="108">parallel universes</text>
                  <text style={{ "--i": 41 } as CSSProperties} x="680" y="196">(multiverse)</text>
                </g>
              </svg>
            </div>
          </div>
        }
      />
      <StudioFooter />
    </main>
  );
}
