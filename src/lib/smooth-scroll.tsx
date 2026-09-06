import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import Lenis from "lenis";

/**
 * Site-wide inertia scroll (Lenis). Client-only, disabled under
 * prefers-reduced-motion. Lenis eases the *native* document scroll, so the
 * hero scroll-scrub (which reads window.scrollY) keeps working unchanged.
 * Runs its own rAF loop — no dependency on any other animation system.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Shared so the wave transition can lock scroll and reset it under cover.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenisRef.current = lenis;

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // A new page has to start at the top. The router does set the document there,
  // but Lenis keeps its own scroll value and snaps back to the old offset on
  // the next wheel tick — which is why a product page opened halfway down.
  // Syncing to window.scrollY rather than to 0 keeps back/forward restoration.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const sync = () => lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    sync();
    // The router doesn't apply its scroll in one go — a new page lands on this
    // frame, a restored back/forward position a little later — so follow it for
    // a moment rather than reading once and trusting it.
    const frame = requestAnimationFrame(sync);
    const settle = window.setTimeout(sync, 200);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [pathname]);

  return null;
}
