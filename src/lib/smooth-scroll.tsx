import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide inertia scroll (Lenis). Client-only, disabled under
 * prefers-reduced-motion. Lenis eases the *native* document scroll, so the
 * hero scroll-scrub (which reads window.scrollY) keeps working unchanged.
 * Runs its own rAF loop — no dependency on any other animation system.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Shared so the wave transition can lock scroll and reset it under cover.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
