import type { JournalEntry } from "@/content/journal-types";
import { seoConfig } from "@/content/seo-config";

export function productionOrigin(): string | undefined {
  if (!seoConfig.siteUrl) return undefined;
  const url = new URL(seoConfig.siteUrl);
  if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("seoConfig.siteUrl must be the final HTTPS origin, without a path, query, or fragment.");
  }
  return url.origin;
}
export function absoluteUrl(path: string): string | undefined {
  const origin = productionOrigin();
  return origin ? new URL(path, origin).href : undefined;
}
export function articleWordCount(entry: JournalEntry): number {
  const words = [entry.standfirst, ...entry.blocks.flatMap(b => b.type === "ul" ? b.items : [b.text])]
    .join(" ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
  return words ? words.split(/\s+/).length : 0;
}
export function readingMinutes(entry: JournalEntry): number {
  return Math.max(1, Math.ceil(articleWordCount(entry) / 220));
}
export function imageVariant(path: string, size: 640 | 960): string {
  return path.replace(/\.webp$/, `-${size}.webp`);
}
export function imageSrcSet(path: string): string {
  return `${imageVariant(path, 640)} 640w, ${imageVariant(path, 960)} 960w, ${path} 1600w`;
}
export function headingId(text: string): string {
  return text.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export function journalHead(entry?: JournalEntry) {
  const title = entry?.seoTitle ?? "Web Design Journal: Costs, SEO & Strategy | USSCALLISTER";
  const description = entry?.description ?? "Practical guides to website costs, redesigns, design, SEO, and choosing a studio. Advice for Los Angeles businesses and teams planning better websites.";
  const path = entry ? `/journal/${entry.slug}` : "/journal";
  const canonical = absoluteUrl(path);
  const imagePath = entry?.image ?? "/journal/hero-11-los-angeles.webp";
  const socialPath = imagePath.replace(/\.webp$/, "-social.jpg");
  const image = absoluteUrl(socialPath);
  const meta: Array<{ title: string } | { name: string; content: string } | { property: string; content: string }> = [
    { title }, { name: "description", content: description },
    { name: "robots", content: "index, follow, max-image-preview:large" },
    { property: "og:title", content: title }, { property: "og:description", content: description },
    { property: "og:type", content: entry ? "article" : "website" },
    { property: "og:site_name", content: seoConfig.name }, { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title }, { name: "twitter:description", content: description },
  ];
  if (canonical) meta.push({ property: "og:url", content: canonical });
  if (image) meta.push(
    { property: "og:image", content: image }, { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: entry?.imageAlt ?? "Los Angeles skyline at dusk" },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: entry?.imageAlt ?? "Los Angeles skyline at dusk" },
  );
  if (entry?.dateModified) meta.push({ property: "article:modified_time", content: entry.dateModified });
  if (entry?.datePublished) meta.push({ property: "article:published_time", content: entry.datePublished });
  const links = canonical ? [{ rel: "canonical", href: canonical }] : [];
  // Do not emit invented absolute URLs while the production domain is unknown.
  if (!canonical) return { meta, links, scripts: [] };
  const organization = {
    "@type": "Organization", "@id": absoluteUrl("/#organization"), name: seoConfig.name,
    url: absoluteUrl("/"), email: seoConfig.email,
    areaServed: seoConfig.areaServed.map(name => ({ "@type": "Place", name })),
  };
  const graph: unknown[] = [organization, {
    "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumbs`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Journal", item: absoluteUrl("/journal") },
      ...(entry ? [{ "@type": "ListItem", position: 3, name: entry.title, item: canonical }] : []),
    ],
  }];
  if (entry) graph.push({
    "@type": "BlogPosting", "@id": `${canonical}#article`, headline: entry.title,
    description: entry.description, mainEntityOfPage: canonical, url: canonical,
    image: [absoluteUrl(entry.image), absoluteUrl(entry.image.replace(/\.webp$/, "-4x3.jpg")), absoluteUrl(entry.image.replace(/\.webp$/, "-square.jpg"))],
    author: { "@type": "Organization", "@id": absoluteUrl("/#organization"), name: entry.author ?? seoConfig.name, url: absoluteUrl("/") },
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: seoConfig.language, articleSection: entry.category,
    wordCount: articleWordCount(entry),
    ...(entry.datePublished ? { datePublished: entry.datePublished } : {}),
    ...(entry.dateModified ? { dateModified: entry.dateModified } : {}),
  });
  else graph.push({ "@type": "CollectionPage", "@id": canonical, url: canonical, name: title, description, inLanguage: seoConfig.language });
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  return { meta, links, scripts: [{ type: "application/ld+json", children: json }] };
}

export function localServiceHead() {
  const title = "Los Angeles Web Design & Development | USSCALLISTER";
  const description = "Custom website design and development for Los Angeles businesses. Explore USSCALLISTER projects, practical planning guides, and discuss your website.";
  const canonical = absoluteUrl("/web-design-los-angeles");
  const head = journalHead();
  head.meta = head.meta.map(tag => {
    if ("title" in tag) return { title };
    if (("name" in tag && ["description", "twitter:description"].includes(tag.name)) || ("property" in tag && tag.property === "og:description")) return { ...tag, content: description };
    if (("name" in tag && tag.name === "twitter:title") || ("property" in tag && tag.property === "og:title")) return { ...tag, content: title };
    if ("property" in tag && tag.property === "og:url") return { ...tag, content: canonical! };
    return tag;
  });
  head.links = canonical ? [{ rel: "canonical", href: canonical }] : [];
  if (canonical) head.scripts = [{ type: "application/ld+json", children: JSON.stringify({
    "@context": "https://schema.org", "@graph": [
      { "@type": "Organization", "@id": absoluteUrl("/#organization"), name: seoConfig.name, url: absoluteUrl("/"), email: seoConfig.email },
      { "@type": "WebPage", "@id": canonical, url: canonical, name: title, description },
      { "@type": "Service", "@id": `${canonical}#service`, name: "Website design and development for Los Angeles businesses", serviceType: "Website design and development", provider: { "@id": absoluteUrl("/#organization") }, areaServed: seoConfig.areaServed.map(name => ({ "@type": "Place", name })), url: canonical },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Los Angeles web design", item: canonical },
      ] },
    ],
  }).replace(/</g, "\\u003c") }];
  return head;
}
