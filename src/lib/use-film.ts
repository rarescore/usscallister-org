import { useEffect, type RefObject } from "react";

type FilmName = "hero" | "close" | "floor";

const HERO_M = "/media/hero-boat-m.mp4?v=1";

function sourceFor(name: FilmName) {
  const test = document.createElement("video");
  const hevc = test.canPlayType('video/mp4; codecs="hvc1.1.6.L120.90"') !== "";
  const connection = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
  }).connection;
  const save = Boolean(connection?.saveData);
  const slow =
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "3g" ||
    (typeof connection?.downlink === "number" && connection.downlink < 1.5);
  const phone = window.matchMedia("(max-width: 800px)").matches;

  if (name === "hero") return HERO_M;

  if (name === "close") {
    if (phone) return "/media/close-pool-m.mp4?v=1";
    if (save || slow) return "/media/close-m.mp4?v=6";
    return "/media/close.mp4?v=6";
  }

  if (save || slow || phone) return "/media/floor-m.mp4?v=3";
  if (hevc) return "/media/floor.h265.mp4?v=5";
  return "/media/floor.mp4?v=5";
}

export function useFilm(videoRef: RefObject<HTMLVideoElement | null>, name: FilmName) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let started = false;
    let retry = 0;
    let kick = () => {};
    const onGesture = () => kick();
    const start = () => {
      if (started) return;
      started = true;
      const next = sourceFor(name);
      const current = video.currentSrc
        ? (() => {
            const url = new URL(video.currentSrc);
            return url.pathname + url.search;
          })()
        : "";
      if (current !== next) video.src = next;
      const phone = window.matchMedia("(max-width: 800px)").matches;
      if (name === "close" && phone) {
        video.poster = "/media/close-pool-poster.jpg?v=1";
      }
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      kick = () => {
        if (!video.paused && video.readyState >= 2) return;
        const pending = video.play();
        if (pending) pending.catch(() => {});
      };
      kick();
      video.addEventListener("canplay", kick);
      video.addEventListener("loadeddata", kick);
      window.addEventListener("pointerdown", onGesture, { once: true });
      retry = window.setTimeout(kick, 700);
    };

    if (name === "hero") {
      if (window.matchMedia("(max-width: 800px)").matches) start();
      return () => {
        window.clearTimeout(retry);
        video.removeEventListener("canplay", kick);
        video.removeEventListener("loadeddata", kick);
        window.removeEventListener("pointerdown", onGesture);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { rootMargin: "180px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [name, videoRef]);
}
