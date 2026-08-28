import { createFileRoute } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { journeyScenes } from "@/components/umberlla/journey-scenes";
import {
  CollectionsSection,
  SiteFooter,
  SiteNav,
  TestimonialsSection,
  VideoReelSection,
  BestsellersSection,
} from "@/components/umberlla/sections";
import { scrollScrubTheme } from "@/scroll-scrub-scenes";

export const Route = createFileRoute("/")({
  component: Index,
});

// The journey is the spine of the page: the scrub controller owns media time
// while every chapter stays server rendered in semantic flow. The site's own
// nav and bespoke CTAs are composed around it.
function Index() {
  return (
    <div className="u-page" id="top">
      <SiteNav />
      <main>
        <ScrollScrub scenes={journeyScenes} theme={scrollScrubTheme} />
        {/* Marks the end of the hero film; the nav flips to its white state here. */}
        <div id="hero-end" aria-hidden="true" />
        <VideoReelSection />
        <BestsellersSection />
        <CollectionsSection />
        <TestimonialsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
