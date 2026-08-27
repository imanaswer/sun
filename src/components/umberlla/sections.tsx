/**
 * Sun Umbrella storefront sections. Cinematic hero (owned by ScrollScrub) is
 * composed in the route; these are the storefront body: the monsoon category
 * grid, the bestsellers strip, and the footer. Copy, prices and links come from
 * the live Shopify store via src/sun-data.ts.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { Reveal } from "@/lib/reveal";
import ElementalWater from "./../elemental-water";
import FluidField from "@/components/fluid-field";
import { FindYourSize, GetOne } from "@/components/umberlla/ctas";
import TactileButton from "@/components/tactile-button";
import { BESTSELLERS, COLLECTIONS, REEL, RETAIL, TESTIMONIALS } from "@/sun-data";
import { Video } from "@phosphor-icons/react/dist/ssr";

const SHOP = "https://sunumbrella.in";

// The real Sun Umbrella product categories + sub-categories (from
// sunumbrellas.in), linked to their live category / fold-type pages.
const SU = "https://www.sunumbrellas.in";
const NAV_LINKS = [
  {
    label: "Gents",
    href: `${SU}/GENTS/1/products`,
    items: [
      { label: "2 Fold", href: `${SU}/GENTS/1/frames/9` },
      { label: "3 Fold", href: `${SU}/GENTS/1/frames/10` },
      { label: "Stick & Non-Foldable", href: `${SU}/GENTS/1/frames/12` },
    ],
  },
  {
    label: "Ladies",
    href: `${SU}/LADIES/2/products`,
    items: [
      { label: "2 Fold", href: `${SU}/LADIES/2/frames/9` },
      { label: "3 Fold", href: `${SU}/LADIES/2/frames/10` },
      { label: "Stick & Non-Foldable", href: `${SU}/LADIES/2/frames/12` },
    ],
  },
  {
    label: "Kids",
    href: `${SU}/KIDS/3/products`,
    items: [{ label: "Stick & Non-Foldable", href: `${SU}/KIDS/3/frames/12` }],
  },
  {
    label: "Promotional",
    href: `${SU}/PROMOTIONAL/4/products`,
    items: [
      { label: "2 Fold", href: `${SU}/PROMOTIONAL/4/frames/9` },
      { label: "3 Fold", href: `${SU}/PROMOTIONAL/4/frames/10` },
      { label: "Stick & Non-Foldable", href: `${SU}/PROMOTIONAL/4/frames/12` },
    ],
  },
  {
    label: "Premium",
    href: `${SU}/PREMIUM/5/products`,
    items: [
      { label: "3 Fold", href: `${SU}/PREMIUM/5/frames/10` },
      { label: "Stick & Non-Foldable", href: `${SU}/PREMIUM/5/frames/12` },
    ],
  },
  {
    label: "Exclusive",
    href: `${SU}/EXCLUSIVE/7/products`,
    items: [
      { label: "3 Fold", href: `${SU}/EXCLUSIVE/7/frames/10` },
      { label: "Stick & Non-Foldable", href: `${SU}/EXCLUSIVE/7/frames/12` },
    ],
  },
];

/**
 * Renders its (heavy, e.g. WebGL) children only while the wrapper is near the
 * viewport, and unmounts them when scrolled well away — so continuous canvas
 * effects don't burn the GPU across the whole page. Keeps the fixed positioning
 * wrapper mounted so layout is stable.
 */
