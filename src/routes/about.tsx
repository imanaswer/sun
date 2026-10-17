import { createFileRoute } from "@tanstack/react-router";
import { canonical, pageMeta } from "@/lib/seo";
import { AboutPage } from "@/components/umberlla/about-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About Us | Sun Umbrella Private Limited",
      description:
        "Sun Umbrella Private Limited — Pioneer and market leader in umbrella manufacturing in India since 1880. Driven by 5th-generation leadership with 140+ years of trust, durability, and innovation.",
    }),
    links: [canonical("/about")],
  }),
  component: AboutPage,
});
