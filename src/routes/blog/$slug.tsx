import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { getEntry } from "@/content/journal-api";

export const Route = createFileRoute("/blog/$slug")({
  beforeLoad: ({ params }) => {
    if (!getEntry(params.slug)) throw notFound();
    throw redirect({ to: "/journal/$slug", params: { slug: params.slug }, statusCode: 308 });
  },
});
