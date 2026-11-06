import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { EnterReel } from "@/components/enter-reel";
import { CoverflowCarousel } from "@/components/coverflow-carousel";
import "./flow-track.css";

type FlowTrackProps = {
  info: ReactNode;
  formNote: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function FlowTrack({ info, formNote, onSubmit }: FlowTrackProps) {
  const flowRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 800px), (prefers-reduced-motion: reduce)");
    const apply = () => setSimple(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const infoEl = infoRef.current;
    if (!infoEl || simple) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const plate = infoEl.querySelector<HTMLElement>(".plain-eq") ?? infoEl;
        ScrollTrigger.create({
          trigger: plate,
          start: "top 85%",
          end: "top 18%",
          scrub: 0.3,
          onUpdate: (self) => plate.style.setProperty("--write", self.progress.toFixed(3)),
        });
      }, infoEl);
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [simple]);

  return (
    <div className={simple ? "flow is-simple" : "flow"} ref={flowRef}>
      <CoverflowCarousel showCaption />
      <section className="section info" id="info" ref={infoRef}>
        {info}
      </section>
      <EnterReel formNote={formNote} onSubmit={onSubmit} />
    </div>
  );
}
