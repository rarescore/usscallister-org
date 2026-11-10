import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { SiteCheck } from "@/components/site-check";

const COPY =
  "USSCALLISTER is a Los Angeles studio built on one obsession — conversion. Before a single pixel ships, we research the audience, the psychology of the click, and the exact path from first visit to action. That research is why our sites for clinics, contractors, and home services don't just look right, they perform.";

const WORDS = COPY.split(/\s+/);
const WORD_MS = 80;

export const Route = createFileRoute("/info")({
  head: () => ({
    meta: [
      { title: "Info | USSCALLISTER" },
      {
        name: "description",
        content:
          "USSCALLISTER is a Los Angeles studio built on conversion. Research first, then websites for clinics, contractors, and home services that perform.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  const copyRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const copy = copyRef.current;
    const button = buttonRef.current;
    if (!copy) return;

    let cancelled = false;
    const timers: number[] = [];

    const showAll = () => {
      setShown(WORDS.length);
      button?.classList.add("is-in");
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showAll();
      return;
    }

    const revealFrom = (index: number) => {
      if (cancelled) return;
      if (index >= WORDS.length) {
        timers.push(window.setTimeout(() => button?.classList.add("is-in"), 300));
        return;
      }
      timers.push(
        window.setTimeout(() => {
          setShown(index + 1);
          revealFrom(index + 1);
        }, WORD_MS),
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

  return (
    <main className="info info-route">
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
        <FolioBar here="Info" />
        <div className="center-block">
          <p className="kicker-label">Info</p>
          <p ref={copyRef} className="intro-copy info-type">
            {WORDS.map((word, index) => (
              <span key={`${word}-${index}`} className={index < shown ? "is-on" : undefined}>
                {word}{" "}
              </span>
            ))}
          </p>
          <a ref={buttonRef} className="call-us info-reveal" href="tel:8189136158">
            Call us
          </a>
        </div>
        <SiteCheck />
      </div>
    </main>
  );
}
