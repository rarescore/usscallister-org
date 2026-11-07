import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { absoluteUrl } from "@/lib/journal-seo";
import { seoConfig } from "@/content/seo-config";

export const Route = createFileRoute("/web-design-medical-clinics")({
  head: () => {
    const title = "Website Design for Medical Clinics | USSCALLISTER";
    const description = "Custom websites for medical clinics and healthcare practices in Los Angeles. Patient-first design, fast load times, and clear paths to booking. See the Canby Community Clinic project.";
    const canonical = absoluteUrl("/web-design-medical-clinics");
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
                  name: "Website design and development for medical clinics",
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
                      name: "Web design for medical clinics",
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
  component: MedicalClinicsPage,
});

function MedicalClinicsPage() {
  return (
    <main className="folio">
      <FolioBar here="Medical clinics" />
      <article className="folio-article">
        <p className="kicker-label">Design and development</p>
        <h1>Website design for medical clinics.</h1>
        <p className="folio-stand">
          A site that answers patient questions before they call, loads fast on any phone, and makes booking the obvious next step.
        </p>
        <div className="folio-prose folio-prose-solo">
          <p>
            Most clinic websites are built for the practice, not the patient. They bury insurance info, hide the booking path, and load slowly on mobile — which is where most patients start searching. USSCALLISTER builds clinic sites around what patients actually type into Google: "urgent care near me," "does this clinic take my insurance," "how do I book an appointment."
          </p>
          <h2>What the work covers</h2>
          <ul>
            <li>Service pages mapped to the exact searches patients use, with clear answers above the fold.</li>
            <li>Insurance and accepted-plans sections that reduce front-desk call volume.</li>
            <li>Appointment booking paths that work on any screen size, with minimal fields.</li>
            <li>Fast load times and mobile-first layout — most patients browse on a phone in a waiting room or parking lot.</li>
            <li>Search foundations: local metadata, internal links, and crawlable content for clinic-related queries.</li>
          </ul>
          <h2>Proof of work</h2>
          <p>
            <a href="https://puravidacc.org">Canby Community Clinic</a> in Reseda is the flagship example — a full rebuild with patient-first information architecture, a clear booking flow, and content structured around the questions people ask before their first visit. It's a real project with a real outcome, not a template demo.
          </p>
          <h2>Why clinics choose this over a template</h2>
          <p>
            Template builders get you online in an afternoon. They don't get you found. A clinic site has to rank for local queries, load in under three seconds on LTE, and make a nervous first-time patient feel safe clicking "book." That takes structure, not a drag-and-drop grid.
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
