import { createFileRoute } from "@tanstack/react-router";
import { canonical, pageMeta } from "@/lib/seo";
import { SunFactsPage } from "@/components/umberlla/sun-facts-page";

export const Route = createFileRoute("/sun-facts")({
  head: () => ({
    meta: pageMeta({
      title: "Sun Facts | Sun Brand Umbrella",
      description:
        "Discover the material science, UV protection ratings, and precision engineering behind Sun Brand Umbrellas.",
    }),
    links: [canonical("/sun-facts")],
  }),
  component: SunFactsPage,
});
