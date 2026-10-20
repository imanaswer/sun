import { Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { Sticker } from "@/components/umberlla/about";
import DottedBg2 from "@/components/dotted-bg-2";
import { ArrowUp, Drop, HandTap } from "@phosphor-icons/react";

// Wording supplied by the business (Website changes deck) — keep it verbatim.
// ponytail: text only; add the manual and auto open/close clips here once
// the business sends them.
const TIPS = [
  { Icon: Drop, title: "Dry Umbrellas before closing." },
  { Icon: ArrowUp, title: "Always open Umbrella pointing upwards." },
  {
    Icon: HandTap,
    title:
      "For Manual umbrella, please extend the shaft first and then open the canopy. While opening the canopy, do not press the button on the runner. Button on the runner is only for closing the canopy.",
  },
];

export function SunCarePage() {
  return (
    <div className="min-h-screen bg-[var(--u-paper)] text-[var(--u-ink)] overflow-hidden">
      <SiteNav />

      <section className="relative u-section-warm overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 border-b-4 border-[var(--u-ink)]">
        <div className="absolute inset-0 z-0">
          <DottedBg2 bgColor="var(--u-yellow)" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-8 text-center">
          <Sticker tone="navy" rotate={-2} className="mb-6 mx-auto text-xs sm:text-sm py-2 px-5">
            ☂ MAKE IT LAST
          </Sticker>
          <h1 className="u-fun-heading text-5xl sm:text-7xl md:text-8xl text-[var(--u-ink)] max-w-[16ch] mx-auto leading-[0.98] drop-shadow-sm">
            Sun Care
          </h1>
          <p className="mt-6 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[var(--u-ink)]/85 max-w-[52ch] mx-auto leading-relaxed">
            A few simple habits keep your Sun umbrella opening smoothly, monsoon
            after monsoon.
          </p>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-[960px] px-5 py-16 md:py-24 space-y-8">
        <ol className="space-y-6">
          {TIPS.map(({ Icon, title }, i) => (
            <li
              key={title}
              className="flex items-start gap-5 rounded-[28px] bg-white p-6 md:p-9 border-4 border-[var(--u-ink)] shadow-[6px_6px_0_0_var(--u-ink)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--u-yellow)] text-[var(--u-ink)] border-2 border-[var(--u-ink)]">
                <Icon size={24} weight="bold" />
              </div>
              <p className="pt-1.5 text-lg md:text-2xl font-bold leading-snug text-[var(--u-ink)]">
                <span className="u-mono mr-2 text-[var(--u-ink)]/50">{i + 1}.</span>
                {title}
              </p>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <Link
            to="/sun-facts"
            className="u-mono rounded-full bg-[var(--u-ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white"
          >
            Read Sun Facts
          </Link>
          <Link
            to="/contact"
            className="u-mono rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--u-ink)] border-2 border-[var(--u-ink)]"
          >
            Ask us a question
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
