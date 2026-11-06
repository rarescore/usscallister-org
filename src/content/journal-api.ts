import { journal } from "@/content/journal";

export function getEntry(slug: string) {
  return journal.find((entry) => entry.slug === slug) ?? null;
}
