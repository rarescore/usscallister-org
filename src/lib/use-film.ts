import { useEffect, type RefObject } from "react";

export function useFilm(videoRef: RefObject<HTMLVideoElement | null>, desktop: string, mobile: string) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const narrow = window.matchMedia("(max-width: 800px)").matches;
    const src = narrow || connection?.saveData ? mobile : desktop;

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      video.src = src;
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
  }, [desktop, mobile, videoRef]);
}
