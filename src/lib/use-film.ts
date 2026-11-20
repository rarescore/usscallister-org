import { useEffect, type RefObject } from "react";

type FilmName = "hero" | "close" | "sunset" | "floor";

const HEVC = 'video/mp4; codecs="hvc1.1.6.L120.90"';
const HERO = "/media/hero-boat.mp4?v=1";
const HERO_M = "/media/hero-boat-m.mp4?v=1";

function sourceFor(name: FilmName) {
  const test = document.createElement("video");
  const hevc = test.canPlayType(HEVC) !== "";
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
  const wide = window.matchMedia("(min-width: 1200px)").matches;

  if (name === "hero") {
    if (save || slow || phone) return HERO_M;
    return HERO;
  }

  if (name === "close") {
    if (phone) return "/media/close-pool-m.mp4?v=1";
    if (save || slow) return "/media/close-m.mp4?v=6";
    return "/media/close.mp4?v=6";
  }

  if (save || slow) return `/media/${name}-m.mp4?v=3`;
  if (hevc) {
    if (name === "floor" && wide && !phone) return "/media/floor-4k.mp4?v=5";
    if (name === "floor") return "/media/floor.h265.mp4?v=5";
    return `/media/${name}.h265.mp4?v=4`;
  }
  if (name === "floor") return "/media/floor.mp4?v=5";
  return phone ? `/media/${name}-m.mp4?v=3` : `/media/${name}.mp4?v=3`;
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
      if (name === "hero" && phone) video.playbackRate = 1.2;
      kick = () => {
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
