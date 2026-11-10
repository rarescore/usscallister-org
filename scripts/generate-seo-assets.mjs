#!/usr/bin/env node
/**
 * Writes public/robots.txt and public/sitemap.xml from seoConfig + content lists.
 * Run before/during build so Netlify publishes real text/xml assets (not SPA HTML).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://usscallister.org";

function journalSlugs() {
  const src = readFileSync(join(root, "src/content/journal.ts"), "utf8");
  return [...src.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Indexable HTML routes that exist as real pages (robots index,follow or home). */
export function indexablePaths() {
  const paths = new Set([
    "/",
    "/projects",
    "/journal",
    "/contact",
    "/info",
    "/privacy",
    "/terms",
    "/newsletter",
    "/web-design-los-angeles",
    "/web-design-medical-clinics",
    "/web-design-plumbing-contractors",
    "/web-design-roofing-contractors",
    "/web-design-airbnb-cleaning",
  ]);
  for (const slug of journalSlugs()) paths.add(`/journal/${slug}`);
  return [...paths].sort((a, b) => a.localeCompare(b));
}

export function buildRobotsTxt() {
  return ["User-agent: *", "Allow: /", "", `Sitemap: ${origin}/sitemap.xml`, ""].join("\n");
}

export function buildSitemapXml(paths = indexablePaths()) {
  const urls = paths
    .map((path) => {
      const loc = path === "/" ? `${origin}/` : `${origin}${path}`;
      return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function writeSeoAssets({ outDir = join(root, "public") } = {}) {
  mkdirSync(outDir, { recursive: true });
  const robots = buildRobotsTxt();
  const sitemap = buildSitemapXml();
  writeFileSync(join(outDir, "robots.txt"), robots, "utf8");
  writeFileSync(join(outDir, "sitemap.xml"), sitemap, "utf8");
  return { robots, sitemap, paths: indexablePaths() };
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const result = writeSeoAssets();
  console.log(`[seo-assets] wrote robots.txt + sitemap.xml (${result.paths.length} urls)`);
}
