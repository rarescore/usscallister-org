import { seoConfig } from "@/content/seo-config";
import { absoluteUrl } from "@/lib/journal-seo";

/** Visible homepage description (matches root meta + Info copy intent). */
export const HOME_DESCRIPTION =
  "USSCALLISTER is an independent creative studio in Los Angeles for websites, branding, development, and film.";

export function canonicalLink(path: string): { rel: "canonical"; href: string } | undefined {
  const href = absoluteUrl(path);
  return href ? { rel: "canonical", href } : undefined;
}

export function organizationGraph() {
  return {
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: seoConfig.name,
    url: absoluteUrl("/"),
    email: seoConfig.email,
    areaServed: seoConfig.areaServed.map((name) => ({ "@type": "Place", name })),
  };
}

/** Homepage Organization + WebSite JSON-LD grounded in visible studio facts only. */
export function homeHead() {
  const canonical = absoluteUrl("/");
  const links = canonical ? [{ rel: "canonical" as const, href: canonical }] : [];
  if (!canonical) return { links, scripts: [] as Array<{ type: string; children: string }> };

  const graph = [
    organizationGraph(),
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: seoConfig.name,
      description: HOME_DESCRIPTION,
      inLanguage: seoConfig.language,
      publisher: { "@id": absoluteUrl("/#organization") },
    },
  ];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return {
    links,
    scripts: [{ type: "application/ld+json", children: json }],
  };
}

export function pageCanonicalHead(path: string) {
  const link = canonicalLink(path);
  return {
    links: link ? [link] : [],
  };
}
