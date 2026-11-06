import { createFileRoute, notFound } from "@tanstack/react-router";
import { MissingPage } from "@/components/missing-page";

export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw notFound();
  },
  component: MissingPage,
});
