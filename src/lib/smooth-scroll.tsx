import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import Lenis from "lenis";

/**
 * Site-wide inertia scroll (Lenis). Client-only, disabled under
 * prefers-reduced-motion. Lenis eases the *native* document scroll, so the
 * hero scroll-scrub (which reads window.scrollY) keeps working unchanged.
 * Runs its own rAF loop — no dependency on any other animation system.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const router = useRouter();

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

  // A new page has to start at the top. The router sets the document there,
  // but Lenis keeps its own scroll value and snaps back to the old offset on
  // the next wheel tick. The sync has to wait for the router's "rendered"
  // event, which is when it applies scroll: the URL changes as soon as a link
  // is clicked, but the page only swaps once Shopify answers, so syncing on the
  // URL change caught the old page's offset on a slow load.
  // Syncing to window.scrollY rather than to 0 keeps back/forward restoration.
  useEffect(() => {
    let frame = 0;
    let settle = 0;
    const sync = () => lenisRef.current?.scrollTo(window.scrollY, { immediate: true, force: true });
    const unsubscribe = router.subscribe("onRendered", (event) => {
      if (!event.pathChanged) return;
      sync();
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      frame = requestAnimationFrame(sync);
      settle = window.setTimeout(sync, 200);
    });
    return () => {
      unsubscribe();
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, [router]);

  return null;
}
