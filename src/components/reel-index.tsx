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

function sharp(src: string) {
  return {
    src,
    srcSet: `${src} 1440w, ${src.replace(".jpg", "@2x.jpg")} 2880w`,
  };
}

export function ReelIndex({ underBar = false }: { underBar?: boolean }) {
  return (
    <section className={underBar ? "reel-index is-under-bar" : "reel-index"} id="index" aria-label="Selected work">
      {PROJECTS.map((project) => {
        const hero = sharp(project.image);
        return (
          <article className="case" id={project.id} key={project.id}>
            <div className="case-hero">
              <img {...hero} sizes="100vw" alt="" width={1440} height={900} />
              <p className="case-year">{project.year}</p>
              <p className="case-title">{project.short}</p>
            </div>
            <div className="case-copy">
              <p>{project.note}</p>
            </div>
            <img className="case-still" src={project.detail} alt="" width={1440} height={900} />
            <div className="case-links">
              <a href={project.href} target="_blank" rel="noreferrer">
                Live website
              </a>
              <a
                href="#reel"
                onClick={(event) => {
                  event.preventDefault();
                  seedBrief(project.name);
                }}
              >
                Start one like this
              </a>
            </div>
          </article>
        );
      })}
    </section>
  );
}
