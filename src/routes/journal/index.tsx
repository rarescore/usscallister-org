import { createFileRoute } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { JournalSection } from "@/components/journal-section";
import { journalHead } from "@/lib/journal-seo";

export const Route = createFileRoute("/journal/")({
  head: () => journalHead(),
  component: JournalIndex,
});

function JournalIndex() {
  return (
    <main className="folio">
      <FolioBar here="Index" />
      <JournalSection />
    </main>
  );
}
