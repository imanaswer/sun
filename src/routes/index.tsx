import { createFileRoute } from "@tanstack/react-router";

import { ScrollScrub } from "@/components/scroll-scrub/scroll-scrub";
import { journeyScenes } from "@/components/umberlla/journey-scenes";
import { MobileHero, useIsMobile } from "@/components/umberlla/mobile-hero";
import {
  SiteFooter,
  SiteNav,
  TestimonialsSection,
  VideoReelSection,
  BestsellersSection,
  CollectionsSection,
  SunBrandSection,
  RetailSection,
  StoreLocationsSection,
} from "@/components/umberlla/sections";
import { getShopReviews } from "@/lib/api/reviews.functions";
import { getShopifyProducts } from "@/lib/shopify";
import { StructuredData } from "@/components/StructuredData";
import { canonical, organizationJsonLd } from "@/lib/seo";
import { STORES } from "@/sun-data";
import { scrollScrubTheme } from "@/scroll-scrub-scenes";

import ElementalWater from "@/components/elemental-water";

export const Route = createFileRoute("/")({
  // Bestsellers load here rather than in a useEffect so the grid is in the SSR
  // HTML. Shopify going down must not take the homepage with it, so a failure
  // falls back to the static BESTSELLERS copy inside the section.
  loader: async () => {
    const [bestsellers, reviews] = await Promise.all([
      getShopifyProducts({ first: 8 }).catch((error) => {
        console.warn("Shopify bestsellers fetch failed, using static fallback:", error);
        return [];
      }),
      // Judge.me already swallows its own failures; the section hides itself
      // when there is nothing real to show.
      getShopReviews({ data: { perPage: 30 } }).catch(() => []),
    ]);
    return { bestsellers, reviews };
  },
  head: () => ({ links: [canonical("/")] }),
  component: Index,
});

// The journey is the spine of the page: the scrub controller owns media time
// while every chapter stays server rendered in semantic flow. The site's own
// nav and bespoke CTAs are composed around it.
function Index() {
  // Phones can't scrub video frames on scroll without severe jank, so they get
  // a lightweight static hero instead of the desktop scrub controller.
  const isMobile = useIsMobile();
  const { bestsellers, reviews } = Route.useLoaderData();
  return (
    <div className="u-page" id="top">
      <StructuredData json={organizationJsonLd(STORES)} />
      <SiteNav />
      <main>
        {isMobile ? (
          <MobileHero />
        ) : (
          <ScrollScrub scenes={journeyScenes} theme={scrollScrubTheme} />
        )}
        {/* Marks the end of the hero film; the nav flips to its white state here. */}
        <div id="hero-end" aria-hidden="true" />
        <div className="u-section-cream relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ElementalWater />
          </div>
          <VideoReelSection />
          {/* Owns id="collections" — the hero's only CTA scrolls here. */}
          <CollectionsSection />
          <BestsellersSection products={bestsellers} />
        </div>
        <SunBrandSection />
        <TestimonialsSection reviews={reviews} />
        <RetailSection />
        <StoreLocationsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
