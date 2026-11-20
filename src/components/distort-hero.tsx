import { useEffect, useRef, type CSSProperties } from "react";
import { attachBend } from "@/lib/bend-film";
import "./distort-hero.css";

export function BendWords({ text }: { text: string }) {
  let index = 0;
  return (
    <>
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i} className="ch-gap"> </span>;
        const n = index++;
        return (
          <span key={i} className="ch" style={{ "--i": n } as CSSProperties}>
            {ch}
          </span>
        );
      })}
    </>
  );
}

export function DistortHero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdRef = useRef<HTMLButtonElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    const hold = holdRef.current;
    const pause = pauseRef.current;
    const film = hero?.querySelector(".x-film");
    if (!hero || !video || !hold || !pause || !(film instanceof HTMLElement)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let userPaused = reduced.matches;
    const play = () => {
      if (!video.getAttribute("src")) video.src = "/media/distort-hero.mp4";
      void video.play().catch(() => {});
    };
    const onPlay = () => {
      pause.textContent = "Pause film Ⅱ";
      pause.setAttribute("aria-label", "Pause background film");
    };
    const onPause = () => {
      pause.textContent = "Play film ▷";
      pause.setAttribute("aria-label", "Play background film");
    };
    const onPauseClick = () => {
      userPaused = !video.paused;
      if (video.paused) play();
      else video.pause();
    };
    const onVisible = () => {
      if (document.hidden) video.pause();
      else if (!userPaused && !reduced.matches) play();
    };

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    pause.addEventListener("click", onPauseClick);
    document.addEventListener("visibilitychange", onVisible);
    if (!reduced.matches) play();
    else pause.textContent = "Play film ▷";
    const stopBend = attachBend({ video, parent: film, track: hero, hold });

    return () => {
      stopBend();
      video.pause();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      pause.removeEventListener("click", onPauseClick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <div className="distort-hero">
      <section className="x-hero" ref={heroRef} aria-label="Hold to bend reality">
        <div className="x-film">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster="/media/distort-poster.jpg"
            aria-label="Studio visual film"
          />
          <div className="x-film-shade" />
        </div>
        <div className="x-hero-top">
          <span>DESIGN + CODE + MOTION</span>
          <span className="x-live-dot">Independent. Unconventional.</span>
        </div>
        <div className="x-hero-title">
          <h1>
            <span className="bend-line">
              <BendWords text="MAKE IT" />
            </span>
            <span className="bend-line x-outline">
              <BendWords text="UNREAL." />
            </span>
          </h1>
        </div>
        <div className="x-hero-bottom">
          <button ref={holdRef} className="x-distort" type="button" aria-label="Hold to distort the film">
            <span className="x-press-icon" aria-hidden="true" />
            <span>Hold to bend reality</span>
          </button>
          <button ref={pauseRef} className="x-film-pause" type="button" aria-label="Pause background film">
            Pause film Ⅱ
          </button>
        </div>
        <span className="x-edge-label" aria-hidden="true">
          USSC / DIGITAL / 2026
        </span>
      </section>
    </div>
  );
}
