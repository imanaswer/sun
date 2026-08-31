import React, { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Medal, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "@phosphor-icons/react";
import type { ProductSpec, ShopifyProductDetail } from "@/lib/shopify";
import type { ProductReview } from "@/lib/api/reviews.functions";

/**
 * Presentational pieces of the product detail page. The route owns the data and
 * the cart/checkout handlers; everything here is props in, markup out.
 */

/* ---------------------------------------------------------------- rating --- */

/**
 * Five outline stars with a filled copy clipped to the score, so 4.52 reads as
 * four and a half rather than being rounded to a whole star.
 */
export function RatingStars({ value, size = 16 }: { value: number; size?: number }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = (weight: "regular" | "fill") => (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} weight={weight} style={{ color: "var(--u-yellow)" }} />
      ))}
    </div>
  );

  return (
    <div className="relative inline-block shrink-0" aria-hidden="true">
      {row("regular")}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row("fill")}
      </div>
    </div>
  );
}

export function RatingSummary({ rating }: { rating: { value: number; count: number } }) {
  return (
    <div
      className="mt-3 flex items-center gap-2.5"
      aria-label={`Rated ${rating.value.toFixed(1)} out of 5 from ${rating.count} reviews`}
    >
      <RatingStars value={rating.value} />
      <span className="u-mono text-xs" style={{ color: "var(--u-bone)" }}>
        {rating.value.toFixed(1)}
      </span>
      <span className="u-mono text-xs" style={{ color: "var(--u-muted)" }}>
        · {rating.count} {rating.count === 1 ? "review" : "reviews"}
      </span>
    </div>
  );
}

/* --------------------------------------------------------------- gallery --- */

