import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { absoluteUrl } from "@/lib/journal-seo";
import { seoConfig } from "@/content/seo-config";

export const Route = createFileRoute("/web-design-roofing-contractors")({
  head: () => {
    const title = "Website Design for Roofing Contractors | USSCALLISTER";
    const description = "Custom websites for roofing contractors in Los Angeles. Fast-loading galleries, lead capture forms, and review widgets that turn searchers into booked inspections. See the Citium Roofing project.";
    const canonical = absoluteUrl("/web-design-roofing-contractors");
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
                  name: "Website design and development for roofing contractors",
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
                      name: "Web design for roofing contractors",
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
  component: RoofingContractorsPage,
});

function RoofingContractorsPage() {
  return (
    <main className="folio">
      <FolioBar here="Roofing contractors" />
      <article className="folio-article">
        <p className="kicker-label">Design and development</p>
        <h1>Website design for roofing contractors.</h1>
        <p className="folio-stand">
          A site that turns storm-damage searches into booked inspections — with galleries that load on a job site, forms that capture leads before the phone rings, and reviews that do the selling.
        </p>
        <div className="folio-prose folio-prose-solo">
          <p>
            Roofing customers don't browse casually. They're searching after hail, after a leak, after seeing a neighbor's new roof. The decision window is hours, not days. A contractor site has to answer "emergency roof repair near me" in under three seconds, show real work instantly, and make requesting an inspection feel as easy as calling — because for a lot of homeowners, it is the call.
          </p>
          <h2>What the work covers</h2>
          <ul>
            <li>Service pages for every roof type and job — repair, replacement, inspection, gutter, solar panel mounting — each mapped to its own search term.</li>
            <li>Fast-loading photo galleries with real project shots, compressed for mobile on cellular.
            </li>
            <li>Lead capture forms with minimal fields: name, phone, address, roof issue. No twenty-field surveys.</li>
            <li>Google Business Profile integration and review widgets that surface star ratings above the fold.</li>
            <li>Emergency-call prominence: phone number and request-inspection CTA visible without scrolling on every page.</li>
          </ul>
          <h2>Proof of work</h2>
          <p>
            <strong>Citium Roofing Solutions</strong> in Glendale is the flagship — cinematic inspection and walkthrough footage, a premium navy-and-cream brand system, and a site built to convert homeowners mid-storm. The before state was a template with stock photos. The after is a site that looks like the company already did the job.
          </p>
          <h2>Why roofers outgrow templates</h2>
          <p>
            Template sites load slow, look generic, and can't rank for "roof repair [city]" because every other roofer in the metro uses the same theme. A custom build gets you unique content, faster pages, and a visual identity that makes a $15,000 decision feel safe. Homeowners are trusting you with their biggest asset — the site should feel like it.
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
