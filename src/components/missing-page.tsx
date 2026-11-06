import { Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";

export function MissingPage() {
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
