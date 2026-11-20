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
  const [ready, setReady] = useState<string | null>(null);
  const [wide, setWide] = useState(false);
  const active = PROJECTS[index] ?? PROJECTS[0];
  const live = wide ? LIVE[active.id] : null;

  useEffect(() => {
    const id = window.setTimeout(() => setLiveId(active.id), 160);
    return () => window.clearTimeout(id);
  }, [active.id]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 801px)");
    const apply = () => setWide(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

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
                    onClick={() => jump(i)}
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {project.cat}
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
                {live ? (
                  <iframe
                    key={liveId}
                    ref={frameRef}
                    className={ready === liveId ? "is-on" : undefined}
                    src={LIVE[liveId] ?? undefined}
                    title={PROJECTS.find((project) => project.id === liveId)?.name ?? "Project"}
                  />
                ) : null}
              </div>
            </div>
          </figure>

          <footer className="reel-foot">
            <div>
              <p className="reel-kicker">
                {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
              </p>
              <h2 className="reel-title" key={active.id}>
                {active.cat}
              </h2>
              <p className="reel-note">{active.note}</p>
            </div>
            <div className="reel-links">
              <a href={active.href} target="_blank" rel="noreferrer">
                Visit the site
              </a>
              <a
                href="#reel"
                onClick={(event) => {
                  event.preventDefault();
                  seedBrief(active.cat);
                }}
              >
                Start one like this
              </a>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
