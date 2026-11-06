import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio-page";
import { homeHead } from "@/lib/site-seo";

export const Route = createFileRoute("/")({
  head: () => homeHead(),
  component: Home,
});

function Home() {
  return <StudioPage />;
}
