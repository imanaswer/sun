/**
 * Sun Umbrella storefront sections. Cinematic hero (owned by ScrollScrub) is
 * composed in the route; these are the storefront body: the monsoon category
 * grid, the bestsellers strip, and the footer. Copy, prices and links come from
 * the live Shopify store via src/sun-data.ts.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { Reveal } from "@/lib/reveal";
import { FindYourSize, GetOne } from "@/components/umberlla/ctas";
import { BESTSELLERS, COLLECTIONS, REEL, RETAIL, TESTIMONIALS } from "@/sun-data";

const SHOP = "https://sunumbrella.in";

const NAV_LINKS = [
  { href: "#collections", label: "Collections" },
  { href: "#next-gen", label: "Watch" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  // Transparent over the dark hero (no logo, light links). Once the hero is
  // scrolled past and the white storefront begins, the bar turns white and the
  // logo appears with dark links. Keyed to a #hero-end sentinel after the film.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const check = () => {
      const sentinel = document.getElementById("hero-end");
      if (sentinel) setPastHero(sentinel.getBoundingClientRect().top < 90);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        pastHero
          ? "bg-white shadow-[0_1px_0_rgba(16,27,51,0.08)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-24 max-w-[1400px] items-center justify-between px-5 md:h-28 md:px-8">
        <a href="#top" className="flex h-20 items-center md:h-24">
          <img
            src="/assets/sun/logo.png"
            alt="Sun Umbrella — trusted over 100 years"
            className={[
              "h-20 w-auto transition-opacity duration-300 md:h-24",
              pastHero ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={[
                "u-mono text-xs uppercase tracking-[0.18em] transition-colors",
                pastHero
                  ? "text-[var(--u-navy)]/70 hover:text-[var(--u-navy)]"
                  : "text-[var(--u-bone)]/80 hover:text-[var(--u-bone)]",
              ].join(" ")}
            >
              {l.label}
            </a>
          ))}
        </nav>
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
      className="bg-white px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="u-mono mb-5 text-xs uppercase tracking-[0.28em] text-[var(--u-navy)]/55">
          Next-gen premium umbrellas
        </p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="u-rise max-w-[18ch] text-4xl font-semibold tracking-tighter text-[var(--u-navy)] md:text-6xl">
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
      className="bg-white px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <p className="u-mono mb-5 text-xs uppercase tracking-[0.28em] text-[var(--u-navy)]/55">
          The monsoon essentials
        </p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="u-rise max-w-[16ch] text-4xl font-semibold tracking-tighter text-[var(--u-navy)] md:text-6xl">
            Find your umbrella
          </h2>
          <FindYourSize href={`${SHOP}/collections/all`} className="on-light" />
        </div>

        <Reveal className="mt-16 grid gap-6 md:grid-cols-6" stagger>
          {COLLECTIONS.map((c, index) => (
            <a
              key={c.name}
              href={c.href}
              className={[
                "u-card u-lift group relative flex flex-col overflow-hidden rounded-xl border border-[var(--u-navy)]/12 bg-white shadow-[0_1px_2px_rgba(16,27,51,0.06)] hover:border-[var(--u-navy)]/40",
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
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--u-navy)]">
                    {c.name}
                  </h3>
                  <span className="u-mono text-[11px] uppercase tracking-[0.16em] text-[var(--u-navy)]/50">
                    {c.sub}
                  </span>
                </div>
                <p className="mt-3 max-w-[44ch] text-sm leading-relaxed text-[var(--u-navy)]/65">
                  {c.blurb}
                </p>
                <span className="u-mono mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--u-navy)]">
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
        </Reveal>
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

const reviewCol1 = TESTIMONIALS.slice(0, 3);
const reviewCol2 = TESTIMONIALS.slice(3, 6);
const reviewCol3 = TESTIMONIALS.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section id="reviews" className="bg-white px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[560px] flex-col items-center text-center"
        >
          <p className="u-mono text-xs uppercase tracking-[0.28em] text-[var(--u-navy)]/55">
            Loved across India
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-[var(--u-navy)] md:text-5xl">
            What our customers say
          </h2>
          <p className="mt-4 text-[var(--u-navy)]/65">
            135 years of keeping India dry — here&rsquo;s what people carry, and why.
          </p>
        </motion.div>

        <div className="mt-14 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={reviewCol1} duration={15} />
          <TestimonialsColumn
            testimonials={reviewCol2}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={reviewCol3}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-[var(--u-navy)]/10 bg-white px-5 pt-20 pb-10 md:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/50">
              Shop
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-navy)]/80">
              {COLLECTIONS.map((c) => (
                <li key={c.name}>
                  <a className="hover:text-[var(--u-navy)]" href={c.href}>
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/50">
              Company
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-navy)]/80">
              <li>
                <a className="hover:text-[var(--u-navy)]" href={`${SHOP}/pages/about-us`}>
                  Our heritage
                </a>
              </li>
              <li>
                <a
                  className="hover:text-[var(--u-navy)]"
                  href={`${SHOP}/collections/promotional-umbrella`}
                >
                  Corporate &amp; branding
                </a>
              </li>
              <li>
                <a className="hover:text-[var(--u-navy)]" href={`${SHOP}/pages/contact`}>
                  Store locations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/50">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-navy)]/80">
              <li>
                <a
                  className="hover:text-[var(--u-navy)]"
                  href="mailto:info@sunumbrellas.in"
                >
                  info@sunumbrellas.in
                </a>
              </li>
              <li>
                <a className="hover:text-[var(--u-navy)]" href="tel:+918212514578">
                  +91 821 2514578
                </a>
              </li>
              <li className="text-[var(--u-navy)]/50">Mysuru · Mumbai · Calicut</li>
            </ul>
          </div>
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/50">
              Our retail circle
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {RETAIL.map((r) => (
                <span
                  key={r.name}
                  className="inline-flex h-9 items-center rounded-md border border-[var(--u-navy)]/12 bg-white px-2.5"
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
          className="u-wordmark mt-20 w-full text-[13vw] uppercase leading-[0.82] text-[var(--u-navy)]/[0.07]"
        >
          Sun Umbrella
        </p>
        <p className="u-mono mt-8 text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/50">
          Sun Umbrella · Est. 1889 · Mysuru, India. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
