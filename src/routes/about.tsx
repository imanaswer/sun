import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { AboutStats, AboutStory, AboutValues } from "@/components/umberlla/about";
import { canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About us",
      description:
        "Sun Umbrella has stood between India and the sky for 100+ years — made in Mysuru, tested in-house, sold through 200+ retail partners.",
    }),
    links: [canonical("/about")],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="u-page u-light" style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}>
      <SiteNav />

      <main className="mx-auto max-w-[1200px] px-5 py-32 md:px-8">
        <span className="u-mono text-xs uppercase tracking-[0.18em]" style={{ color: "var(--u-accent-text)" }}>
          About us
        </span>
        <h1 className="u-fun-head mt-4 max-w-[18ch] text-4xl leading-[1.04] md:text-6xl">
          A hundred monsoons of practice.
        </h1>
        <p className="mt-5 max-w-[58ch] text-sm leading-relaxed md:text-base" style={{ color: "var(--u-muted)" }}>
          Sun Umbrella makes umbrellas in Mysuru and sells them across India —
          non-fold, 2 fold, 3 fold, kids, golf and promotional, from the same
          floor, to the same standard.
        </p>

        <div className="mt-16 border-y py-12 md:mt-20" style={{ borderColor: "var(--u-slate)" }}>
          <AboutStats />
        </div>

        <div className="mt-20 md:mt-28">
          <AboutStory />
        </div>

        <div className="mt-24 md:mt-32">
          <h2 className="u-fun-head text-center text-3xl md:text-5xl" style={{ color: "var(--u-bone)" }}>
            Our core <span style={{ color: "var(--u-accent-text)" }}>values</span>
          </h2>
          <div className="mt-12">
            <AboutValues />
          </div>
        </div>

        <div
          className="mt-24 flex flex-col items-start gap-6 rounded-[28px] p-8 md:mt-32 md:flex-row md:items-center md:justify-between md:p-10"
          style={{ border: "1px solid var(--u-slate)", background: "var(--u-card)" }}
        >
          <div>
            <h2 className="u-fun-head text-2xl md:text-3xl" style={{ color: "var(--u-bone)" }}>
              Come find yours.
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--u-muted)" }}>
              Browse the catalogue, or talk to the Mysuru office about a bulk or
              corporate order.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/collections/$handle"
              params={{ handle: "all" }}
              className="u-mono rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
            >
              Shop all umbrellas
            </Link>
            <Link
              to="/contact"
              className="u-mono rounded-full px-6 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors"
              style={{ border: "1px solid var(--u-slate)", color: "var(--u-bone)" }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </main>

      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}