export function ProductGallery({
  images,
  title,
  activeUrl,
  onSelect,
}: {
  images: ShopifyProductDetail["images"];
  title: string;
  activeUrl: string;
  onSelect: (url: string) => void;
}) {
  const hasThumbs = images.length > 1;

  return (
    <div className="flex flex-col gap-4 md:flex-row-reverse md:items-start">
      {/* A tonal stage rather than a white card: a white slab on a navy page
          reads as a hole punched in it, and boxes the photo twice over. */}
      <div
        className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[28px]"
        style={{ border: "1px solid var(--u-slate)", background: "var(--u-stage)" }}
      >
        <img
          src={activeUrl}
          alt={title}
          className="h-full w-full object-contain p-10 md:p-14"
          style={{ filter: "var(--u-photo-shadow)" }}
          width={900}
          height={900}
        />
      </div>

      {hasThumbs && (
        <div className="flex shrink-0 gap-3 overflow-x-auto md:flex-col md:overflow-visible">
          {images.map((img) => {
            const isActive = activeUrl === img.url;
            return (
              <button
                key={img.url}
                type="button"
                onClick={() => onSelect(img.url)}
                aria-label={`View image: ${img.altText}`}
                aria-current={isActive}
                className="flex h-[74px] w-[74px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl p-2 transition-all"
                style={{
                  backgroundColor: "var(--u-well)",
                  border: `1px solid ${isActive ? "var(--u-yellow)" : "var(--u-slate)"}`,
                  boxShadow: isActive ? "0 0 0 3px rgba(242,194,48,0.18)" : "none",
                  opacity: isActive ? 1 : 0.55,
                }}
              >
                <img src={img.url} alt="" className="h-full w-full object-contain" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- sections --- */

/**
 * Numbered section rule, echoing the numbering already used in the mobile nav.
 * It gives the lower half of the page a spine the old layout never had.
 */
export function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-center gap-5">
      <span className="u-mono text-xs" style={{ color: "var(--u-accent-text)" }}>
        {index}
      </span>
      <h2 className="u-fun-head text-2xl md:text-3xl" style={{ color: "var(--u-bone)" }}>
        {title}
      </h2>
      <span className="h-px flex-1" style={{ backgroundColor: "var(--u-slate)" }} />
    </div>
  );
}

/* ------------------------------------------------------------ buy panel --- */

/** Raised card for the buy column, so it has weight instead of floating. */
export function BuyPanelCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[28px] p-7 md:p-9"
      style={{ border: "1px solid var(--u-slate)", background: "var(--u-card)" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------ brand band --- */

/**
 * Closing band. It anchors the foot of the page on every product, including the
 * ones with no specs, rating or extra images to fill it.
 */
export function BrandBand() {
  return (
    <section
      className="mt-8 px-5 py-16 text-center md:py-20"
      style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
    >
      <p className="u-mono text-[11px] uppercase tracking-[0.22em]">Since 1889</p>
      <p className="u-fun-head mx-auto mt-4 max-w-[22ch] text-3xl leading-[1.05] md:text-5xl">
        Built to be already in your hand when the monsoon turns.
      </p>
      <Link
        to="/"
        className="u-mono mt-8 inline-block rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--u-ink)", color: "var(--u-yellow)" }}
      >
        Shop all umbrellas
      </Link>
    </section>
  );
}

/* ----------------------------------------------------------------- trust --- */

/**
 * Three claims that hold for every product, so the buy column has a floor even
 * on a listing with no metafields. All three are Sun Umbrella's own: free
 * delivery and the 1889 date are on the live storefront, and checkout is
 * Shopify's.
 */
const TRUST_ITEMS = [
  { Icon: Truck, label: "Free delivery", detail: "Across India" },
  { Icon: ShieldCheck, label: "Secure checkout", detail: "via Shopify" },
  { Icon: Medal, label: "Est. 1889", detail: "135 years" },
];

export function TrustRow() {
  return (
    <ul className="mt-8 grid gap-4 border-t pt-7 sm:grid-cols-3" style={{ borderTopColor: "var(--u-slate)" }}>
      {TRUST_ITEMS.map(({ Icon, label, detail }) => (
        <li key={label} className="flex items-start gap-3">
          <Icon size={19} weight="regular" style={{ color: "var(--u-accent-text)", flexShrink: 0 }} />
          <div className="min-w-0">
            <div className="text-xs leading-tight font-semibold" style={{ color: "var(--u-bone)" }}>
              {label}
            </div>
            <div className="u-mono text-[10px]" style={{ color: "var(--u-muted)" }}>
              {detail}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------- specs --- */

export function ProductSpecs({ specs }: { specs: ProductSpec[] }) {
  if (specs.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32">
      <SectionHeading index="01" title="Specifications" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {specs.map((spec) => (
          <div
            key={spec.key}
            className="rounded-2xl px-5 py-6 transition-colors"
            style={{ border: "1px solid var(--u-slate)", background: "var(--u-card)" }}
          >
            <div
              className="u-mono text-[10px] uppercase tracking-[0.16em]"
              style={{ color: "var(--u-accent-text)" }}
            >
              {spec.label}
            </div>
            <div className="mt-3 text-sm leading-snug font-semibold" style={{ color: "var(--u-bone)" }}>
              {spec.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- reviews --- */

function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  // Fixed locale: a date formatted in the visitor's locale would differ between
  // the SSR render and hydration and trip a React mismatch.
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function ProductReviews({
  rating,
  reviews,
}: {
  rating?: { value: number; count: number };
  reviews: ProductReview[];
}) {
  if (!rating && reviews.length === 0) return null;

  return (
    <section className="mt-24 md:mt-32">
      <SectionHeading index="03" title="Customer Reviews" />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <span />
        {rating && (
          <div className="flex items-center gap-3">
            <span className="u-fun-head text-3xl" style={{ color: "var(--u-accent-text)" }}>
              {rating.value.toFixed(1)}
            </span>
            <div>
              <RatingStars value={rating.value} size={14} />
              <div className="u-mono text-[11px]" style={{ color: "var(--u-muted)" }}>
                {rating.count} {rating.count === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl p-6"
              style={{ border: "1px solid var(--u-slate)", backgroundColor: "var(--u-well)" }}
            >
              <RatingStars value={review.rating} size={13} />
              {review.title && (
                <h3 className="mt-3 text-sm font-semibold" style={{ color: "var(--u-bone)" }}>
                  {review.title}
                </h3>
              )}
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--u-bone)" }}>
                {review.body}
              </p>
              <div className="u-mono mt-4 text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--u-muted)" }}>
                {review.reviewerName} · {formatReviewDate(review.createdAt)}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm" style={{ color: "var(--u-muted)" }}>
          {rating
            ? `Rated ${rating.value.toFixed(1)} out of 5 by ${rating.count} buyers.`
            : "No reviews yet."}
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------- buy panel --- */

export function QuantityStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <div
      className="flex w-fit items-center rounded-full px-2.5 py-1"
      style={{ border: "1px solid var(--u-slate)", backgroundColor: "rgba(0,0,0,0.25)" }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="cursor-pointer p-1 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        <Minus size={14} weight="bold" />
      </button>
      <span className="u-mono w-12 px-4 text-center text-sm font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        className="cursor-pointer p-1 transition-opacity hover:opacity-70"
        aria-label="Increase quantity"
      >
        <Plus size={14} weight="bold" />
      </button>
    </div>
  );
}

export function OptionSwatches({
  options,
  selected,
  onSelect,
}: {
  options: ShopifyProductDetail["options"];
  selected: Record<string, string>;
  onSelect: (name: string, value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="mt-8 space-y-5">
      {options.map((option) => (
        <div key={option.name} className="space-y-2.5">
          <span className="u-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--u-muted)" }}>
            {option.name}
          </span>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isActive = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSelect(option.name, value)}
                  aria-pressed={isActive}
                  className="u-mono cursor-pointer rounded-full px-4 py-2 text-xs transition-all"
                  style={
                    isActive
                      ? {
                          backgroundColor: "var(--u-yellow)",
                          color: "var(--u-ink)",
                          border: "1px solid var(--u-yellow)",
                          fontWeight: 600,
                        }
                      : { border: "1px solid var(--u-slate)", color: "var(--u-bone)" }
                  }
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PriceRow({
  price,
  originalPrice,
  discount,
  savings,
}: {
  price: string;
  originalPrice?: string;
  discount?: string;
  savings?: string;
}) {
  return (
    <div className="mt-6 border-b pb-6" style={{ borderBottomColor: "var(--u-slate)" }}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="u-mono text-3xl font-bold" style={{ color: "var(--u-price)" }}>
          {price}
        </span>
        {originalPrice && (
          <span className="u-mono text-base line-through" style={{ color: "var(--u-muted)" }}>
            {originalPrice}
          </span>
        )}
        {discount && (
          <span
            className="u-mono rounded px-2 py-1 text-[11px] font-bold"
            style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
          >
            {discount}
          </span>
        )}
      </div>
      {savings && (
        <div className="u-mono mt-2.5 text-xs" style={{ color: "var(--u-bone)" }}>
          You save {savings}
        </div>
      )}
      <div className="u-mono mt-4 space-y-1.5 text-[11px]" style={{ color: "var(--u-muted)" }}>
        <div>MRP inclusive of all taxes</div>
        <div>Delivery charges: Free delivery</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- sticky buy bar --- */

/**
 * Mobile add-to-cart bar. It appears only once the real CTA row has scrolled
 * out of view, so the two are never on screen competing with each other.
 */
export function StickyBuyBar({
  visible,
  image,
  title,
  price,
  originalPrice,
  disabled,
  onAddToCart,
}: {
  visible: boolean;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  disabled: boolean;
  onAddToCart: () => void;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 transition-all duration-300 lg:hidden"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <div
        className="flex items-center gap-3 rounded-2xl p-2.5 shadow-2xl"
        style={{ backgroundColor: "var(--u-well)", border: "1px solid var(--u-slate)" }}
      >
        <img
          src={image}
          alt=""
          className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold" style={{ color: "var(--u-bone)" }}>
            {title}
          </div>
          <div className="u-mono flex items-baseline gap-2 text-xs" style={{ color: "var(--u-price)" }}>
            {price}
            {originalPrice && (
              <span className="line-through" style={{ color: "var(--u-muted)" }}>
                {originalPrice}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={disabled}
          className="u-mono shrink-0 cursor-pointer rounded-xl px-4 py-3 text-[11px] font-bold uppercase tracking-widest transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
        >
          <ShoppingBag size={15} className="inline" /> Add
        </button>
      </div>
    </div>
  );
}

/** True once `ref`'s element has scrolled out of view. */
export function useScrolledPast(ref: React.RefObject<HTMLElement | null>): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return past;
}
