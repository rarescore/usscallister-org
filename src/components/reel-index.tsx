import { useState } from "react";
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

export function ReelIndex({ underBar = false }: { underBar?: boolean }) {
  const [index, setIndex] = useState(0);
  const active = PROJECTS[index] ?? PROJECTS[0];

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
                    {project.short}
                  </button>
                </li>
              ))}
            </ol>
          </aside>

          <figure className="reel-frame">
            <div className="reel-mat">
              <div className="reel-window">
                {PROJECTS.map((project, i) => (
                  <img
                    key={project.id}
                    className={i === index ? "is-on" : undefined}
                    src={project.image}
                    srcSet={`${project.image} 1440w, ${project.image.replace(".jpg", "@2x.jpg")} 2880w`}
                    sizes="(max-width: 800px) 92vw, 70vw"
                    alt=""
                    width={1440}
                    height={900}
                    draggable={false}
                  />
                ))}
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
    </section>
  );
}
