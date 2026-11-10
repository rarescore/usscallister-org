import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  buildRobotsTxt,
  buildSitemapXml,
  indexablePaths,
  writeSeoAssets,
} from "./generate-seo-assets.mjs";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const ORIGIN = "https://usscallister.org";

test("robots.txt is plaintext with Allow and absolute Sitemap", () => {
  const robots = buildRobotsTxt();
  assert.equal(robots.includes("<!DOCTYPE"), false);
  assert.match(
    robots,
    /^User-agent: \*\nAllow: \/\n\nSitemap: https:\/\/usscallister\.org\/sitemap\.xml\n$/,
  );
});

test("sitemap.xml lists only absolute .org URLs for indexable routes", () => {
  const paths = indexablePaths();
  assert.ok(paths.includes("/"));
  assert.ok(paths.includes("/contact"));
  assert.ok(paths.includes("/info"));
  assert.ok(paths.includes("/web-design-medical-clinics"));
  assert.ok(paths.includes("/journal/what-makes-a-50000-website-worth-it"));
  assert.equal(paths.includes("/projects/canby"), false);
  assert.equal(paths.includes("/journal/los-angeles-web-design-guide"), false);
  assert.ok(paths.includes("/web-design-los-angeles"));
  assert.equal(paths.includes("/blog"), false);

  const xml = buildSitemapXml(paths);
  assert.equal(xml.includes("<!DOCTYPE html"), false);
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);

  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, paths.length);
  for (const loc of locs) {
    assert.match(loc, /^https:\/\/usscallister\.org(\/.*)?$/);
    assert.equal(loc.includes("localhost"), false);
  }
  const expected = paths.map((p) => (p === "/" ? `${ORIGIN}/` : `${ORIGIN}${p}`));
  assert.deepEqual([...locs].sort(), [...expected].sort());
});

test("writeSeoAssets writes robots.txt and sitemap.xml bodies", () => {
  const dir = mkdtempSync(join(tmpdir(), "seo-assets-"));
  try {
    writeSeoAssets({ outDir: dir });
    const robots = readFileSync(join(dir, "robots.txt"), "utf8");
    const sitemap = readFileSync(join(dir, "sitemap.xml"), "utf8");
    assert.match(robots, /Sitemap: https:\/\/usscallister\.org\/sitemap\.xml/);
    assert.match(sitemap, /<loc>https:\/\/usscallister\.org\/<\/loc>/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("public assets stay in sync with generator", () => {
  writeSeoAssets({ outDir: join(root, "public") });
  const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
  const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
  assert.equal(robots, buildRobotsTxt());
  assert.equal(sitemap, buildSitemapXml());
});
