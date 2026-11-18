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
        { rel: "preload", as: "image", href: "/media/hero-poster.jpg?v=6", fetchPriority: "high" },
        {
          rel: "preload",
          as: "video",
          href: "/media/hero-4k.mp4?v=6",
          type: "video/mp4",
          fetchPriority: "high",
          media: "(min-width: 801px)",
        },
      ],
    };
  },
  component: Home,
});

function Home() {
  return <StudioPage />;
}
