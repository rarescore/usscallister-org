import { useEffect, useRef, useState, type FormEvent } from "react";
import { EnterReel } from "@/components/enter-reel";
import { ReelIndex } from "@/components/reel-index";
import "./flow-track.css";

type FlowTrackProps = {
  formNote: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function FlowTrack({ formNote, onSubmit }: FlowTrackProps) {
  const flowRef = useRef<HTMLDivElement>(null);
  const [simple, setSimple] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 800px), (prefers-reduced-motion: reduce)");
    const apply = () => setSimple(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <div className={simple ? "flow is-simple" : "flow"} ref={flowRef}>
      <ReelIndex />
      <EnterReel formNote={formNote} onSubmit={onSubmit} />
    </div>
  );
}
