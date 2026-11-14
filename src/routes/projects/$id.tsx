import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { getProject } from "@/content/projects";
import { absoluteUrl } from "@/lib/journal-seo";
import { pageCanonicalHead, organizationGraph } from "@/lib/site-seo";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const project = getProject(params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Project not found | USSCALLISTER" }, { name: "robots", content: "noindex" }] };
    }
    const { project } = loaderData;
    const title = `${project.name} | USSCALLISTER`;
    const description = `${project.note} ${project.year} work by USSCALLISTER in Los Angeles.`;
    const canonical = absoluteUrl(`/projects/${project.id}`);
    const graph = {
      "@context": "https://schema.org",
      "@graph": [
        organizationGraph(),
        {
          "@type": "CreativeWork",
          name: project.name,
          url: canonical,
          description,
          image: absoluteUrl(project.image.split("?")[0]),
          creator: { "@id": absoluteUrl("/#organization") },
          dateCreated: project.year,
        },
      ],
    };
    return {
      ...pageCanonicalHead(`/projects/${project.id}`),
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
      scripts: canonical
        ? [{ type: "application/ld+json", children: JSON.stringify(graph).replace(/</g, "\\u003c") }]
        : [],
    };
  },
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  return (
    <main className="folio">
      <FolioBar here="Projects" />
      <article className="folio-article">
        <p className="kicker-label">{project.cat}</p>
        <h1>{project.name}</h1>
        <p className="folio-stand">{project.note}</p>
        <figure className="folio-figure">
          <img src={project.detail} alt={`${project.name} website`} width={1600} height={1000} />
        </figure>
        <div className="folio-prose folio-prose-solo">
          <aside className="folio-next">
            <p>See it</p>
            <a href={project.href} target="_blank" rel="noreferrer">
              {project.host}
            </a>
            <Link to="/projects">All projects</Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
