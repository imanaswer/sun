import { createFileRoute } from "@tanstack/react-router";
import { canonical, pageMeta } from "@/lib/seo";
import { SunCarePage } from "@/components/umberlla/sun-care-page";

export const Route = createFileRoute("/sun-care")({
  head: () => ({
    meta: pageMeta({
      title: "Sun Care | Sun Brand Umbrella",
      description:
        "How to care for your Sun umbrella: dry it before closing, open it pointing upwards, and the right way to open a manual umbrella.",
    }),
    links: [canonical("/sun-care")],
  }),
  component: SunCarePage,
});
