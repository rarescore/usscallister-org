import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { absoluteUrl } from "@/lib/journal-seo";
import { seoConfig } from "@/content/seo-config";

export const Route = createFileRoute("/web-design-plumbing-contractors")({
  head: () => {
    const title = "Website Design for Plumbers | San Fernando Valley | USSCALLISTER";
    const description = "Custom websites for plumbing contractors in the San Fernando Valley. Emergency-call buttons above the fold, service-area maps, Google Business Profile integration, and fast mobile load for homeowners in a panic. See the Extreme Plumbing project.";
    const canonical = absoluteUrl("/web-design-plumbing-contractors");
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: seoConfig.name },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];
    if (canonical) meta.push({ property: "og:url", content: canonical });
    const links = canonical ? [{ rel: "canonical", href: canonical }] : [];
    const scripts = canonical
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": absoluteUrl("/#organization"),
                  name: seoConfig.name,
                  url: absoluteUrl("/"),
                  email: seoConfig.email,
                },
                {
                  "@type": "WebPage",
                  "@id": canonical,
                  url: canonical,
                  name: title,
                  description,
                },
                {
                  "@type": "Service",
                  "@id": `${canonical}#service`,
                  name: "Website design and development for plumbing contractors",
                  serviceType: "Website design and development",
                  provider: { "@id": absoluteUrl("/#organization") },
                  areaServed: seoConfig.areaServed.map((name) => ({
                    "@type": "Place",
                    name,
                  })),
                  url: canonical,
                },
                {
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: absoluteUrl("/"),
                    },
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: "Web design for plumbing contractors",
                      item: canonical,
                    },
                  ],
                },
              ],
            }).replace(/</g, "\\u003c"),
          },
        ]
      : [];
    return { meta, links, scripts };
  },
  component: PlumbingPage,
});

function PlumbingPage() {
  return (
    <main className="folio">
      <FolioBar here="Plumbing" />
      <article className="folio-article">
        <p className="kicker-label">Design and development</p>
        <h1>Website design for plumbing contractors.</h1>
        <p className="folio-stand">
          A site where the emergency button is the first thing a panicked homeowner sees — not buried under three menus.
        </p>
        <div className="folio-prose folio-prose-solo">
          <p>
            Plumbing searches are high-intent and time-sensitive. Someone typing "emergency plumber near me" at nine at night is not browsing — they're choosing. The website has about three seconds to make them call. That means the phone number in the largest type on the page, a service-area map that confirms coverage instantly, and no popups or carousels between the visitor and the call button.
          </p>
          <h2>What the work covers</h2>
          <ul>
            <li>Emergency-call prominence above the fold on every page, with tap-to-call on mobile.</li>
            <li>Service pages for each trade — drain cleaning, water heater repair, leak detection, repiping — each mapped to its own search term.</li>
            <li>Service-area radius maps that load fast and make geographic coverage obvious.</li>
            <li>Google Business Profile integration so reviews and local signals reinforce the site.</li>
            <li>Fast load on LTE, because the homeowner is often standing in water when they search.</li>
          </ul>
          <h2>Proof of work</h2>
          <p>
            <strong>Extreme Plumbing & Rooter</strong> in the San Fernando Valley is the flagship — CSLB licensed, serving the whole Valley. The site pairs real service imagery — the van, the tools, the job sites — with a call-first layout designed for people who need a plumber now. No stock photos of smiling couples in kitchens.
          </p>
          <h2>Why plumbers outgrow templates</h2>
          <p>
            Template sites make every plumber look like every other plumber, which is the one thing a homeowner in an emergency can't afford. A custom build ranks for "plumber San Fernando Valley," puts the number first, and turns a midnight search into a booked job. The site is the difference between being found and being the third option in a list.
          </p>
          <aside className="folio-next">
            <p>Start a project</p>
            <a href="/#contact">Send a brief</a>
            <Link to="/journal/$slug" params={{ slug: "what-makes-a-50000-website-worth-it" }}>
              Website cost note
            </Link>
            <Link to="/web-design-los-angeles">Los Angeles web design</Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
