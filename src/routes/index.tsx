import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio-page";
import { homeHead } from "@/lib/site-seo";

export const Route = createFileRoute("/")({
  head: () => {
    const head = homeHead();
    return {
      ...head,
      links: [
        ...(head.links ?? []),
        { rel: "preload", as: "image", href: "/media/hero-boat-poster.jpg?v=1", fetchPriority: "high" },
      ],
    };
  },
  component: Home,
});

function Home() {
  return <StudioPage />;
}
