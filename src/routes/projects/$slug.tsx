import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject } from "@/content/projects";
import "@/components/reveal-gallery.css";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.project.name} | USSCALLISTER` },
            { name: "description", content: loaderData.project.note },
            { name: "keywords", content: `${loaderData.project.name}, USSCALLISTER, Los Angeles, ${loaderData.project.cat}` },
            { name: "robots", content: "index, follow" },
            { property: "og:title", content: `${loaderData.project.name} | USSCALLISTER` },
            { property: "og:description", content: loaderData.project.note },
            { property: "og:type", content: "website" },
            { property: "og:site_name", content: "USSCALLISTER" },
            { property: "og:image", content: loaderData.project.image },
          ],
        }
      : { meta: [{ title: "Project not found | USSCALLISTER" }, { name: "robots", content: "noindex" }] },
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  return (
    <main className="folio">
      <header className="folio-bar">
        <a href="/">USSCALLISTER</a>
        <nav aria-label="Project">
          <Link to="/projects">Projects</Link>
          <span aria-hidden="true">/</span>
          <span>{project.short}</span>
        </nav>
      </header>
      <article className="folio-article">
        <p className="kicker-label">
          {project.cat} · {project.year}
        </p>
        <h1>{project.name}</h1>
        <p className="folio-stand">{project.note}</p>
        <a className="case-visit" href={project.href} target="_blank" rel="noreferrer">
          Visit website
        </a>
        <div className="case-shots">
          <img src={project.image} alt={`${project.name} homepage`} width={1600} height={1000} loading="lazy" decoding="async" />
          <img src={project.detail} alt={`${project.name}, further into the site`} width={1600} height={1000} loading="lazy" decoding="async" />
        </div>
      </article>
    </main>
  );
}