function LazyInView({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { rootMargin: "250px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} aria-hidden="true">
      {show ? children : null}
    </div>
  );
}

/** Rotated, white-bordered sticker badge (CRAV-style). */
function Sticker({
  children,
  tone = "yellow",
  rotate = -4,
  className = "",
}: {
  children: ReactNode;
  tone?: "yellow" | "navy" | "cream";
  rotate?: number;
  className?: string;
}) {
  const tones: Record<string, string> = {
    yellow: "bg-[var(--u-yellow)] text-[var(--u-navy)]",
    navy: "bg-[var(--u-navy)] text-white",
    cream: "bg-[var(--u-bone)] text-[var(--u-navy)]",
  };
  return (
    <span
      className={`u-sticker ${tones[tone]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

export function SiteNav() {
  // Transparent over the dark hero (no logo, light links). Once the hero is
  // scrolled past and the white storefront begins, the bar turns white and the
  // logo appears with dark links. Keyed to a #hero-end sentinel after the film.
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
  // Lock the page + stop Lenis while the mobile menu is open.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (menuOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        pastHero
          ? "bg-[var(--u-bone)] shadow-[0_1px_0_rgba(16,27,51,0.08)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-28 md:px-8">
        <a href="#top" className="flex h-12 items-center md:h-24">
          <img
            src="/assets/sun/logo.png"
            alt="Sun Umbrella — trusted over 100 years"
            className={[
              "h-12 w-auto transition-opacity duration-300 md:h-24",
              pastHero ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        </a>
        <nav aria-label="Categories" className="hidden items-center gap-5 lg:gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <div key={l.href} className="group relative">
              <a
                href={l.href}
                className={[
                  "u-mono inline-flex items-center gap-1 whitespace-nowrap text-xs uppercase tracking-[0.14em] transition-colors",
                  pastHero
                    ? "text-[var(--u-navy)]/70 hover:text-[var(--u-navy)]"
                    : "text-[var(--u-bone)]/80 hover:text-[var(--u-bone)]",
                ].join(" ")}
              >
                {l.label}
                <span
                  aria-hidden="true"
                  className="text-[0.7em] opacity-70 transition-transform duration-200 group-hover:rotate-180"
                >
                  &#9662;
                </span>
              </a>
              <div className="pointer-events-none absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="min-w-[210px] overflow-hidden rounded-xl border border-[var(--u-navy)]/10 bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(16,27,51,0.28)]">
                  {l.items.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      className="block rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--u-navy)]/75 transition-colors hover:bg-[var(--u-yellow)] hover:text-[var(--u-navy)]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 rounded-full ${pastHero ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full ${pastHero ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-6 rounded-full ${pastHero ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}`}
            />
          </span>
        </button>
      </div>
    </header>

    {/* Full-screen mobile menu */}
    <div
      className={[
        "fixed inset-0 z-[60] flex flex-col bg-[var(--u-bone)] transition-[opacity,transform] duration-300 md:hidden",
        menuOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <img src="/assets/sun/logo.png" alt="Sun Umbrella" className="h-11 w-auto" />
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="grid h-10 w-10 place-items-center rounded-full bg-[var(--u-navy)]/[0.06] text-2xl leading-none text-[var(--u-navy)] transition-colors active:bg-[var(--u-navy)]/10"
        >
          &times;
        </button>
      </div>
      <nav aria-label="Categories" className="flex-1 overflow-y-auto px-6 pb-10">
        {NAV_LINKS.map((l, i) => (
          <div
            key={l.href}
            className="border-t border-[var(--u-navy)]/10 py-4 first:border-t-0"
          >
            <a
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline justify-between gap-3"
            >
              <span className="u-fun-head text-[2rem] leading-none text-[var(--u-navy)]">
                {l.label}
              </span>
              <span className="u-mono text-[11px] tracking-[0.1em] text-[var(--u-navy)]/35">
                {`0${i + 1}`}
              </span>
            </a>
            <div className="mt-3 flex flex-wrap gap-2">
              {l.items.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  onClick={() => setMenuOpen(false)}
                  className="u-mono rounded-full bg-[var(--u-navy)]/[0.05] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--u-navy)]/65 transition-colors active:bg-[var(--u-yellow)] active:text-[var(--u-navy)]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 border-t border-[var(--u-navy)]/10 pt-7">
          <GetOne
            href={`${SU}/GENTS/1/products`}
            className="w-full justify-center"
          >
            Shop all umbrellas
          </GetOne>
          <div className="u-mono mt-6 space-y-1.5 text-xs uppercase tracking-[0.14em] text-[var(--u-navy)]/60">
            <a href="mailto:info@sunumbrellas.in" className="block">
              info@sunumbrellas.in
            </a>
            <a href="tel:+918212514578" className="block">
              +91 821 2514578
            </a>
            <p className="text-[var(--u-navy)]/40">Mysuru · Mumbai · Calicut</p>
          </div>
        </div>
      </nav>
    </div>
    </>
  );
}

/**
 * A single reel clip. The mp4s are large, so nothing loads until the card
 * scrolls into view (preload="none" + IntersectionObserver), then it autoplays
 * muted/looping and pauses again when it leaves the viewport.
 */
function ReelVideo({ src, poster, label, caption, href, index }: (typeof REEL)[number] & { index: number }) {
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
      className={[
        "u-tilt-card u-wobble group relative block w-[76vw] max-w-[300px] shrink-0 snap-center bg-black sm:w-auto",
        index % 2 === 0 ? "u-tilt-left" : "u-tilt-right",
      ].join(" ")}
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
      className="u-section-cream relative overflow-hidden px-5 py-24 md:px-8 md:py-32"
    >
      <LazyInView className="absolute inset-0 z-0">
        <ElementalWater />
      </LazyInView>

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Sticker tone="yellow" rotate={-5} className="mb-6">
          ☂ Next-Gen
        </Sticker>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="u-fun-heading max-w-[16ch] shrink-0 text-5xl md:text-7xl !text-[#F3EFE4]">
            Designed for style. Built for all weather.
          </h2>

          <div className="shrink-0">
            <TactileButton link={`${SHOP}/collections/all`} />
          </div>
        </div>

        <div className="mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REEL.map((r, i) => (
            <ReelVideo key={r.label} {...r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Tilted marquee strip — scrolling monsoon feature callouts. */
function MonsoonMarquee() {
  const items = "☂ MONSOON READY \u00A0\u00A0 AUTO OPEN & CLOSE \u00A0\u00A0 UV PROTECTIVE \u00A0\u00A0 WINDPROOF \u00A0\u00A0 EST. 1889 \u00A0\u00A0 ";
  return (
    <div className="u-marquee-banner" aria-hidden="true">
      <div className="u-marquee">
        <span>{items}</span>
        <span>{items}</span>
        <span>{items}</span>
        <span>{items}</span>
      </div>
    </div>
  );
}

export function CollectionsSection() {
  return (
    <>
      {/* Tilted marquee divider */}
      <MonsoonMarquee />

      <section
        id="collections"
        className="u-section-warm px-5 py-24 md:px-8 md:py-32"
      >
        {/* Diagonal stripe overlay */}
        <div className="u-stripes" aria-hidden="true" />

        {/* Floating rain-splash illustration */}

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <Sticker tone="navy" rotate={-4} className="mb-6">
            ☂ Monsoon Essentials
          </Sticker>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="u-fun-heading max-w-[14ch] text-5xl md:text-7xl">
              Find your umbrella
            </h2>
            <FindYourSize href={`${SHOP}/collections/all`} className="on-light" />
          </div>

          <Reveal className="mt-16 grid gap-8 md:grid-cols-6" stagger>
            {COLLECTIONS.map((c, index) => (
              <a
                key={c.name}
                href={c.href}
                className="u-card-on-yellow group relative flex flex-col md:col-span-3"
                style={{ transform: `rotate(${index % 2 === 0 ? -1.5 : 1.5}deg)` }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={c.image}
                    alt={`${c.name} umbrellas by Sun Umbrella`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  {/* Sticker badge on top-right of image */}
                  <Sticker
                    tone="yellow"
                    rotate={6}
                    className="absolute top-3 right-3 text-[11px]"
                  >
                    {c.sub}
                  </Sticker>
                </div>
                <div className="flex flex-1 flex-col bg-white p-6">
                  <h3 className="text-2xl font-bold tracking-tight text-[var(--u-navy)]" style={{ fontFamily: "var(--u-fun)" }}>
                    {c.name}
                  </h3>
                  <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-[var(--u-navy)]/65">
                    {c.blurb}
                  </p>
                  <span className="u-mono mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--u-navy)]">
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
    </>
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
          <TactileButton link={`${SHOP}/collections/all`} />
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
    <section id="reviews" className="u-section-cream relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
      <LazyInView className="absolute inset-0 z-0">
        <FluidField />
      </LazyInView>
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[560px] flex-col items-center text-center"
        >
          <Sticker tone="yellow" rotate={6} className="mb-5">
            ❤️ Loved
          </Sticker>
          <h2 className="u-fun-heading mt-2 text-4xl md:text-6xl !text-[#F3EFE4]">
            What our customers say
          </h2>
          <p className="mt-4 text-[#F3EFE4]">
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
      className="border-t border-[var(--u-navy)]/10 bg-[var(--u-bone)] px-5 pt-20 pb-10 md:px-8"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 md:grid-cols-4 md:gap-10">
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
            <div className="mt-4 grid grid-cols-2 gap-2">
              {RETAIL.map((r) => (
                <div
                  key={r.name}
                  className="relative flex h-9 items-center justify-center overflow-hidden rounded-lg border border-[var(--u-navy)]/12 bg-white"
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="h-4 w-auto max-w-[80%] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mt-20 inline-block w-full">
          <p
            aria-hidden="true"
            className="u-wordmark w-full text-[13vw] uppercase leading-[0.82] text-[var(--u-navy)]/[0.07]"
          >
            Sun Umbrella
          </p>
          <Sticker
            tone="yellow"
            rotate={-8}
            className="absolute bottom-4 right-[10%] text-sm"
          >
            Est. 1889
          </Sticker>
        </div>
        <p className="u-mono mt-8 text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/50">
          Sun Umbrella · Est. 1889 · Mysuru, India. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
