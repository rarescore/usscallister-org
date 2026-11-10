type Scores = {
  loadSpeed: number | null;
  seoBasics: number | null;
  mobileReadiness: number | null;
  firstImpression: number | null;
  overallScore: number | null;
  error?: string;
};

const EMPTY = (error: string): Scores => ({
  loadSpeed: null,
  seoBasics: null,
  mobileReadiness: null,
  firstImpression: null,
  overallScore: null,
  error,
});

function json(body: Scores, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function targetUrl(raw: unknown) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const withProtocol = /^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.toString();
}

function categoryScore(categories: Record<string, { score?: number | null }> | undefined, id: string) {
  const value = categories?.[id]?.score;
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.round(value * 100);
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { url?: unknown };
  try {
    body = await req.json();
  } catch {
    return json(EMPTY("Send a URL."), 400);
  }

  const target = targetUrl(body.url);
  if (!target) return json(EMPTY("That URL doesn't look usable."), 400);

  const key = process.env.PAGESPEED_API_KEY;
  console.log(`PAGESPEED_API_KEY ${key ? "is defined" : "is not defined"}`);
  if (!key) return json(EMPTY("PageSpeed is not configured."));

  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", target);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("key", key);
  for (const category of ["performance", "seo", "accessibility", "best-practices"]) {
    endpoint.searchParams.append("category", category);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 50_000);
  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.lighthouseResult?.categories) {
      const message = payload?.error?.message || "PageSpeed did not return a score.";
      return json(EMPTY(message));
    }
    const categories = payload.lighthouseResult.categories as Record<string, { score?: number | null }>;
    const loadSpeed = categoryScore(categories, "performance");
    return json({
      loadSpeed,
      seoBasics: categoryScore(categories, "seo"),
      mobileReadiness: categoryScore(categories, "accessibility"),
      firstImpression: categoryScore(categories, "best-practices"),
      overallScore: loadSpeed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
    return json(EMPTY("PageSpeed timed out."));
  } finally {
    clearTimeout(timer);
  }
};
