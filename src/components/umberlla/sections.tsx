/**
 * Sun Umbrella storefront sections. Cinematic hero (owned by ScrollScrub) is
 * composed in the route; these are the storefront body: the monsoon category
 * grid, the bestsellers strip, and the footer. Copy, prices and links come from
 * the live Shopify store via src/sun-data.ts.
 */
import { useEffect, useRef } from "react";

import { FindYourSize, GetOne, ShopTheRange } from "@/components/umberlla/ctas";
import { BESTSELLERS, COLLECTIONS, REEL, RETAIL } from "@/sun-data";

const SHOP = "https://sunumbrella.in";

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--u-slate)]/60 bg-[var(--u-navy)]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-lg bg-white px-2 py-1">
            <img
              src="/assets/sun/logo.png"
              alt="Sun Umbrella — trusted over 100 years"
              className="h-10 w-auto"
            />
          </span>
          <span className="u-mono hidden text-[10px] uppercase tracking-[0.2em] text-[var(--u-yellow)] sm:inline">
            Est. 1889
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
          <a
            href="#collections"
            className="u-mono text-xs uppercase tracking-[0.18em] text-[var(--u-muted)] transition-colors hover:text-[var(--u-bone)]"
          >
            Collections
          </a>
          <a
            href="#next-gen"
            className="u-mono text-xs uppercase tracking-[0.18em] text-[var(--u-muted)] transition-colors hover:text-[var(--u-bone)]"
          >
            Watch
          </a>
          <a
            href="#contact"
            className="u-mono text-xs uppercase tracking-[0.18em] text-[var(--u-muted)] transition-colors hover:text-[var(--u-bone)]"
          >
            Contact
          </a>
        </nav>
        <ShopTheRange />
      </div>
    </header>
  );
}

/**
 * A single reel clip. The mp4s are large, so nothing loads until the card
 * scrolls into view (preload="none" + IntersectionObserver), then it autoplays
 * muted/looping and pauses again when it leaves the viewport.
 */
