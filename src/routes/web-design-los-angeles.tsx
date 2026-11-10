import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { localServiceHead } from "@/lib/journal-seo";

export const Route = createFileRoute("/web-design-los-angeles")({
  head: () => localServiceHead(),
  component: LosAngelesPage,
});

function LosAngelesPage() {
  return (
    <main className="folio">
      <FolioBar here="Los Angeles" />
      <article className="folio-article">
        <p className="kicker-label">Design and development</p>
        <h1>Website design for Los Angeles businesses.</h1>
        <p className="folio-stand">
          A clear offer, a considered visual direction, and a website built around what your customers need to do next.
        </p>
        <div className="folio-prose folio-prose-solo">
          <p>
            USSCALLISTER is an independent website design and development studio. For businesses serving Los Angeles
            and the San Fernando Valley, the work starts with the audience, the offer, and the path to an inquiry.
          </p>
          <h2>What the work covers</h2>
          <ul>
            <li>Content structure and page priorities based on customer questions.</li>
            <li>Visual direction, typography, image treatment, and reusable components.</li>
            <li>Responsive interfaces, purposeful motion, and usable inquiry paths.</li>
            <li>Search foundations: page topics, metadata, internal links, and crawlable content.</li>
          </ul>
          <h2>Industries in Los Angeles</h2>
          <ul>
            <li>
              <Link to="/web-design-medical-clinics">Web design for medical clinics</Link>, including the{" "}
              <Link to="/projects/$id" params={{ id: "canby" }}>Canby Community Clinic</Link> case study.
            </li>
            <li>
              <Link to="/web-design-roofing-contractors">Roofing website design</Link> for contractors such as{" "}
              <Link to="/projects/$id" params={{ id: "citium" }}>Citium Roofing</Link> in Glendale and Los Angeles.
            </li>
            <li>
              <Link to="/web-design-plumbing-contractors">Plumber website design</Link> in the San Fernando Valley, including{" "}
              <Link to="/projects/$id" params={{ id: "plumbing" }}>My Plumbing Inc</Link> and{" "}
              <Link to="/projects/$id" params={{ id: "rooter" }}>Extreme Plumbing & Rooter</Link>.
            </li>
            <li>
              <Link to="/web-design-airbnb-cleaning">Airbnb cleaning websites</Link>, including{" "}
              <Link to="/projects/$id" params={{ id: "clean" }}>Extreme Quality Clean</Link>.
            </li>
          </ul>
          <h2>How a project starts</h2>
          <p>
            We start with the audience and the action the site has to earn: a call, a booking, or a brief. Research
            comes before layout. The phone number on this site is 818-913-6158, and new work is taken from Los Angeles.
          </p>
          <h2>Projects in the city</h2>
          <p>
            <a href="https://puravidacc.org">Canby Community Clinic</a> is a Reseda clinic site.{" "}
            <a href="https://citiumroofing.com">Citium Roofing</a> covers roofing in Glendale and Los Angeles.{" "}
            <a href="https://extremequalityclean.com">Extreme Quality Clean</a> explains Airbnb turnover. These are
            examples of work, not a promise of ranking or leads.
          </p>
          <h2>Cost and a rebuild</h2>
          <p>
            Read the{" "}
            <Link to="/journal/$slug" params={{ slug: "what-makes-a-50000-website-worth-it" }}>
              website cost note
            </Link>
            , and{" "}
            <Link to="/journal/$slug" params={{ slug: "why-websites-look-expensive" }}>
              why a site looks expensive
            </Link>
            . A new site does not guarantee local rankings.
          </p>
          <aside className="folio-next">
            <p>Start a project</p>
            <a href="/#contact">Send a brief</a>
            <Link to="/journal">Journal</Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
