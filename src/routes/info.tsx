import { createFileRoute } from "@tanstack/react-router";
import { StudioChapter } from "@/components/studio-chapter";
import { pageCanonicalHead } from "@/lib/site-seo";

export const Route = createFileRoute("/info")({
  head: () => ({
    ...pageCanonicalHead("/info"),
    meta: [
      { title: "Info | USSCALLISTER" },
      {
        name: "description",
        content:
          "USSCALLISTER is a Los Angeles studio built on conversion. Research first, then websites for clinics, contractors, and home services that perform.",
      },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  return (
    <main>
      <StudioChapter bar />
    </main>
  );
}