function ReelVideo({ src, poster, label, caption, href }: (typeof REEL)[number]) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={href}
      className="group relative block w-[76vw] max-w-[300px] shrink-0 snap-center overflow-hidden rounded-xl border border-[var(--u-slate)]/70 bg-black transition-colors hover:border-[var(--u-yellow)] sm:w-auto"
    >
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${label} — ${caption}`}
        className="aspect-[9/16] w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
        <p className="u-mono text-[10px] uppercase tracking-[0.18em] text-[var(--u-yellow)]">
          {caption}
        </p>
        <p className="mt-1 text-lg font-semibold tracking-tight text-white">
          {label}
        </p>
      </div>
    </a>
  );
}

export function VideoReelSection() {
  return (
    <section
      id="next-gen"
      className="bg-[var(--u-well)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="u-mono mb-5 text-xs uppercase tracking-[0.28em] text-[var(--u-yellow)]">
          Next-gen premium umbrellas
        </p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="u-rise max-w-[18ch] text-4xl font-semibold tracking-tighter text-[var(--u-bone)] md:text-6xl">
            Designed for style. Built for all weather.
          </h2>
          <GetOne href={`${SHOP}/collections/all`}>Shop all umbrellas</GetOne>
        </div>

        <div className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REEL.map((r) => (
            <ReelVideo key={r.label} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CollectionsSection() {
  return (
    <section
      id="collections"
      className="bg-[var(--u-navy)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="u-mono mb-5 text-xs uppercase tracking-[0.28em] text-[var(--u-yellow)]">
          The monsoon essentials
        </p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="u-rise max-w-[16ch] text-4xl font-semibold tracking-tighter text-[var(--u-bone)] md:text-6xl">
            Find your umbrella
          </h2>
          <FindYourSize href={`${SHOP}/collections/all`} />
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-6">
          {COLLECTIONS.map((c, index) => (
            <a
              key={c.name}
              href={c.href}
              className={[
                "u-card group relative flex flex-col overflow-hidden border border-[var(--u-slate)]/70 bg-[var(--u-well)] transition-colors hover:border-[var(--u-yellow)]",
                // Asymmetric: first card is a tall feature, rest fill the grid.
                index === 0 ? "md:col-span-3 md:row-span-2" : "md:col-span-3",
              ].join(" ")}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={c.image}
                  alt={`${c.name} umbrellas by Sun Umbrella`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--u-navy)] via-transparent to-transparent opacity-80" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--u-bone)]">
                    {c.name}
                  </h3>
                  <span className="u-mono text-[11px] uppercase tracking-[0.16em] text-[var(--u-yellow)]">
                    {c.sub}
                  </span>
                </div>
                <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-[var(--u-muted)]">
                  {c.blurb}
                </p>
                <span className="u-mono mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--u-bone)]">
                  Shop {c.name}
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    &rarr;
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BestsellersSection() {
  return (
    <section
      id="bestsellers"
      className="bg-[var(--u-well)] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="u-mono mb-5 text-xs uppercase tracking-[0.28em] text-[var(--u-yellow)]">
          Bestsellers you&rsquo;ll love
        </p>
        <h2 className="max-w-[20ch] text-4xl font-semibold tracking-tighter text-[var(--u-bone)] md:text-5xl">
          Carried across India
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BESTSELLERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="group flex flex-col overflow-hidden border border-[var(--u-slate)]/70 bg-[var(--u-navy)] transition-colors hover:border-[var(--u-yellow)]"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="u-mono text-[10px] uppercase tracking-[0.18em] text-[var(--u-muted)]">
                  {p.tag}
                </span>
                <h3 className="mt-2 flex-1 text-base font-medium leading-snug text-[var(--u-bone)]">
                  {p.name}
                </h3>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="u-mono text-sm text-[var(--u-yellow)]">
                    {p.price}
                  </span>
                  <span className="u-mono inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[var(--u-bone)]">
                    View
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-[var(--u-slate)]/60 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="max-w-[20ch] text-2xl font-semibold tracking-tight text-[var(--u-bone)] md:text-3xl">
              135 years of sheltering India.
            </h3>
            <p className="u-mono mt-3 text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Auto open &amp; close · UV protective · windproof
            </p>
          </div>
          <GetOne href={`${SHOP}/collections/all`}>Shop all umbrellas</GetOne>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="bg-[var(--u-navy)] px-5 pt-20 pb-10 md:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Shop
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-bone)]">
              {COLLECTIONS.map((c) => (
                <li key={c.name}>
                  <a className="hover:text-[var(--u-yellow)]" href={c.href}>
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Company
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-bone)]">
              <li>
                <a className="hover:text-[var(--u-yellow)]" href={`${SHOP}/pages/about-us`}>
                  Our heritage
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[var(--u-yellow)]"
                  href={`${SHOP}/collections/promotional-umbrella`}
                >
                  Corporate &amp; branding
                </a>
              </li>
              <li>
                <a className="hover:text-[var(--u-yellow)]" href={`${SHOP}/pages/contact`}>
                  Store locations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-bone)]">
              <li>
                <a
                  className="hover:text-[var(--u-yellow)]"
                  href="mailto:info@sunumbrellas.in"
                >
                  info@sunumbrellas.in
                </a>
              </li>
              <li>
                <a className="hover:text-[var(--u-yellow)]" href="tel:+918212514578">
                  +91 821 2514578
                </a>
              </li>
              <li className="text-[var(--u-muted)]">Mysuru · Mumbai · Calicut</li>
            </ul>
          </div>
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Our retail circle
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {RETAIL.map((r) => (
                <span
                  key={r.name}
                  className="inline-flex h-9 items-center rounded-md bg-[var(--u-bone)] px-2.5"
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="h-4 w-auto object-contain"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
        <p
          aria-hidden="true"
          className="u-wordmark mt-20 w-full text-[13vw] uppercase leading-[0.82] text-[var(--u-yellow)]"
        >
          Sun Umbrella
        </p>
        <p className="u-mono mt-8 text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
          Sun Umbrella · Est. 1889 · Mysuru, India. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
