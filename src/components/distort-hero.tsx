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

type Piece = {
  el: HTMLElement;
  dx: number;
  dy: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  ox: number;
  oy: number;
};

function bindScatter(title: Element | null, root: HTMLElement) {
  if (!(title instanceof HTMLElement)) return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pieces: Piece[] = [];
  let scattered = false;
  let drag: Piece | null = null;
  let grabX = 0;
  let grabY = 0;

  const paint = (piece: Piece) => {
    piece.el.style.transform = `translate3d(${piece.dx + piece.ox}px, ${piece.dy + piece.oy}px, ${piece.z}px) rotateX(${piece.rx}deg) rotateY(${piece.ry}deg) rotateZ(${piece.rz}deg)`;
  };
  const scatter = () => {
    if (reduced.matches || scattered || !root.classList.contains("is-pressed")) return;
    const letters = [...title.querySelectorAll(".ch")] as HTMLElement[];
    if (!letters.length) return;
    scattered = true;
    root.classList.add("is-live");
    title.classList.add("is-scattered");
    pieces = letters.map((el) => {
      const rect = el.getBoundingClientRect();
      const span = Math.max(48, Math.min(rect.width, rect.height, 180));
      const x = 16 + Math.random() * Math.max(40, window.innerWidth - span - 32);
      const y = 16 + Math.random() * Math.max(40, window.innerHeight - span - 32);
      const piece: Piece = {
        el,
        dx: x - rect.left,
        dy: y - rect.top,
        z: (Math.random() - 0.4) * 420,
        rx: (Math.random() - 0.5) * 70,
        ry: (Math.random() - 0.5) * 140,
        rz: (Math.random() - 0.5) * 50,
        ox: 0,
        oy: 0,
      };
      paint(piece);
      return piece;
    });
  };
  const nudge = (clientX: number, clientY: number) => {
    for (const piece of pieces) {
      if (piece === drag) continue;
      const rect = piece.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = cx - clientX;
      const dy = cy - clientY;
      const dist = Math.hypot(dx, dy) || 1;
      const push = Math.max(0, 220 - dist) / 220;
      piece.ox = (dx / dist) * push * 140;
      piece.oy = (dy / dist) * push * 110;
      paint(piece);
    }
  };
  const gather = () => {
    if (!scattered) return;
    scattered = false;
    drag = null;
    for (const piece of pieces) {
      piece.ox = 0;
      piece.oy = 0;
      piece.dx = 0;
      piece.dy = 0;
      piece.z = 0;
      piece.rx = 0;
      piece.ry = 0;
      piece.rz = 0;
      paint(piece);
    }
    window.setTimeout(() => {
      if (scattered) return;
      title.classList.remove("is-scattered");
      root.classList.remove("is-live");
      for (const piece of pieces) piece.el.style.transform = "";
      pieces = [];
    }, 720);
  };
  const onEnter = () => scatter();
  const onDown = (event: PointerEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const el = target.closest(".ch");
    const piece = pieces.find((item) => item.el === el);
    if (!piece || !scattered) return;
    event.preventDefault();
    drag = piece;
    piece.el.setPointerCapture(event.pointerId);
    const rect = piece.el.getBoundingClientRect();
    grabX = event.clientX - rect.left;
    grabY = event.clientY - rect.top;
    piece.el.style.transition = "none";
    piece.z = 180;
  };
  const onMove = (event: PointerEvent) => {
    if (!scattered) return;
    if (drag) {
      const rect = drag.el.getBoundingClientRect();
      drag.dx += event.clientX - grabX - rect.left;
      drag.dy += event.clientY - grabY - rect.top;
      drag.ry = (event.clientX / window.innerWidth - 0.5) * 80;
      drag.rx = (0.5 - event.clientY / window.innerHeight) * 50;
      paint(drag);
      return;
    }
    nudge(event.clientX, event.clientY);
  };
  const onUp = () => {
    if (!drag) return;
    drag.el.style.transition = "";
    drag = null;
  };
  const onLeave = (event: PointerEvent) => {
    if (drag) return;
    const next = event.relatedTarget;
    if (next instanceof Node && root.contains(next)) return;
    gather();
  };

  title.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointerdown", onDown);
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerup", onUp);
  root.addEventListener("pointerleave", onLeave);

  return () => {
    title.removeEventListener("pointerenter", onEnter);
    root.removeEventListener("pointerdown", onDown);
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerup", onUp);
    root.removeEventListener("pointerleave", onLeave);
  };
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

    const narrow = window.matchMedia("(max-width: 800px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let userPaused = reduced.matches;
    const play = () => {
      if (narrow.matches || reduced.matches) return;
      if (!video.getAttribute("src")) video.src = "/media/distort-hero.mp4";
      void video.play().catch(() => {});
    };
    const silence = () => {
      video.pause();
      if (video.getAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
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
      if (narrow.matches) return;
      if (document.hidden) video.pause();
      else if (!userPaused && !reduced.matches) play();
    };
    const onMode = () => {
      if (narrow.matches) silence();
      else if (!userPaused) play();
    };

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    pause.addEventListener("click", onPauseClick);
    document.addEventListener("visibilitychange", onVisible);
    narrow.addEventListener("change", onMode);
    if (narrow.matches) silence();
    else if (!reduced.matches) play();
    else pause.textContent = "Play film ▷";
    const stopBend = attachBend({ video, parent: film, track: hero, hold });
    const stopScatter = bindScatter(hero.querySelector(".x-hero-title"), hero);
    const phoneTitle = document.querySelector(".hero .bend-title");
    const phone = phoneTitle?.closest(".hero");
    const stopPhone = phoneTitle instanceof HTMLElement && phone instanceof HTMLElement ? bindScatter(phoneTitle, phone) : () => {};

    return () => {
      stopScatter();
      stopPhone();
      stopBend();
      video.pause();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      pause.removeEventListener("click", onPauseClick);
      document.removeEventListener("visibilitychange", onVisible);
      narrow.removeEventListener("change", onMode);
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
        <p className="x-build">We build websites.</p>
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
