import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { MissingPage } from "@/components/missing-page";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "USSCALLISTER — Studio";
const APP_DESCRIPTION =
  "USSCALLISTER is an independent creative studio in Los Angeles for websites, branding, development, and film.";

function matchIsNotFound(match: { status?: string; error?: unknown; _notFound?: boolean }) {
  if (match.status === "notFound" || match._notFound === true) return true;
  const err = match.error;
  return typeof err === "object" && err !== null && "isNotFound" in err && Boolean((err as { isNotFound?: boolean }).isNotFound);
}

export const Route = createRootRoute({
  notFoundComponent: MissingPage,
  head: ({ matches }) => {
    const isNotFound = matches.some(matchIsNotFound);
    if (isNotFound) {
      return {
        meta: [
          { charSet: "utf-8" },
          { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
          { title: "Page not found | USSCALLISTER" },
          {
            name: "description",
            content:
              "This page is not on the USSCALLISTER site. Return home, or open projects, the journal, or contact.",
          },
          { name: "theme-color", content: "#0a0a0a" },
          { name: "robots", content: "noindex, follow" },
        ],
        links: [
          { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
          { rel: "stylesheet", href: appCss },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:wght@500;600&family=Fragment+Mono&family=Inter:wght@400;500&display=swap",
          },
          { rel: "manifest", href: "/__grok/manifest.webmanifest" },
          { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
        ],
      };
    }
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { title: APP_NAME },
        { name: "description", content: APP_DESCRIPTION },
        { name: "theme-color", content: "#0a0a0a" },
        {
          name: "keywords",
          content:
            "USSCALLISTER, Los Angeles web design, studio, branding, website development, film, projects",
        },
      ],
      links: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "stylesheet", href: appCss },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:wght@500;600&family=Fragment+Mono&family=Inter:wght@400;500&display=swap",
        },
        { rel: "manifest", href: "/__grok/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      ],
    };
  },
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
