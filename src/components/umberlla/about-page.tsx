import { Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import {
  AboutFootprint,
  AboutMarquee,
  AboutMissionVision,
  AboutStats,
  AboutStory,
  AboutValues,
  Sticker,
} from "@/components/umberlla/about";
import DottedBg2 from "@/components/dotted-bg-2";

export function AboutPage() {
  return (
    <div className="u-page bg-[var(--u-paper)] text-[var(--u-ink)] overflow-hidden min-h-screen">
      <SiteNav />

      {/* ─── Hero Section with warm cream background and paper grain ─── */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-48 md:pb-28">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'url("/assets/background.webp")',
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        />
        <div className="absolute inset-0 z-0 opacity-40">
          <DottedBg2 bgColor="transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 md:px-8 text-center">
          <Sticker
            tone="navy"
            rotate={-2}
            className="mb-6 mx-auto text-xs sm:text-sm py-2 px-5"
          >
            ☂ 100+ YEARS · 5TH GENERATION LEADERSHIP
          </Sticker>

          <h1 className="u-fun-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--u-ink)] max-w-[20ch] mx-auto leading-[0.98]">
            100+ Years of Trust, Durability & Innovation.
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-[var(--u-ink)]/80 max-w-[58ch] mx-auto leading-relaxed">
            Sun Umbrella Private Limited is a pioneer and market leader in
            umbrella manufacturing in India. Sheltering generations through every
            storm with unmatched craftsmanship for 100+ years.
          </p>

          {/* Stats Pop Cards */}
          <div className="mt-16 md:mt-20">
            <AboutStats />
          </div>
        </div>
      </section>

      {/* ─── Tilted Marquee Divider ─── */}
      <AboutMarquee />

      {/* ─── Company Profile Section ─── */}
      <section className="relative px-5 py-24 md:px-8 md:py-32 bg-[var(--u-paper)] overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'url("/assets/background.webp")',
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1300px]">
          <AboutStory />
        </div>
      </section>

      {/* ─── Mission & Vision Section ─── */}
      <section className="relative px-5 py-24 md:px-8 md:py-32 bg-[var(--u-bone)] border-y-4 border-[var(--u-ink)] overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'url("/assets/background.webp")',
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1300px]">
          <div className="text-center mb-16">
            <Sticker tone="yellow" rotate={-3} className="mb-4">
              🎯 Purpose & Horizon
            </Sticker>
            <h2 className="u-fun-heading text-4xl sm:text-5xl md:text-6xl text-[var(--u-ink)]">
              Mission & Vision
            </h2>
            <p className="mt-3 text-lg font-medium text-[var(--u-ink)]/70 max-w-[50ch] mx-auto">
              The dual pillars guiding our craft, our people, and our generations
              of service.
            </p>
          </div>
          <AboutMissionVision />
        </div>
      </section>

      {/* ─── Global & Domestic Footprint Section ─── */}
      <section className="relative px-5 py-24 md:px-8 md:py-32 bg-[var(--u-paper)] overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'url("/assets/background.webp")',
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1300px]">
          <div className="text-center mb-16">
            <Sticker tone="navy" rotate={2} className="mb-4">
              🌍 Scale & Reach
            </Sticker>
            <h2 className="u-fun-heading text-4xl sm:text-5xl md:text-6xl text-[var(--u-ink)]">
              Global & Domestic <span className="text-[var(--u-yellow)]">Footprint</span>
            </h2>
            <p className="mt-4 text-lg md:text-xl font-medium text-[var(--u-ink)]/75 max-w-[62ch] mx-auto">
              Supplying India’s retail giants, quick-commerce leaders, premier
              corporate enterprises, and high-volume international export
              markets.
            </p>
          </div>
          <AboutFootprint />
        </div>
      </section>

      {/* ─── Core Values Section ─── */}
      <section className="relative px-5 py-24 md:px-8 md:py-32 bg-[var(--u-bone)] border-t-4 border-[var(--u-ink)] overflow-hidden">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'url("/assets/background.webp")',
            backgroundRepeat: "repeat",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1300px]">
          <div className="text-center mb-16">
            <Sticker tone="yellow" rotate={-2} className="mb-4">
              💡 The Sun Standard
            </Sticker>
            <h2 className="u-fun-heading text-4xl sm:text-5xl md:text-6xl text-[var(--u-ink)]">
              Our Core Values
            </h2>
            <p className="mt-3 text-lg font-medium text-[var(--u-ink)]/70 max-w-[52ch] mx-auto">
              Four timeless commitments that have steered Sun Umbrella through
              100+ years of monsoons.
            </p>
          </div>
          <AboutValues />
        </div>
      </section>

      {/* ─── Final CTA Banner ─── */}
      <section className="relative px-5 py-20 md:px-8 md:py-28 bg-[var(--u-paper)] overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <div className="rounded-[32px] bg-[var(--u-yellow)] p-10 md:p-16 border-4 border-[var(--u-ink)] shadow-[8px_8px_0_0_rgba(16,27,51,1)] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-[600px] text-center md:text-left">
              <Sticker
                tone="white"
                rotate={-3}
                className="mb-4 text-xs font-bold uppercase"
              >
                ☂ Ready for Any Weather
              </Sticker>
              <h2 className="u-fun-heading text-3xl sm:text-4xl md:text-5xl text-[var(--u-ink)]">
                Partner with Sun Brand Umbrella
              </h2>
              <p className="mt-3 text-base md:text-lg font-medium text-[var(--u-ink)]/80">
                Explore our retail umbrellas, or connect with our teams in
                Mumbai, Calicut, or Mysore for corporate gifting and high-volume
                orders.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/collections/$handle"
                params={{ handle: "all" }}
                className="u-mono rounded-full bg-[var(--u-ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:bg-[var(--u-ink)]/90 transition-transform hover:scale-105"
              >
                Shop Umbrellas
              </Link>
              <Link
                to="/contact"
                className="u-mono rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--u-ink)] border-2 border-[var(--u-ink)] shadow-[4px_4px_0_0_rgba(16,27,51,1)] hover:bg-white/90 transition-transform hover:scale-105"
              >
                Contact Offices
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
