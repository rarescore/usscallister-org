import { createFileRoute } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { CoverflowCarousel } from "@/components/coverflow-carousel";
import { PROJECTS } from "@/content/projects";
import { pageCanonicalHead } from "@/lib/site-seo";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    ...pageCanonicalHead("/projects"),
    meta: [
      { title: "Projects | USSCALLISTER" },
      {
        name: "description",
        content:
          "Selected USSCALLISTER projects: websites for a clinic, roofing, cleaning, plumbing, and product studios in Los Angeles.",
      },
      {
        name: "keywords",
        content:
          "USSCALLISTER projects, Los Angeles web design, Canby Community Clinic, Citium Roofing, Extreme Quality Clean, RareScore, My Plumbing Inc, Extreme Plumbing & Rooter",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Projects | USSCALLISTER" },
      {
        property: "og:description",
        content: "Selected studio projects from USSCALLISTER in Los Angeles.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "USSCALLISTER" },
    ],
  }),
  component: ProjectsIndex,
});

function ProjectsIndex() {
  return (
    <main className="folio">
      <FolioBar here="Projects" />
      <CoverflowCarousel showCaption />
      <nav className="project-index" aria-label="All projects">
        {PROJECTS.map((project) => (
          <a key={project.id} href={project.href} target="_blank" rel="noreferrer">
            {project.name}
          </a>
        ))}
      </nav>
    </main>
  );
}