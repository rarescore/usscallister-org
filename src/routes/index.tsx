import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio-page";
import { homeHead } from "@/lib/site-seo";

export const Route = createFileRoute("/")({
  head: () => {
    const head = homeHead();
    return {
      ...head,
      links: [...(head.links ?? []), { rel: "preload", as: "image", href: "/media/hero-poster.jpg?v=4" }],
    };
  },
  component: Home,
});

function Home() {
  return <StudioPage />;
}
