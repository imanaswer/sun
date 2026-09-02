/**
 * Sun Umbrella storefront sections. Cinematic hero (owned by ScrollScrub) is
 * composed in the route; these are the storefront body: the monsoon category
 * grid, the bestsellers strip, and the footer. Copy, prices and links come from
 * the live Shopify store via src/sun-data.ts.
 */
import { useEffect, useRef, useState, useCallback, type CSSProperties, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "@tanstack/react-router";
import { SiteLink } from "@/components/umberlla/site-link";
import { motion, AnimatePresence } from "motion/react";
import LiquidGrid from "../liquid-grid";
import DottedBg2 from "../dotted-bg-2";
import { TypeSequence } from "@/components/umberlla/type-sequence";

import type { Testimonial } from "@/components/ui/testimonials-columns-1";
import { TestimonialsColumn, TestimonialsRow } from "@/components/ui/testimonials-columns-1";
import type { ProductReview } from "@/lib/api/reviews.functions";
import { Reveal } from "@/lib/reveal";
import ElementalWater from "./../elemental-water";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Particles } from "@/components/ui/particles";
import { ProductFocusCarousel } from "@/components/ui/product-focus-carousel";
import FluidField from "@/components/fluid-field";
import TactileButton from "@/components/tactile-button";
import {
  BESTSELLERS,
  BRANDS,
  COLLECTIONS,
  REEL,
  RETAIL,
  STORES,
  type Product,
} from "@/sun-data";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCart } from "@/context/cart-context";
import { Video, Phone, MapPin, ArrowSquareOut, ShoppingBag } from "@phosphor-icons/react/dist/ssr";

// Nothing here links off-site. The old absolute domains (sunumbrella.in, and
// www.sunumbrellas.in whose TLS certificate has expired) used to be constants
// in this file and shipped in the SSR HTML — see tests/no-legacy-domain.test.ts.
// Handles are Shopify's own, so they resolve identically on this site and on
// sunumbrella.in. "3 Fold / Black" previously pointed at 2-fold-colors-umbrella;
// it now points at 3-fold-black-umbrellas, which is the collection that exists.
const NAV_LINKS = [
  {
    label: "Non-Fold",
    href: "/collections/non-fold-black-umbrellas",
    items: [
      { label: "Black", href: "/collections/non-fold-black-umbrellas" },
      { label: "Colors", href: "/collections/non-fold-color-umbrellas" },
    ],
  },
  {
    label: "2 Fold",
    href: "/collections/2-fold-umbrella-black-catagory",
    items: [
      { label: "Black", href: "/collections/2-fold-umbrella-black-catagory" },
      { label: "Colors", href: "/collections/2-fold-colors-umbrella" },
    ],
  },
  {
    label: "3 Fold",
    href: "/collections/3-fold-black-umbrellas",
    items: [
      { label: "Black", href: "/collections/3-fold-black-umbrellas" },
      { label: "Colors", href: "/collections/3-fols-colour-umbrelllas" },
    ],
  },
  {
    label: "Kids",
    href: "/collections/kids-umbrellas-tuesday",
  },
  {
    label: "Promotional",
    href: "/collections/promotional-umbrella",
  },
];

/**
 * Renders its (heavy, e.g. WebGL) children only while the wrapper is near the
 * viewport, and unmounts them when scrolled well away — so continuous canvas
 * effects don't burn the GPU across the whole page. On phones the effects are
 * skipped entirely (mobile GPUs can't run the fluid sims smoothly); the
 * section keeps its own cream background, so nothing looks broken.
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
    
    if (window.matchMedia("(max-width: 767px)").matches) {
      const timer = setTimeout(() => setShow(true), 0);
      return () => clearTimeout(timer);
    }
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

/** Brightness 0..1 of the nearest painted background at or above `el`.
 *  Sections that paint nothing fall through to the page ground, which is navy.
 *  ponytail: background-color only — a section whose colour comes from a
 *  background-image or a canvas child needs its own opaque colour to be read. */
export function bgLuminance(el: Element | null): number {
  for (let node = el; node; node = node.parentElement) {
    const parts = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
    if (!parts || Number(parts[3] ?? 1) === 0) continue;
    const [r, g, b] = parts.map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }
  return 0;
}

