import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import test from "node:test";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const clientDir = join(root, "dist/client");
const hasBuild = existsSync(join(clientDir, "robots.txt")) && existsSync(join(clientDir, "sitemap.xml"));

test("built dist/client ships plaintext robots.txt and XML sitemap", { skip: !hasBuild }, () => {
  const robots = readFileSync(join(clientDir, "robots.txt"), "utf8");
  const sitemap = readFileSync(join(clientDir, "sitemap.xml"), "utf8");
  assert.equal(robots.includes("<html"), false);
  assert.match(robots, /^User-agent: \*/);
  assert.equal(sitemap.includes("<html"), false);
  assert.match(sitemap, /<urlset /);
  assert.match(sitemap, /<loc>https:\/\/usscallister\.org\/<\/loc>/);
});

async function fetchText(url) {
  const res = await fetch(url);
  const text = await res.text();
  return { status: res.status, type: res.headers.get("content-type") || "", text };
}

test("vite preview serves SEO assets and SSR head/404 correctly", { skip: !hasBuild }, async () => {
  const port = 18084;
  const child = spawn(
    "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NETLIFY: "true" },
      detached: true,
    },
  );
  let ready = false;
  const deadline = Date.now() + 45000;
  try {
    while (Date.now() < deadline) {
      try {
        const probe = await fetch(`http://127.0.0.1:${port}/robots.txt`);
        if (probe.ok) {
          ready = true;
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 250));
      }
    }
    assert.equal(ready, true, "preview server did not start");

    const robots = await fetchText(`http://127.0.0.1:${port}/robots.txt`);
    assert.equal(robots.status, 200);
    assert.match(robots.type, /text\/plain/i);
    assert.equal(robots.text.includes("<!DOCTYPE html"), false);
    assert.match(robots.text, /User-agent: \*/);

    const sitemap = await fetchText(`http://127.0.0.1:${port}/sitemap.xml`);
    assert.equal(sitemap.status, 200);
    assert.match(sitemap.type, /xml/i);
    assert.equal(sitemap.text.includes("<!DOCTYPE html"), false);
    assert.match(sitemap.text, /<urlset /);

    const home = await fetchText(`http://127.0.0.1:${port}/`);
    assert.equal(home.status, 200);
    assert.match(home.text, /rel="canonical" href="https:\/\/usscallister\.org\/"/);
    assert.match(home.text, /<h1 class="name">USSCALLISTER<\/h1>/);
    assert.match(home.text, /application\/ld\+json/);
    assert.match(home.text, /"@type":"Organization"/);
    assert.match(home.text, /"@type":"WebSite"/);

    const projects = await fetchText(`http://127.0.0.1:${port}/projects`);
    assert.equal(projects.status, 200);
    assert.match(projects.text, /rel="canonical" href="https:\/\/usscallister\.org\/projects"/);
    assert.match(projects.text, /<h1>Recent projects of 2026<\/h1>/);

    for (const [path, can] of [
      ["/projects/canby", "https://usscallister.org/projects/canby"],
      ["/privacy", "https://usscallister.org/privacy"],
      ["/terms", "https://usscallister.org/terms"],
      ["/newsletter", "https://usscallister.org/newsletter"],
    ]) {
      const page = await fetchText(`http://127.0.0.1:${port}${path}`);
      assert.equal(page.status, 200, path);
      assert.match(page.text, new RegExp(`rel="canonical" href="${can}"`));
    }

    const missing = await fetchText(
      `http://127.0.0.1:${port}/this-page-should-not-exist-audit-20261106`,
    );
    assert.equal(missing.status, 404);
    assert.match(missing.text, /This page is not here/);
    assert.match(missing.text, /noindex/);
  } finally {
    try {
      if (child.pid) process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  }
});
