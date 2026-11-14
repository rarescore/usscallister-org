import { useEffect, type RefObject } from "react";

type FilmName = "hero" | "close" | "sunset" | "floor";

const HEVC = 'video/mp4; codecs="hvc1.1.6.L120.90"';

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

  if (save || slow) return `/media/${name}-m.mp4?v=3`;
  if (hevc) {
    if (name === "floor" && wide && !phone) return "/media/floor-4k.mp4?v=4";
    return `/media/${name}.h265.mp4?v=4`;
  }
  return phone ? `/media/${name}-m.mp4?v=3` : `/media/${name}.mp4?v=3`;
}

export function useFilm(videoRef: RefObject<HTMLVideoElement | null>, name: FilmName) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      video.src = sourceFor(name);
      video.muted = true;
      const pending = video.play();
      if (pending) pending.catch(() => {});
    };

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