export function SiteNav() {
  const { cartCount, openCart } = useCart();
  // Transparent over the dark hero (no logo, light links). Once the hero is
  // scrolled past and the white storefront begins, the bar turns white and the
  // logo appears with dark links. Keyed to a #hero-end sentinel after the film.
  const [menuOpen, setMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<"light" | "dark">("light");
  const [navVisible, setNavVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const check = () => {
      const sentinel = document.getElementById("hero-end");
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Read the real background under the bar rather than matching section
      // ids — the old allowlist called the navy #reviews section "dark" and
      // painted navy links onto navy.
      const band = Array.from(document.querySelectorAll("section, footer")).find(
        (el) => {
          const rect = el.getBoundingClientRect();
          return rect.top <= 90 && rect.bottom >= 90;
        },
      );
      let currentTheme: "light" | "dark" =
        bgLuminance(band ?? null) > 0.55 ? "dark" : "light";

      // If we are above hero-end, we are in the hero (light text)
      if (sentinel && sentinel.getBoundingClientRect().top >= 90) {
        currentTheme = "light";
      }

      setNavTheme(currentTheme);

      // Always visible
      setNavVisible(true);
      
      lastScrollY = currentScrollY;
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  // Escape closes the mobile menu, matching the cart drawer.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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
    <header 
      className={[
        "fixed inset-x-0 top-0 z-50 bg-transparent transition-transform duration-300 pt-4 md:pt-4 pointer-events-none",
        navVisible ? "translate-y-0" : "-translate-y-[150%]"
      ].join(" ")}
    >
      {/* DESKTOP HEADER */}
      <div className="hidden md:flex mx-auto h-28 max-w-[1400px] items-center justify-between px-8 pointer-events-auto">
        <Link to="/" className="flex h-24 items-center">
          <div className={[
            "flex flex-col items-center transition-opacity duration-300 opacity-100"
          ].join(" ")}>
            <img
              src="/assets/sun/logo-icon-transparent.png"
              alt="Sun Umbrella"
              className="h-16 w-auto"
            />
            <div className="flex flex-col items-center mt-1 font-sans">
              {/* Follows navTheme like the links do — hardcoded white vanished
                  on the light product and collection pages. */}
              <span className={[
                "text-sm font-black tracking-wider leading-none",
                navTheme === "dark" ? "text-[var(--u-ink)]" : "text-white",
              ].join(" ")}>
                Umbrellas
              </span>
              <span className={[
                "text-[8px] font-medium tracking-tight mt-0.5 whitespace-nowrap",
                navTheme === "dark" ? "text-[var(--u-ink)]/70" : "text-white/80",
              ].join(" ")}>
                Trusted 100+ years
              </span>
            </div>
          </div>
        </Link>
        <svg width="0" height="0" className="absolute pointer-events-none">
          <filter id="glass-displacement" colorInterpolationFilters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
            <feDisplacementMap in="SourceGraphic" in2="SourceGraphic" scale="5" xChannelSelector="A" yChannelSelector="A" x="5" y="-5" width="100%" height="100%" result="displacementMap"/>
          </filter>
        </svg>

        <div className="flex items-center gap-4">
          <nav 
            aria-label="Categories" 
            className={[
              "flex relative rounded-full backdrop-blur-md p-1 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-colors duration-300",
              navTheme === "dark" ? "bg-[var(--u-ink)]/[0.02] border border-[var(--u-ink)]/5" : "bg-white/5 border border-white/10"
            ].join(" ")}
            onMouseLeave={() => setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))}
          >
            {/* Glassmorphism Sliding Indicator with SVG Displacement */}
            <div
              className="absolute top-1 bottom-1 z-0 rounded-full transition-all duration-500 overflow-hidden"
              style={{
                ...indicatorStyle,
                backdropFilter: "url(#glass-displacement) blur(4px)",
                border: "1px solid var(--u-nav-pill-edge)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transitionTimingFunction: "linear(0, 0.0018, 0.0069 1.15%, 0.026 2.3%, 0.0637, 0.1135 5.18%, 0.2229 7.78%, 0.5977 15.84%, 0.7014, 0.7904, 0.8641, 0.9228, 0.9676 28.8%, 1.0032 31.68%, 1.0225, 1.0352 36.29%, 1.0431 38.88%, 1.046 42.05%, 1.0448 44.35%, 1.0407 47.23%, 1.0118 61.63%, 1.0025 69.41%, 0.9981 80.35%, 0.9992 99.94%)"
              }}
            >
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "var(--u-nav-pill-fill)",
                  boxShadow: "none"
                }}
              />
            </div>

            {NAV_LINKS.map((l) => (
              <div 
                key={l.label} 
                className="group relative z-10 px-4 py-2 lg:px-6"
                onMouseEnter={(e) => {
                  setIndicatorStyle({
                    left: e.currentTarget.offsetLeft,
                    width: e.currentTarget.offsetWidth,
                    opacity: 1,
                  });
                }}
              >
                <SiteLink
                  href={l.href}
                  className={[
                    "u-mono inline-flex items-center gap-1 whitespace-nowrap text-xs uppercase tracking-[0.14em] transition-colors relative z-10",
                    navTheme === "dark"
                      ? "font-semibold text-[var(--u-ink)] group-hover:text-[var(--u-ink)]"
                      : "font-semibold text-[var(--u-bone)] group-hover:text-[var(--u-ink)]",
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
                </SiteLink>
                {l.items && (
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="min-w-[210px] overflow-hidden rounded-xl border border-[var(--u-ink)]/10 bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(16,27,51,0.28)]">
                      {l.items.map((s) => (
                        <SiteLink
                          key={s.href}
                          href={s.href}
                          className="block rounded-lg px-3 py-2 text-xs uppercase tracking-[0.12em] text-[var(--u-ink)]/75 transition-colors hover:bg-[var(--u-yellow)] hover:text-[var(--u-ink)]"
                        >
                          {s.label}
                        </SiteLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={openCart}
            className={[
              "relative flex h-11 w-11 items-center justify-center rounded-full transition-colors cursor-pointer",
              navTheme === "dark" 
                ? "text-[var(--u-ink)] hover:bg-[var(--u-ink)]/10" 
                : "text-[var(--u-bone)] hover:bg-white/10"
            ].join(" ")}
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--u-yellow)] text-[10px] font-bold text-[var(--u-ink)]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE FLOATING PILL HEADER */}
      <div className="md:hidden mx-auto mt-4 flex w-11/12 max-w-[380px] items-center justify-between gap-4 rounded-full bg-[#111111]/60 backdrop-blur-md pl-4 pr-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-white/10 pointer-events-auto">
        <Link to="/" className="flex items-center h-8">
          <img src="/assets/sun/logo-icon-transparent.png" alt="Sun" className="h-5 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-1">
          {/* Cart Icon (Mobile) */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--u-yellow)] text-[9px] font-bold text-[var(--u-ink)]">
                {cartCount}
              </span>
            )}
          </button>
          
          {/* Menu Button (Mobile) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 items-center gap-2 rounded-full bg-white/10 pl-3 pr-4 transition-colors active:bg-white/20"
          >
            <span className="flex flex-col gap-[3px] items-center justify-center w-3.5">
              <span className="h-[1.5px] w-full rounded-full bg-white/90" />
              <span className="h-[1.5px] w-full rounded-full bg-white/90" />
              <span className="h-[1.5px] w-full rounded-full bg-white/90" />
            </span>
            <span className="text-[11px] font-medium tracking-wide text-white/90 uppercase">Menu</span>
          </button>
        </div>
      </div>
    </header>

    {/* Full-screen mobile menu. `inert` when closed — it is only faded out, so
        without it every page keeps the whole category menu in the tab order. */}
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!menuOpen}
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
          className="mt-1 grid h-10 w-10 place-items-center rounded-full bg-[var(--u-ink)]/[0.06] text-2xl leading-none text-[var(--u-ink)] transition-colors active:bg-[var(--u-ink)]/10"
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
            key={l.label}
            className="border-t border-[var(--u-ink)]/10 py-4 first:border-t-0"
          >
            <SiteLink
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline justify-between gap-3"
            >
              <span className="u-fun-head text-[2rem] leading-none text-[var(--u-ink)]">
                {l.label}
              </span>
              <span className="u-mono text-[11px] tracking-[0.1em] text-[var(--u-ink)]/35">
                {`0${i + 1}`}
              </span>
            </SiteLink>
            {l.items && (
              <div className="mt-3 flex flex-wrap gap-2">
                {l.items.map((s) => (
                  <SiteLink
                    key={s.href}
                    href={s.href}
                    onClick={() => setMenuOpen(false)}
                    className="u-mono rounded-full bg-[var(--u-ink)]/[0.05] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--u-ink)]/65 transition-colors active:bg-[var(--u-yellow)] active:text-[var(--u-ink)]"
                  >
                    {s.label}
                  </SiteLink>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-8 border-t border-[var(--u-ink)]/10 pt-7">
          <TactileButton
            link="/collections/all"
            label="Shop all umbrellas"
          />
          <div className="u-mono mt-6 space-y-1.5 text-xs uppercase tracking-[0.14em] text-[var(--u-ink)]/60">
            <a href="mailto:info@sunumbrellas.in" className="block">
              info@sunumbrellas.in
            </a>
            <a href="tel:+918212514578" className="block">
              +91 821 2514578
            </a>
            <p className="text-[var(--u-ink)]/40">Mumbai · Calicut</p>
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
function ReelVideo({ src, poster, label, caption, href, index, className }: (typeof REEL)[number] & { index: number; className?: string }) {
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
    <SiteLink
      href={href}
      className={className || [
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
    </SiteLink>
  );
}

export function VideoReelSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: false, align: "center" });
  const [tweenValues, setTweenValues] = useState<{ scale: number; opacity: number }[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }

      const tweenValue = 1 - Math.abs(diffToTarget * 1.5);
      const scale = Math.max(0.85, Math.min(1, tweenValue));
      const opacity = Math.max(0.4, Math.min(1, tweenValue));

      return { scale, opacity };
    });
    setTweenValues(styles);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setTimeout(() => onScroll(), 0);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    return () => clearTimeout(timer);
  }, [emblaApi, onScroll]);

  return (
    <section
      id="next-gen"
      className="relative z-10 px-5 py-24 md:px-8 md:py-32"
    >
<LazyInView className="absolute inset-0 z-0">
  <ElementalWater />
</LazyInView>

<div className="relative z-10 mx-auto max-w-[1400px]">
        <Sticker tone="yellow" rotate={-5} className="mb-6">
          ☂ Next-Gen
        </Sticker>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="u-fun-heading max-w-[16ch] shrink-0 text-4xl md:text-7xl !text-[#F3EFE4]">
            <TypeSequence text={"Designed for style.\nBuilt for all weather."} />
          </h2>

          <div className="shrink-0">
            <TactileButton link={"/collections/all"} />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden mt-14 md:flex snap-x snap-mandatory gap-8 overflow-x-auto pb-4 md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {REEL.map((r, i) => (
            <ReelVideo key={r.label} {...r} index={i} />
          ))}
        </div>

        {/* Mobile View with Coverflow Effect */}
        <div className="md:hidden mt-14 -mx-5 overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
            {REEL.map((r, index) => {
              const tween = tweenValues[index] || { scale: 0.85, opacity: 0.4 };
              return (
                <div 
                  key={r.label} 
                  className="min-w-0 flex-[0_0_65%] pl-4 first:pl-5 last:pr-5"
                >
                  <div
                    style={{
                      transform: `scale(${tween.scale})`,
                      opacity: tween.opacity,
                      transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
                      transformOrigin: "center center"
                    }}
                    className="h-full"
                  >
                    <ReelVideo 
                      {...r} 
                      index={index} 
                      className="u-tilt-card group relative block w-full bg-black rounded-lg overflow-hidden" 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tilted marquee strip — scrolling monsoon feature callouts. */
function MonsoonMarquee() {
  const items = "☂ MONSOON READY \u00A0\u00A0 AUTO OPEN & CLOSE \u00A0\u00A0 UV PROTECTIVE \u00A0\u00A0 WINDPROOF \u00A0\u00A0 100+ YEARS \u00A0\u00A0 ";
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

function MobileCollectionsStack({ items }: { items: typeof COLLECTIONS }) {
  const [cards, setCards] = useState(items);

  const handleNext = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const item = newCards.shift();
      if (item) newCards.push(item);
      return newCards;
    });
  };

  return (
    <div className="relative w-full h-[560px]">
      <AnimatePresence mode="popLayout">
        {cards.map((item, index) => {
          const isVisible = index < 3;
          if (!isVisible) return null;

          const isTop = index === 0;

          return (
            <motion.div
              key={item.name}
              layout
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{
                y: index * 35,
                scale: 1 - index * 0.05,
                opacity: 1 - index * 0.1,
                zIndex: cards.length - index,
              }}
              exit={{
                x: -300,
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.2 }
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute top-0 left-0 w-full rounded-2xl overflow-hidden shadow-xl bg-white border border-[var(--u-slate)]/10"
              style={{ transformOrigin: "top center" }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 300) {
                  handleNext();
                }
              }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden select-none">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                <Sticker tone="yellow" rotate={6} className="absolute top-3 right-3 text-[11px] pointer-events-none">{item.sub}</Sticker>
              </div>
              <div className="flex flex-col bg-white p-6 pb-8 pointer-events-none">
                <h3 className="text-2xl font-bold tracking-tight text-[var(--u-navy)]" style={{ fontFamily: "var(--u-fun)" }}>
                  {item.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--u-navy)]/65">
                  {item.blurb}
                </p>
                <div className="pointer-events-auto mt-4">
                  <SiteLink href={item.href} className="u-mono inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--u-navy)]">
                    Shop {item.name} <span aria-hidden="true">&rarr;</span>
                  </SiteLink>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
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
              link={"/collections/all"} 
              label="Find your size" 
            />
          </div>

          {/* Desktop Grid */}
          <Reveal className="hidden md:grid mt-16 gap-8 md:grid-cols-6" stagger>
            {COLLECTIONS.map((c, index) => (
              <SiteLink
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
              </SiteLink>
            ))}
          </Reveal>

          {/* Mobile Gallery Stack */}
          <div className="md:hidden mt-16 w-full relative">
            <MobileCollectionsStack items={COLLECTIONS} />
          </div>
        </div>
      </section>
    </>
  );
}

type BestsellerItem = Product & {
  variantId?: string;
  priceNumeric?: number;
  handle?: string;
  soldOut?: boolean;
};

/** Add to Cart / Sold out. Shared by the desktop grid and the mobile carousel —
 *  they had two copies of this and only the product page knew about stock, so a
 *  sold-out item could be added from here and only fail at checkout. */
function BestsellerBuyButton({ item }: { item: BestsellerItem }) {
  const { addToCart } = useCart();

  if (!item.variantId) {
    return (
      <span className="u-mono inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-[var(--u-navy)]">
        View
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
          &rarr;
        </span>
      </span>
    );
  }

  if (item.soldOut) {
    return (
      <span className="u-mono rounded-full border border-[var(--u-navy)]/25 px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-[var(--u-navy)]/50">
        Sold out
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
          id: item.variantId!,
          title: item.name,
          handle: item.handle ?? item.href.replace("/products/", ""),
          price: item.price,
          priceNumeric: item.priceNumeric ?? 0,
          image: item.image,
        });
      }}
      className="u-mono rounded-full bg-[var(--u-navy)] px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-white hover:bg-[var(--u-navy)]/90 active:scale-95 transition-all cursor-pointer"
    >
      Add to Cart
    </button>
  );
}

/** `products` comes from the route loader, so the grid is server rendered. It
 *  used to be fetched in a useEffect, which meant the SSR HTML shipped the
 *  static fallback — old-domain links and stale prices — to every crawler. */
export function BestsellersSection({ products }: { products?: ShopifyProduct[] }) {
  const items: BestsellerItem[] =
    products && products.length > 0
      ? products.map((p) => ({
          name: p.title,
          tag: p.discount ? "Special Offer" : "Bestseller",
          price: p.price,
          originalPrice: p.originalPrice,
          discount: p.discount,
          image: p.image,
          href: p.href,
          handle: p.handle,
          variantId: p.variantId,
          priceNumeric: p.priceNumeric,
          soldOut: !p.availableForSale,
        }))
      : BESTSELLERS;

  return (
    <section
      id="bestsellers"
      className="relative u-section-warm px-5 py-24 md:px-8 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <DottedBg2 bgColor="var(--u-yellow)" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Sticker tone="navy" rotate={-4} className="mb-6">
          ☂ Trending now
        </Sticker>
        <h2 className="u-fun-heading mb-8 max-w-[20ch] text-4xl md:mb-14 md:text-7xl">
          <TypeSequence text="Best sellers" />
        </h2>

        <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-4">
          {items.map((p, index) => (
            <SiteLink
              key={p.name}
              href={p.href}
              className="u-card-on-yellow group relative flex flex-col md:[transform:rotate(var(--tilt))]"
              style={{ "--tilt": `${index % 2 === 0 ? -1 : 1}deg` } as CSSProperties}
            >
              <div className="aspect-square w-full overflow-hidden bg-white">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <div className="flex flex-1 flex-col bg-white p-3.5 md:p-5">
                <span className="u-mono text-[9px] uppercase tracking-[0.18em] text-[var(--u-navy)]/60 md:text-[10px]">
                  {p.tag}
                </span>
                <h3 className="mt-2 flex-1 text-sm font-medium leading-snug text-[var(--u-navy)] md:text-base" style={{ fontFamily: "var(--u-fun)" }}>
                  {p.name}
                </h3>
                {/* Price and button sit side by side once there is room; on a
                    half-width phone card they stack instead of squeezing. */}
                <div className="mt-3 flex flex-col items-start gap-2 md:mt-4 md:flex-row md:items-end md:justify-between">
                  <div className="flex flex-col">
                    <span className="u-mono text-sm text-[var(--u-navy)] font-bold">
                      {p.price}
                    </span>
                    {p.originalPrice && (
                      <span className="u-mono text-[10px] text-[var(--u-navy)]/60 line-through mt-0.5">
                        {p.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex w-full flex-col items-start md:w-auto md:items-end">
                    {p.discount && (
                      <span className="u-mono mb-1 text-[10px] font-bold text-[#ff4d4f]">
                        {p.discount}
                      </span>
                    )}
                    <BestsellerBuyButton item={p} />
                  </div>
                </div>
              </div>
            </SiteLink>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-[var(--u-slate)]/60 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="max-w-[20ch] text-2xl font-semibold tracking-tight text-[var(--u-navy)] md:text-3xl">
              Sheltering India for 100+ years.
            </h3>
            <p className="u-mono mt-3 text-xs uppercase tracking-[0.2em] text-[var(--u-navy)]/70">
              Auto open &amp; close · UV protective · windproof
            </p>
          </div>
          <TactileButton link={"/collections/all"} />
        </div>
      </div>
    </section>
  );
}

function TestimonialMarquee() {
  const items = "★ 5-STAR REVIEWS \u00A0\u00A0 TRUSTED QUALITY \u00A0\u00A0 LOVED BY MILLIONS \u00A0\u00A0 100+ YEARS \u00A0\u00A0 ";
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

/** Below this the wall looks thin rather than social proof, so we show nothing. */
const MIN_TESTIMONIALS = 3;

/**
 * Real Judge.me reviews only. This section used to render nine invented
 * customers with randomuser.me stock portraits, which is a misrepresentation
 * problem on a live storefront quite apart from the code. Judge.me is the
 * system of record; with no reviews (or no API token configured) the section
 * renders nothing rather than being padded back out with fiction.
 */
export function TestimonialsSection({ reviews = [] }: { reviews?: ProductReview[] }) {
  const testimonials: Testimonial[] = reviews.map((r) => ({
    text: r.body,
    name: r.reviewerName,
    role: `${r.rating}\u2605 \u00B7 Verified buyer`,
  }));

  if (testimonials.length < MIN_TESTIMONIALS) return null;

  const perColumn = Math.ceil(testimonials.length / 3);
  const reviewCol1 = testimonials.slice(0, perColumn);
  const reviewCol2 = testimonials.slice(perColumn, perColumn * 2);
  const reviewCol3 = testimonials.slice(perColumn * 2);

  return (
<>
  <TestimonialMarquee />

  <section
    id="reviews"
    className="bg-[var(--u-navy)] relative overflow-hidden px-5 py-24 md:px-8 md:py-32"
  >
    <LazyInView className="absolute inset-0 z-0 opacity-40">
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
            <TypeSequence text={"What our customers\nsay"} />
          </h2>
          <p className="mt-4 text-[#F3EFE4]">
            Keeping India dry for 100+ years — here&rsquo;s what people carry, and why.
          </p>
        </motion.div>

        {/* Desktop Vertical Testimonials */}
        <div className="hidden md:flex mt-14 max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
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

        {/* Mobile Horizontal Testimonials */}
        <div className="md:hidden mt-14 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] -mx-5 px-5">
          <TestimonialsRow testimonials={testimonials} duration={35} />
        </div>
      </div>
    </section>
    </>
  );
}

/** Handles match Shopify's own policy URLs, so links indexed against the old
 *  storefront keep resolving after the domain moves. */
const POLICY_LINKS = [
  { handle: "shipping-policy", label: "Shipping" },
  { handle: "refund-policy", label: "Returns & refunds" },
  { handle: "privacy-policy", label: "Privacy" },
  { handle: "terms-of-service", label: "Terms of service" },
] as const;

/* ── Footer link data matching the original Sun Umbrella website ──────── */

const ABOUT_LINKS = [
  { label: "About Us", href: "/#sun-brand" },
  { label: "Our Retail Store", href: "/#stores" },
  { label: "Videos", href: "/#videos" },
  { label: "Sun Facts", href: "/#sun-facts" },
  { label: "Sun Care", href: "/#sun-care" },
  { label: "Profile", href: "/#profile" },
  { label: "Contact Us", href: "/#contact" },
] as const;

const TERMS_LINKS = [
  { label: "Delivery", handle: "shipping-policy" },
  { label: "Shipping Charges", handle: "shipping-policy" },
  { label: "Returns Policy", handle: "refund-policy" },
  { label: "Exchange Policy", handle: "refund-policy" },
  { label: "Payment Methods", handle: "terms-of-service" },
  { label: "Warranty Information", handle: "terms-of-service" },
  { label: "Security & Privacy Policy", handle: "privacy-policy" },
  { label: "Terms & Conditions", handle: "terms-of-service" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/SunUmbrellaOfficial",
    gradient: "linear-gradient(135deg, #1877F2 0%, #0C5DC7 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98H9.198v8.01Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sunumbrella_official/",
    gradient: "linear-gradient(135deg, #F58529 0%, #DD2A7B 40%, #8134AF 70%, #515BD4 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.416-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.416 2.428-.465C8.944 2.013 9.283 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@sunumbrella",
    gradient: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "https://in.pinterest.com/sunumbrellaofficial/",
    gradient: "linear-gradient(135deg, #E60023 0%, #BD081C 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/sun-umbrella/",
    gradient: "linear-gradient(135deg, #0077B5 0%, #005582 100%)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
  },
] as const;

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-[var(--u-bone)]/10 text-[var(--u-bone)] px-5 pt-20 pb-10 md:px-8"
      style={{ backgroundColor: "#101b33" }}
    >
      <div className="absolute inset-0 z-0 opacity-40">
        <LiquidGrid mode="dots" lineColor="rgba(243, 239, 228, 0.05)" glowColor="rgba(243, 239, 228, 0.15)" background="transparent" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-11 md:grid-cols-4 md:gap-10">
          {/* ── Column 1: About Sun Brand ── */}
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              About Sun Brand
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-bone)]/90">
              {ABOUT_LINKS.map((link) => (
                <li key={link.label}>
                  <a className="u-footer-link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 2: Terms of Trade ── */}
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Terms of Trade
            </h2>
            <ul className="mt-4 space-y-2 text-base text-[var(--u-bone)]/90">
              {TERMS_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    className="u-footer-link"
                    to="/policies/$handle"
                    params={{ handle: link.handle }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Follow Us ── */}
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Follow Us
            </h2>
            <ul className="mt-4 space-y-3">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    className="flex items-center gap-3 group transition-colors text-[var(--u-bone)]/90 hover:text-white"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-lg transition-transform group-hover:scale-110"
                      style={{ background: social.gradient }}
                    >
                      {social.icon}
                    </span>
                    <span className="text-base">{social.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Reach Us ── */}
          <div>
            <h2 className="u-mono text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
              Reach Us
            </h2>
            <div className="mt-4 space-y-4 text-base text-[var(--u-bone)]/90">
              {/* Company address */}
              <div className="space-y-1 text-sm leading-relaxed">
                <p className="font-semibold text-[var(--u-bone)]">
                  M/S. Sun Umbrella Pvt. Ltd.
                </p>
                <p># 211, Ground Floor,</p>
                <p>JCK Industrial Park, Phase-2,</p>
                <p>Belagola Industrial Area,</p>
                <p>Mysuru – 570 016, Karnataka.</p>
              </div>

              {/* Timings */}
              <p className="text-sm italic text-[var(--u-muted)]">
                Timings : 10 am – 6 pm
              </p>

              {/* Phone numbers */}
              <div className="space-y-1">
                <a
                  className="flex items-center gap-2 text-[var(--u-yellow)] hover:text-white transition-colors text-sm"
                  href="tel:+918212514578"
                >
                  <Phone weight="fill" className="w-4 h-4 shrink-0" />
                  +91 821 2514578
                </a>
                <a
                  className="flex items-center gap-2 text-[var(--u-yellow)] hover:text-white transition-colors text-sm"
                  href="tel:+916364913526"
                >
                  <Phone weight="fill" className="w-4 h-4 shrink-0" />
                  +91 6364913526
                </a>
              </div>

              {/* Email */}
              <a
                className="flex items-center gap-2 text-sm text-[var(--u-bone)]/90 hover:text-white transition-colors"
                href="mailto:info@sunumbrellas.in"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 text-[var(--u-muted)]">
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>
                info@sunumbrellas.in
              </a>

              {/* Contact CTA */}
              <a
                href="/#contact"
                className="mt-2 inline-block rounded-full border border-[var(--u-bone)]/30 px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-[var(--u-bone)] transition-all hover:border-[var(--u-yellow)] hover:text-[var(--u-yellow)] hover:shadow-[0_0_20px_rgba(242,194,48,0.15)]"
              >
                Click here to contact us
              </a>
            </div>
          </div>
        </div>

        {/* ── Giant wordmark ── */}
        <div className="relative mt-20 inline-block w-full">
          <p
            aria-hidden="true"
            className="u-wordmark w-full text-[13vw] uppercase leading-[0.82] text-[var(--u-bone)]/[0.07]"
          >
            Sun Umbrella
          </p>
          <Sticker
            tone="yellow"
            rotate={-8}
            className="absolute bottom-4 right-[10%] text-sm"
          >
            100+ years
          </Sticker>
        </div>
        <p className="u-mono mt-8 text-xs uppercase tracking-[0.2em] text-[var(--u-muted)]">
          © {new Date().getFullYear()} Sun Umbrella Pvt. Ltd. · 100+ years · India. All rights reserved.
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
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url("/assets/background.webp")',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center'
        }}
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
              buttonLabel: "View product",
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
      className="u-section-warm relative px-5 py-24 md:px-8 md:py-32 overflow-hidden"
    >

      <div className="mx-auto max-w-[1400px] relative z-10">
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
                      className="h-16 md:h-20 w-auto max-w-[85%] object-contain"
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
                      className="h-16 md:h-20 w-auto max-w-[85%] object-contain"
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
      className="u-section-cream px-5 py-24 md:px-8 md:py-32"
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
              <div className="h-32 sm:h-40 w-full relative overflow-hidden bg-gray-200">
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
