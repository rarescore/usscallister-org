export type JournalBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type JournalEntry = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  category?: string;
  primaryKeyword?: string;
  searchIntent?: string;
  standfirst: string;
  image: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  imageCaption?: string;
  relatedSlugs?: string[];
  blocks: JournalBlock[];
};
