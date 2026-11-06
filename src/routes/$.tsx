import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Page not found | USSCALLISTER" },
      {
        name: "description",
        content: "This page is not on the USSCALLISTER site. Return home, or open projects, the journal, or contact.",
      },
      { name: "robots", content: "noindex, follow" },
      { name: "keywords", content: "USSCALLISTER, page not found" },
      { property: "og:title", content: "Page not found | USSCALLISTER" },
      { property: "og:description", content: "This page is not on the USSCALLISTER site." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "USSCALLISTER" },
    ],
  }),
  component: MissingPage,
});

function MissingPage() {
  return (
    <main className="folio">
      <FolioBar here="404" />
      <article className="folio-article">
        <p className="kicker-label">404</p>
        <h1>This page is not here.</h1>
        <div className="folio-prose folio-prose-solo">
          <p>The address does not match a page on this site.</p>
          <p>
            <Link to="/">Home</Link>
            {" · "}
            <Link to="/journal">Journal</Link>
            {" · "}
            <Link to="/projects">Projects</Link>
            {" · "}
            <a href="/#contact">Contact</a>
          </p>
        </div>
      </article>
    </main>
  );
}
