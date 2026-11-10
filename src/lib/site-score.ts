import { createServerFn } from "@tanstack/react-start";

export type ScoreItem = { label: string; verdict: string };

export type ScoreReport = {
  score: number;
  items: ScoreItem[];
};

const BLOCKED = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|\[::1\]|metadata\.google)/i;

export function normalizeSiteUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Enter a website URL.");
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new Error("That URL doesn't look usable.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Use an http or https address.");
  if (BLOCKED.test(url.hostname) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(url.hostname)) {
    throw new Error("That address can't be checked from here.");
  }
  return url.toString();
}

function metaContent(html: string, name: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (!new RegExp(`(?:name|http-equiv)\\s*=\\s*["']?${name}\\b`, "i").test(tag)) continue;
    const quoted = tag.match(/content\s*=\s*["']([^"']*)["']/i)?.[1];
    const bare = tag.match(/content\s*=\s*([^\s>]+)/i)?.[1];
    return (quoted ?? bare ?? "").replace(/\s+/g, " ").trim();
  }
  return "";
}

export function scoreHtml(html: string, ok: boolean, milliseconds: number): ScoreReport {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() ?? "";
  const description = metaContent(html, "description");
  const viewport = metaContent(html, "viewport");
  const mobile = /width\s*=\s*device-width/i.test(viewport);

  let speed = 6;
  let speedLine = "Slow enough that people leave before the page settles.";
  if (!ok) {
    speed = 0;
    speedLine = "The page did not return a readable response.";
  } else if (milliseconds < 800) {
    speed = 28;
    speedLine = "Fast. The first screen arrives before patience runs out.";
  } else if (milliseconds < 1800) {
    speed = 20;
    speedLine = "Acceptable, but the first second is doing too much work.";
  } else if (milliseconds < 3500) {
    speed = 12;
    speedLine = "Slow. A phone on a weak signal will feel it.";
  }

  let seo = 4;
  let seoLine = "No title and no description. Search has almost nothing to quote.";
  if (title && description.length > 40) {
    seo = 30;
    seoLine = "Title and description are both present and specific enough to use.";
  } else if (title && description) {
    seo = 22;
    seoLine = "Title and description exist. The description is too thin to win the click.";
  } else if (title) {
    seo = 16;
    seoLine = "A title is there. The meta description is missing.";
  } else if (description) {
    seo = 12;
    seoLine = "A description is there, but the page has no title tag.";
  }

  const ready = mobile ? 25 : viewport ? 14 : 4;
  const readyLine = mobile
    ? "The viewport tag is set, so a phone can read the page at the right size."
    : viewport
      ? "A viewport tag is present, but it does not lock the width to the device."
      : "No viewport tag. Phones will shrink the desktop page.";

  const impression = ok && title.length > 8 ? 15 : ok ? 8 : 2;
  const impressionLine = !ok
    ? "If it does not load, there is no first impression."
    : title.length > 8
      ? "A person can tell what this is before they scroll."
      : "The page loads, but the first line does not say what you do.";

  return {
    score: Math.max(0, Math.min(100, speed + seo + ready + impression)),
    items: [
      { label: "Load speed", verdict: speedLine },
      { label: "SEO basics", verdict: seoLine },
      { label: "Mobile readiness", verdict: readyLine },
      { label: "First impression", verdict: impressionLine },
    ],
  };
}

async function readSite(target: string) {
  const started = performance.now();
  const response = await fetch(target, {
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "text/html,application/xhtml+xml" },
  });
  const elapsed = performance.now() - started;
  const html = (await response.text()).slice(0, 400_000);
  const resource = performance.getEntriesByType("resource").find((entry) => entry.name === target);
  const navigation = performance.getEntriesByType("navigation")[0];
  const timed = resource?.duration || (navigation && navigation.name === target ? navigation.duration : 0);
  return scoreHtml(html, response.ok, timed || elapsed);
}

export const checkSite = createServerFn({ method: "POST" })
  .validator((input: { url: string }) => input)
  .handler(async ({ data }) => {
    const target = normalizeSiteUrl(data.url);
    return readSite(target);
  });

export async function analyzeSite(raw: string): Promise<ScoreReport> {
  const target = normalizeSiteUrl(raw);
  const started = performance.now();
  try {
    const response = await fetch(target, { redirect: "follow", signal: AbortSignal.timeout(8000) });
    const html = await response.text();
    if (!html || response.type === "opaque") throw new Error("unreadable");
    const elapsed = performance.now() - started;
    const resource = performance.getEntriesByType("resource").find((entry) => entry.name.startsWith(target));
    return scoreHtml(html, response.ok, resource?.duration || elapsed);
  } catch {
    return checkSite({ data: { url: target } });
  }
}
