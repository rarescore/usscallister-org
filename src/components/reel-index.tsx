import { useEffect, useRef, useState } from "react";
import { PROJECTS } from "@/content/projects";
import { getLenis } from "@/lib/use-lenis";
import "./reel-index.css";

function scrollTo(target: HTMLElement | number) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target);
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth" });
}

function seedBrief(name: string) {
  const form = document.getElementById("contact");
  const brief = form?.querySelector<HTMLTextAreaElement>("textarea[name='brief']");
  if (brief && !brief.value.trim()) brief.value = `A site in the vein of ${name}.`;
  const reel = document.getElementById("reel");
  if (reel) scrollTo(reel);
  window.setTimeout(() => {
    form?.querySelector<HTMLInputElement>("input[name='name']")?.focus();
  }, 400);
}

const LIVE: Record<string, string | null> = {
  canby: "https://www.puravidacc.org/",
  citium: "https://www.citiumroofing.com/",
  clean: "https://www.extremequalityclean.com/",
  rarescore: null,
  plumbing: "https://www.myplumbinginc.com/",
  rooter: "https://www.rooter-plumber.com/",
};

export function ReelIndex({ underBar = false }: { underBar?: boolean }) {
  const [index, setIndex] = useState(0);
  const [liveId, setLiveId] = useState(PROJECTS[0].id);
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [ready, setReady] = useState<string | null>(null);
  const active = PROJECTS[index] ?? PROJECTS[0];
  const live = LIVE[active.id];

  useEffect(() => {
    const id = window.setTimeout(() => setLiveId(active.id), 160);
    return () => window.clearTimeout(id);
  }, [active.id]);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = windowRef.current;
    if (!box) return;
    const fit = () => box.style.setProperty("--fit", String(box.clientWidth / 1920));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    const src = LIVE[liveId];
    if (!frame || !src) return;
    const show = () => setReady(liveId);
    const seen = () => {
      try {
        const url = frame.contentDocument?.URL ?? "";
        if (url && url !== "about:blank") show();
      } catch {
        show();
      }
    };
    seen();
    frame.addEventListener("load", show);
    const backup = window.setTimeout(show, 2200);
    return () => {
      frame.removeEventListener("load", show);
      window.clearTimeout(backup);
    };
  }, [liveId]);

  function jump(next: number) {
    setIndex(next);
  }

  function openProject(next = index) {
    setIndex(next);
    setFull(false);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section
      className={underBar ? "reel-index is-under-bar" : "reel-index"}
      id="index"
      aria-label="Selected work"
    >
      <div className="reel-sticky">
        <div className="reel-stage">
          <aside className="reel-rail">
            <p className="reel-kicker">Selected work</p>
            <p className="reel-kicker reel-place">Los Angeles, 2026</p>
            <ol className="reel-list">
              {PROJECTS.map((project, i) => (
                <li key={project.id}>
                  <button
                    type="button"
                    aria-current={i === index ? "true" : undefined}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") jump(i);
                    }}
                    onClick={() => openProject(i)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {project.short}
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          <figure className="reel-frame">
            <div className="reel-mat">
              <div className="reel-window" ref={windowRef}>
                <img
                  className={live && ready === liveId && liveId === active.id ? "is-off" : "is-on"}
                  src={active.image.replace(".jpg", "@2x.jpg")}
                  alt=""
                  width={2880}
                  height={1800}
                  draggable={false}
                />
                {LIVE[liveId] ? (
                  <iframe
                    key={liveId}
                    ref={frameRef}
                    className={ready === liveId ? "is-on" : undefined}
                    src={LIVE[liveId] ?? undefined}
                    title={PROJECTS.find((project) => project.id === liveId)?.name ?? "Project"}
                  />
                ) : null}
                <button className="reel-open" type="button" onClick={() => openProject()}>
                  Open
                </button>
              </div>
            </div>
          </figure>

          <footer className="reel-foot">
            <div>
              <p className="reel-kicker">
                {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
                <span> {active.cat}</span>
              </p>
              <h2 className="reel-title" key={active.id}>
                {active.short}
              </h2>
              <p className="reel-note">{active.note}</p>
            </div>
            <div className="reel-links">
              <a href={active.href} target="_blank" rel="noreferrer">
                {active.host}
              </a>
              <a
                href="#reel"
                onClick={(event) => {
                  event.preventDefault();
                  seedBrief(active.name);
                }}
              >
                Start one like this
              </a>
            </div>
          </footer>
        </div>
      </div>
      {open ? (
        <div className={full ? "project-stage is-full" : "project-stage"} role="dialog" aria-modal="true" aria-label={active.name}>
          <div className="project-bar">
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
            <button type="button" onClick={() => setFull((value) => !value)}>
              {full ? "Frame" : "Expand"}
            </button>
            <a href={active.href} target="_blank" rel="noreferrer">
              Live website
            </a>
          </div>
          <p className="project-edge">{active.short}</p>
          <div className="project-screen">
            {LIVE[active.id] ? (
              <iframe src={LIVE[active.id] ?? undefined} title={active.name} />
            ) : (
              <img src={active.image.replace(".jpg", "@2x.jpg")} alt={active.name} />
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
