import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/content/projects";
import "./coverflow-carousel.css";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function CoverflowCarousel({ showCaption = true }: { showCaption?: boolean }) {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);
  const lockRef = useRef(0);
  const active = PROJECTS[index] ?? PROJECTS[0];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const step = (dir: number) => {
      const now = performance.now();
      if (now < lockRef.current) return false;
      const next = indexRef.current + dir;
      if (next < 0 || next >= PROJECTS.length) return false;
      lockRef.current = now + 520;
      setIndex(next);
      return true;
    };

    const engaged = () => {
      const rect = root.getBoundingClientRect();
      return rect.top < 90 && rect.bottom > window.innerHeight - 90;
    };

    const onWheel = (event: WheelEvent) => {
      if (!engaged()) return;
      const raw = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (Math.abs(raw) < 8) return;
      const dir = raw > 0 ? 1 : -1;
      if (step(dir)) event.preventDefault();
    };

    let lastX = 0;
    let tracking = false;
    let travel = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.buttons !== 0) return;
      const rect = root.getBoundingClientRect();
      const inside =
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right;
      if (!inside) {
        tracking = false;
        travel = 0;
        return;
      }
      if (!tracking) {
        tracking = true;
        lastX = event.clientX;
        return;
      }
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      if (Math.abs(dx) < 1) return;
      travel += dx;
      if (Math.abs(travel) < 72) return;
      step(travel > 0 ? -1 : 1);
      travel = 0;
    };

    let dragX = 0;
    let dragging = false;
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      dragX = event.clientX;
    };
    const onUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      const dx = event.clientX - dragX;
      if (Math.abs(dx) < 36) return;
      step(dx < 0 ? 1 : -1);
    };

    const onKey = (event: KeyboardEvent) => {
      if (!engaged()) return;
      if (event.key === "ArrowRight") {
        if (step(1)) event.preventDefault();
      }
      if (event.key === "ArrowLeft") {
        if (step(-1)) event.preventDefault();
      }
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section className="coverflow" id="index" ref={rootRef} aria-label="Recent projects of 2026">
      <header className="stage-head">
        <p>Selected work</p>
        <h2>Recent projects of 2026</h2>
      </header>

      <div className="stage-rail" aria-live="polite">
        {PROJECTS.map((project, i) => {
          const delta = i - index;
          const distance = Math.abs(delta);
          const hidden = distance > 2;
          const scale = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.36;
          return (
            <button
              key={project.id}
              type="button"
              className={delta === 0 ? "stage-card is-active" : "stage-card"}
              style={{
                ["--tx" as string]: String(delta * 72),
                ["--sc" as string]: String(scale),
                opacity: hidden ? 0 : distance === 0 ? 1 : 0.9,
                zIndex: 10 - distance,
                visibility: hidden ? "hidden" : "visible",
                transitionTimingFunction: EASE,
              }}
              aria-current={delta === 0 ? "true" : undefined}
              aria-label={project.name}
              tabIndex={delta === 0 ? 0 : -1}
              onClick={() => {
                if (delta === 0) {
                  window.location.href = `/projects/${project.id}`;
                  return;
                }
                setIndex(i);
              }}
            >
              <img src={project.image} alt="" draggable={false} />
            </button>
          );
        })}
      </div>

      {showCaption ? (
        <div className="stage-caption">
          <p className="stage-count">
            {String(index + 1).padStart(2, "0")}
            <span> / {String(PROJECTS.length).padStart(2, "0")}</span>
          </p>
          <h3>{active.name}</h3>
          <p className="stage-meta">
            {active.cat}
            <span>{active.host}</span>
          </p>
          <div className="stage-links">
            <a href={`/projects/${active.id}`}>Case study</a>
            <a href={active.href} target="_blank" rel="noreferrer">
              Visit site
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
