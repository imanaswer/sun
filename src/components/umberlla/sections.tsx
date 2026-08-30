/**
 * Sun Umbrella storefront sections. Cinematic hero (owned by ScrollScrub) is
 * composed in the route; these are the storefront body: the monsoon category
 * grid, the bestsellers strip, and the footer. Copy, prices and links come from
 * the live Shopify store via src/sun-data.ts.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import LiquidGrid from "../liquid-grid";
import DottedBg2 from "../dotted-bg-2";
import { TypeSequence } from "@/components/umberlla/type-sequence";

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { Reveal } from "@/lib/reveal";
import StickerPeeling from "@/components/sticker-peeling";
import ElementalWater from "./../elemental-water";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Particles } from "@/components/ui/particles";
import { ProductFocusCarousel } from "@/components/ui/product-focus-carousel";
import FluidField from "@/components/fluid-field";
import { FindYourSize, GetOne } from "@/components/umberlla/ctas";
import TactileButton from "@/components/tactile-button";
import {
  BESTSELLERS,
  BRANDS,
  COLLECTIONS,
  REEL,
  RETAIL,
  TESTIMONIALS,
  STORES,
} from "@/sun-data";
import { Video, Phone, MapPin, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

const SHOP = "https://sunumbrella.in";

// The real Sun Umbrella product categories + sub-categories (from
// sunumbrellas.in), linked to their live category / fold-type pages.
const SU = "https://www.sunumbrellas.in";
const NAV_LINKS = [
  {
    label: "Non-Fold",
    href: "#",
    items: [
      { label: "Black", href: "https://sunumbrella.in/collections/non-fold-black-umbrellas" },
      { label: "Colors", href: "https://sunumbrella.in/collections/non-fold-color-umbrellas" },
    ],
  },
  {
    label: "2 Fold",
    href: "#",
    items: [
      { label: "Black", href: "https://sunumbrella.in/collections/2-fold-umbrella-black-catagory" },
      { label: "Colors", href: "https://sunumbrella.in/collections/2-fold-colors-umbrella" },
    ],
  },
  {
    label: "3 Fold",
    href: "#",
    items: [
      { label: "Black", href: "https://sunumbrella.in/collections/2-fold-colors-umbrella" },
      { label: "Colors", href: "https://sunumbrella.in/collections/3-fols-colour-umbrelllas" },
    ],
  },
  {
    label: "Kids",
    href: "https://sunumbrella.in/collections/kids-umbrellas-tuesday",
  },
  {
    label: "Promotional",
    href: "https://sunumbrella.in/collections/promotional-umbrella",
  },
];

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<"light" | "dark">("light");
  const [navVisible, setNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  useEffect(() => {
    const check = () => {
      const sentinel = document.getElementById("hero-end");
      setIsScrolled(window.scrollY > 20);

      let currentTheme: "light" | "dark" = "light";
      
      // Determine theme based on the section currently under the header (approx 45px down)
      const sections = Array.from(document.querySelectorAll("section"));
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 90 && rect.bottom >= 90) {
          if (sec.id === "next-gen" || sec.id === "bestsellers") {
            currentTheme = "light";
          } else {
            currentTheme = "dark";
          }
          break;
        }
      }

      // Handle footer
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top <= 90) currentTheme = "dark";
      }

      // If we are above hero-end, we are in the hero (light text)
      if (sentinel && sentinel.getBoundingClientRect().top >= 90) {
        currentTheme = "light";
      }

      setNavTheme(currentTheme);

      // Hide nav if scrolled past the Collections section
      const collections = document.getElementById("collections");
      if (collections) {
        setNavVisible(collections.getBoundingClientRect().bottom >= 50);
      } else {
        setNavVisible(true);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  // Lock the page while the mobile menu is open.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header className={[
      "fixed inset-x-0 top-0 z-50 bg-transparent transition-all duration-300 pt-4 md:pt-4",
      navVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
    ].join(" ")}>
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-28 md:px-8">
        <a href="#top" className="flex h-12 items-center md:h-24">
          <div className={[
            "flex flex-col items-center transition-opacity duration-300",
            isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
          ].join(" ")}>
            <img
              src="/assets/sun/logo-icon-transparent.png"
              alt="Sun Umbrella"
              className="h-8 w-auto md:h-16"
            />
            <div className="flex flex-col items-center mt-1 font-sans">
              <span className="text-[10px] md:text-sm font-black tracking-wider text-white leading-none">
                Umbrellas
              </span>
              <span className="text-[6px] md:text-[8px] font-medium tracking-tight text-white/80 mt-0.5 whitespace-nowrap">
                Trusted over 100 years
              </span>
            </div>
          </div>
        </a>
        <svg width="0" height="0" className="absolute pointer-events-none">
          <filter id="glass-displacement" colorInterpolationFilters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feDisplacementMap in="SourceGraphic" in2="SourceGraphic" scale="5" xChannelSelector="A" yChannelSelector="A" x="5" y="-5" width="100%" height="100%" result="displacementMap"/>
          </filter>
        </svg>

        <nav 
          aria-label="Categories" 
          className={[
            "hidden items-center md:flex relative rounded-full backdrop-blur-md p-1 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors duration-300",
            navTheme === "dark" ? "bg-[var(--u-navy)]/[0.02] border border-[var(--u-navy)]/5" : "bg-white/5 border border-white/10"
          ].join(" ")}
          onMouseLeave={() => setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))}
        >
          {/* Glassmorphism Sliding Indicator with SVG Displacement */}
          <div
            className="absolute top-1 bottom-1 z-0 rounded-full transition-all duration-500 overflow-hidden"
            style={{
              ...indicatorStyle,
              backdropFilter: "url(#glass-displacement) blur(4px)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transitionTimingFunction: "linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%)"
            }}
          >
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                // Frosted white fill with glossy edges so the black text is perfectly readable!
                background: "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.2) 100%)",
                boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 6px rgba(255, 255, 255, 0.2)"
              }}
            />
          </div>

          {NAV_LINKS.map((l) => (
            <div 
              key={l.href} 
              className="group relative z-10 px-4 py-2 lg:px-6"
              onMouseEnter={(e) => {
                setIndicatorStyle({
                  left: e.currentTarget.offsetLeft,
                  width: e.currentTarget.offsetWidth,
                  opacity: 1,
                });
              }}
            >
              <a
                href={l.href}
                className={[
                  "u-mono inline-flex items-center gap-1 whitespace-nowrap text-xs uppercase tracking-[0.14em] transition-colors relative z-10",
                  navTheme === "dark"
                    ? "text-[var(--u-navy)]/70 group-hover:text-[var(--u-navy)]"
                    : "text-[var(--u-bone)]/80 group-hover:text-[var(--u-navy)]",
                ].join(" ")}
              >
                {l.label}
                {l.items && (
                  <span
                    aria-hidden="true"
                    className="text-[0.7em] opacity-70 transition-transform duration-200 group-hover:rotate-180"
                  >
                    &#9662;
                  </span>
                )}
              </a>
              {l.items && (
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
              )}
            </div>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="flex h-11 w-11 items-center justify-center md:hidden mt-1.5"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 rounded-full ${navTheme === "dark" ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}`}
            />
            <span
              className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full ${navTheme === "dark" ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-6 rounded-full ${navTheme === "dark" ? "bg-[var(--u-navy)]" : "bg-[var(--u-bone)]"}`}
            />
          </span>
        </button>
      </div>
    </header>

    {/* Full-screen mobile menu */}
    <div
      className={[
        "fixed inset-x-0 top-0 z-[60] h-[100dvh] w-full bg-[var(--u-bone)] transition-[opacity,transform] duration-300 md:hidden",
        menuOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      <div className="absolute top-0 inset-x-0 z-10 flex items-start justify-between bg-[var(--u-bone)] px-6 pb-3 pt-8">
        <img src="/assets/sun/logo.png" alt="Sun Umbrella" className="h-11 w-auto" />
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="mt-1 grid h-10 w-10 place-items-center rounded-full bg-[var(--u-navy)]/[0.06] text-2xl leading-none text-[var(--u-navy)] transition-colors active:bg-[var(--u-navy)]/10"
        >
          &times;
        </button>
      </div>
      <nav 
        aria-label="Categories" 
        className="menu-scrollbar absolute bottom-0 inset-x-0 top-[90px] overflow-y-auto overscroll-contain px-6 pb-24"
        style={{ WebkitOverflowScrolling: "touch" }}
        data-lenis-prevent="true"
      >
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
            {l.items && (
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
            )}
          </div>
        ))}

        <div className="mt-8 border-t border-[var(--u-navy)]/10 pt-7">
          <TactileButton
            link={`${SU}/GENTS/1/products`}
            label="Shop all umbrellas"
          />
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
      className="relative z-10 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <Sticker tone="yellow" rotate={-5} className="mb-6">
          ☂ Next-Gen
        </Sticker>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="u-fun-heading max-w-[16ch] shrink-0 text-4xl md:text-7xl !text-[#F3EFE4]">
            <TypeSequence text={"Designed for style.\nBuilt for all weather."} />
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
        className="relative u-section-warm px-5 py-24 md:px-8 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <DottedBg2 bgColor="var(--u-yellow)" />
        </div>
        {/* Floating rain-splash illustration */}

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <Sticker tone="navy" rotate={-4} className="mb-6">
            ☂ Monsoon Essentials
          </Sticker>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="u-fun-heading text-4xl md:text-7xl">
              <TypeSequence text="Find your umbrella" />
            </h2>
            <TactileButton 
              link={`${SHOP}/collections/all`} 
              label="Find your size" 
            />
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
      className="relative z-10 px-5 pt-0 pb-24 md:px-8 md:pb-32 md:pt-12"
    >
      <div className="mx-auto max-w-[1400px]">
        <Sticker tone="yellow" rotate={-4} className="mb-6">
          ☂ Trending now
        </Sticker>
        <h2 className="u-fun-heading mb-14 max-w-[20ch] text-4xl md:text-7xl !text-[#F3EFE4]">
          Best sellers
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BESTSELLERS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="group flex flex-col overflow-hidden border border-[var(--u-slate)]/70 bg-[var(--u-navy)] transition-colors hover:border-[var(--u-yellow)]"
            >
              <div className="aspect-square w-full overflow-hidden bg-white">
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
                <div className="mt-4 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="u-mono text-sm text-[var(--u-yellow)]">
                      {p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="u-mono text-[10px] text-[var(--u-muted)] line-through mt-0.5">
                        {p.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    {p.discount && (
                      <span className="u-mono text-[10px] font-bold text-[#ff4d4f] mb-1">
                        {p.discount}
                      </span>
                    )}
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

function TestimonialMarquee() {
  const items = "★ 5-STAR REVIEWS \u00A0\u00A0 TRUSTED QUALITY \u00A0\u00A0 LOVED BY MILLIONS \u00A0\u00A0 SINCE 1889 \u00A0\u00A0 ";
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

const reviewCol1 = TESTIMONIALS.slice(0, 3);
const reviewCol2 = TESTIMONIALS.slice(3, 6);
const reviewCol3 = TESTIMONIALS.slice(6, 9);

export function TestimonialsSection() {
  return (
    <>
      <TestimonialMarquee />
      <section id="reviews" className="u-section-cream relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
      <div className="absolute inset-0 z-0">
        <FluidField />
      </div>
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
            <TypeSequence text={"What our customers\nsay"} />
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
    </>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-[var(--u-navy)]/10 bg-[var(--u-bone)] px-5 pt-20 pb-10 md:px-8"
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <LiquidGrid mode="dots" lineColor="rgba(11, 19, 36, 0.05)" glowColor="rgba(11, 19, 36, 0.15)" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 md:grid-cols-3 md:gap-10">
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70">
              Shop
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-navy)]/90">
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
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70">
              Company
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-navy)]/90">
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
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70">
              Contact
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-navy)]/90">
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
              <li className="text-[var(--u-navy)]/70">Mysuru · Mumbai · Calicut</li>
            </ul>
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
        <p className="u-mono mt-8 text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70">
          Sun Umbrella · Est. 1889 · Mysuru, India. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function SunBrandSection() {
  return (
    <section
      id="sun-brand"
      className="u-section-cream px-5 py-24 md:px-8 md:py-32 overflow-hidden relative"
    >
      <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        quantity={200}
        size={2.5}
        staticity={40}
        ease={80}
        color="#101b33"
        refresh
      />
      <div className="mx-auto max-w-[1400px] relative z-10">
        <div className="text-center mb-14">
          <h2 className="u-fun-heading text-4xl md:text-6xl text-[var(--u-navy)]">
            Sun <span className="text-[var(--u-yellow)]">X</span> Your Brand
          </h2>
          <p className="mt-4 text-xl font-medium tracking-tight text-[var(--u-slate)]">
            Perfect for Branding That Stands Out
          </p>
        </div>

        <div className="w-full h-[550px] relative mt-12 -mx-5 md:-mx-8 lg:mx-0 lg:w-auto">
          <ProductFocusCarousel 
            products={BRANDS.map((brand, i) => ({
              id: i,
              title: brand.name,
              subtitle: "Sun Umbrella",
              buttonLabel: "View Collection",
              link: brand.href,
              image: { src: brand.image, alt: brand.name }
            }))} 
            backgroundColor="transparent"
            autoplay={true}
            autoplaySpeed={3500}
          />
        </div>
      </div>
    </section>
  );
}

