/**
 * Sun Umbrella bespoke chrome. Four CTAs, four interaction identities, one
 * label per intent page-wide. There is deliberately no shared button component.
 */
import type { ReactNode } from "react";

/** Nav slab: yellow floods in from the left, ink flips to navy. */
export function ShopTheRange({ className = "" }: { className?: string }) {
  return (
    <a
      href="#collections"
      className={`u-cta-slab u-mono inline-flex items-center px-4 py-2 text-xs uppercase tracking-[0.18em] ${className}`}
    >
      Shop the range
    </a>
  );
}

/** Chapter link: the yellow rule draws across, the arrow slides. */
export function OpenTheStory() {
  return (
    <a href="#collections" className="u-cta-draw group inline-block">
      <span className="flex items-baseline gap-2 text-base font-medium">
        Open the story
        <span aria-hidden="true" className="u-cta-draw-arrow">
          &rarr;
        </span>
      </span>
      <span aria-hidden="true" className="u-cta-draw-line mt-2 w-full" />
    </a>
  );
}

/** Collection block: framed, the corner tick rotates a quarter turn. */
export function FindYourSize({ href = "#bestsellers" }: { href?: string }) {
  return (
    <a
      href={href}
      className="u-cta-frame u-mono inline-flex items-center gap-3 px-5 py-3 text-xs uppercase tracking-[0.18em]"
    >
      Find your size
      <span aria-hidden="true" className="u-cta-frame-tick text-[var(--u-yellow)]">
        +
      </span>
    </a>
  );
}

/** Closing monolith: solid yellow, presses down when held. */
export function GetOne({
  className = "",
  href = "#collections",
  children = "Get one",
}: {
  className?: string;
  href?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`u-cta-monolith inline-flex items-center px-8 py-4 text-lg font-semibold tracking-tight ${className}`}
    >
      {children}
    </a>
  );
}
