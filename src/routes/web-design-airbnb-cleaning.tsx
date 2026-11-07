import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { absoluteUrl } from "@/lib/journal-seo";
import { seoConfig } from "@/content/seo-config";

export const Route = createFileRoute("/web-design-airbnb-cleaning")({
  head: () => {
    const title = "Website Design for Airbnb Cleaning Services | USSCALLISTER";
    const description = "Custom websites for short-term rental cleaning companies in Los Angeles. Online booking calendars, service-area maps, before-after galleries, and transparent pricing that kills no-shows. See the Extreme Quality Clean project.";
    const canonical = absoluteUrl("/web-design-airbnb-cleaning");
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
                  name: "Website design and development for Airbnb and short-term rental cleaning services",
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
                      name: "Web design for Airbnb cleaning services",
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
  component: AirbnbCleaningPage,
});

function AirbnbCleaningPage() {
  return (
    <main className="folio">
      <FolioBar here="Airbnb cleaning" />
      <article className="folio-article">
        <p className="kicker-label">Design and development</p>
        <h1>Website design for Airbnb cleaning services.</h1>
        <p className="folio-stand">
          A site that books turnovers before the guest checks out — with calendars, maps, galleries, and pricing that answer every question a host asks at two in the morning.
        </p>
        <div className="folio-prose folio-prose-solo">
          <p>
            Airbnb cleaning is a trust business. Hosts are handing over keys to strangers' homes, and guests are trusting a stranger with theirs. The website has to make both sides feel safe in the first ten seconds. That means real before-and-after photos, a service area map that shows coverage instantly, transparent pricing so there's no awkward back-and-forth, and a booking path that works on a phone in a car.
          </p>
          <h2>What the work covers</h2>
          <ul>
            <li>Service pages for every turnover type — standard, deep, move-in/move-out, post-construction — each mapped to its own search term.</li>
            <li>Online booking calendars that show real availability, not a contact form that leads to a phone tag loop.</li>
            <li>Service-area maps that load fast and make geographic coverage obvious at a glance.</li>
            <li>Before-and-after galleries compressed for mobile, because hosts compare on their phones between check-ins.</li>
            <li>Transparent pricing tiers that kill the no-show rate — the biggest hidden cost in this industry.</li>
          </ul>
          <h2>Proof of work</h2>
          <p>
            <strong>Extreme Quality Clean</strong> is the flagship — a brand built around the idea that turnover speed is the product. The site pairs cinematic cleaning footage with a booking flow designed for hosts who need a cleaner tonight, not next week. Real photos, real coverage area, real prices. No stock images of smiling people with mops.
          </p>
          <h2>Why cleaning companies outgrow templates</h2>
          <p>
            Template sites make every cleaner look identical, which is fatal in a market where hosts choose on trust and turnaround time. A custom build gets you unique content that ranks for "Airbnb cleaning [neighborhood]," a booking calendar that captures leads at midnight, and a visual identity that makes a $200 turnover feel worth it. The site isn't decoration — it's the front desk that never sleeps.
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