export function RetailSection() {
  return (
    <section
      id="retail"
      className="u-section-cream px-5 py-24 md:px-8 md:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center mb-14">
          <Sticker tone="navy" rotate={2} className="mb-6 mx-auto">
            ☂ Available everywhere
          </Sticker>
          <h2 className="u-fun-heading text-4xl md:text-6xl text-[var(--u-navy)]">
            Our Retail Circle
          </h2>
        </div>

        <div className="group relative flex overflow-hidden pb-8 pt-4 gap-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex animate-u-marquee min-w-full shrink-0 items-center justify-around gap-6">
            {RETAIL.map((retail) => (
              <CardContainer key={retail.name} className="inter-var shrink-0">
                <CardBody className="w-[180px] md:w-[240px] h-[110px] md:h-[140px] flex items-center justify-center bg-white overflow-hidden rounded-2xl border border-[var(--u-slate)]/10 group-hover/card:border-[var(--u-navy)]/30 transition-all shadow-sm group-hover/card:shadow-xl group-hover/card:-translate-y-1 relative group/card">
                  <CardItem translateZ="20" className="w-full h-full flex items-center justify-center pointer-events-none">
                    <img
                      src={retail.image}
                      alt={retail.name}
                      loading="lazy"
                      className="h-10 md:h-14 w-auto max-w-[70%] object-contain"
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
          <div className="flex animate-u-marquee min-w-full shrink-0 items-center justify-around gap-6" aria-hidden="true">
            {RETAIL.map((retail) => (
              <CardContainer key={`${retail.name}-dup`} className="inter-var shrink-0">
                <CardBody className="w-[180px] md:w-[240px] h-[110px] md:h-[140px] flex items-center justify-center bg-white overflow-hidden rounded-2xl border border-[var(--u-slate)]/10 group-hover/card:border-[var(--u-navy)]/30 transition-all shadow-sm group-hover/card:shadow-xl group-hover/card:-translate-y-1 relative group/card">
                  <CardItem translateZ="20" className="w-full h-full flex items-center justify-center pointer-events-none">
                    <img
                      src={retail.image}
                      alt={retail.name}
                      loading="lazy"
                      className="h-10 md:h-14 w-auto max-w-[70%] object-contain"
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoreLocationsSection() {
  return (
    <section
      id="stores"
      className="relative overflow-hidden bg-white px-5 py-24 md:px-8 md:py-32"
    >
      <div className="absolute inset-0 z-0 opacity-10">
        <LiquidGrid mode="dots" lineColor="rgba(16, 27, 51, 1)" glowColor="rgba(16, 27, 51, 1)" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="text-center mb-14">
          <h2 className="u-fun-heading text-4xl md:text-5xl text-[var(--u-navy)]">
            Visit Us In Store
          </h2>
          <p className="mt-4 text-xl font-medium tracking-tight text-[var(--u-slate)]">
            Find us at a store near you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STORES.map((store) => (
            <div
              key={store.city}
              className="bg-white rounded-2xl overflow-hidden shadow-md shadow-gray-200/50 border border-[var(--u-slate)]/10 flex flex-col hover:border-[var(--u-navy)]/30 transition-colors"
            >
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-[var(--u-navy)] mb-4">
                  <MapPin size={24} weight="regular" className="text-[var(--u-navy)]/60" />
                  {store.city}
                </h3>
                <p className="text-sm text-[var(--u-slate)] leading-relaxed mb-6 flex-1">
                  {store.address}
                </p>
                <div className="space-y-2 mt-auto">
                  {store.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center gap-2 text-sm font-medium text-[var(--u-navy)] hover:text-[var(--u-slate)] transition-colors"
                    >
                      <Phone size={18} weight="fill" className="text-[var(--u-navy)]/60" />
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-gray-200">
                <iframe
                  className="absolute top-0 left-0 w-full h-[calc(100%+48px)]"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  style={{ border: 0 }}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${store.bbox.replace(/,/g, '%2C')}&layer=mapnik&marker=${store.marker.replace(/,/g, '%2C')}`}
                  title={`Map to Sun Umbrellas, ${store.city}`}
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-md border border-gray-100 pointer-events-none">
                  <MapPin size={18} weight="fill" className="text-[var(--u-navy)]/80" />
                  <span className="text-sm font-semibold text-[var(--u-navy)]">{store.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
