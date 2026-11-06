import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleView, FolioBar } from "@/components/article";
import { getEntry } from "@/content/journal-api";
import { journalHead } from "@/lib/journal-seo";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const entry = getEntry(params.slug);
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ loaderData }) =>
    loaderData
      ? journalHead(loaderData.entry)
      : { meta: [{ title: "Note not found | USSCALLISTER" }, { name: "robots", content: "noindex" }] },
  component: JournalEntryPage,
});

function JournalEntryPage() {
  const { entry } = Route.useLoaderData();
  return (
    <main className="folio">
      <FolioBar here={entry.category ?? "Note"} />
      <ArticleView entry={entry} />
    </main>
  );
}
