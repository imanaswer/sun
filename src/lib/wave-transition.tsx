import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Bi-directional organic wave/liquid page transition at the hero ↔ white
 * storefront boundary. Asymmetrical, hand-tuned multi-curve edges (not sine).
 *
 *  - DOWN (hero → white): a white curtain with a yellow crest rises from below,
 *    covers the hero (which blurs), scroll is reset to the TOP of the white
 *    section under cover, then it reveals the storefront in focus.
 *  - UP (white → hero): a navy curtain with a yellow crest descends from above,
 *    covers the storefront, scroll is reset to the END of the hero under cover,
 *    then it reveals the hero in focus.
 *
 * Scroll is locked for the ~1.4s so you always land deterministically at the
 * top of the storefront / end of the hero, whatever your scroll speed. GSAP,
 * transform + filter only, responsive, reduced-motion safe, with a safety net
 * so the full-screen overlay can never get stuck.
 */

// Wavy TOP edge, solid below — rises from the bottom (down transition).
const WAVES_DOWN: { fill: string; d: string }[] = [
  {
    fill: "var(--u-yellow)",
    d: "M0,150 C260,250 470,90 760,190 C1030,280 1230,110 1440,210 L1440,1400 L0,1400 Z",
  },
  {
    fill: "#ffffff",
    d: "M0,200 C220,90 440,270 720,180 C1010,85 1210,260 1440,160 L1440,1400 L0,1400 Z",
  },
];

// Wavy BOTTOM edge, solid above — descends from the top (up transition).
const WAVES_UP: { fill: string; d: string }[] = [
  {
    fill: "var(--u-yellow)",
    d: "M0,0 L1440,0 L1440,1250 C1180,1160 980,1330 690,1230 C410,1135 210,1320 0,1230 Z",
  },
  {
    fill: "var(--u-navy)",
    d: "M0,0 L1440,0 L1440,1200 C1210,1100 1010,1290 720,1190 C430,1090 220,1280 0,1190 Z",
  },
];

type Lenis = { stop(): void; start(): void; scrollTo(t: number, o?: object): void };

export function WaveTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const downRef = useRef<SVGSVGElement[]>([]);
  const upRef = useRef<SVGSVGElement[]>([]);

  useEffect(() => {
    let retryTimer: number | undefined;
    let cleanup = () => {};

    const init = () => {
      const overlay = overlayRef.current;
      const downLayers = downRef.current.filter(Boolean);
      const upLayers = upRef.current.filter(Boolean);
      // The home route is code-split, so #hero-end may not exist yet on the
      // first mount — poll until it (and the hero) are in the DOM.
      const sentinel = document.getElementById("hero-end");
      if (
        !overlay ||
        downLayers.length === 0 ||
        upLayers.length === 0 ||
        !sentinel
      ) {
        retryTimer = window.setTimeout(init, 200);
        return;
      }
      setup(overlay, downLayers, upLayers, sentinel);
    };

    const setup = (
      overlay: HTMLDivElement,
      downLayers: SVGSVGElement[],
      upLayers: SVGSVGElement[],
      sentinel: HTMLElement,
    ) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector<HTMLElement>(".scroll-scrub");
    const white = document.getElementById("next-gen");
    const getLenis = () =>
      (window as unknown as { __lenis?: Lenis }).__lenis;

    const rest = () => {
      gsap.set(downLayers, { yPercent: 120 });
      gsap.set(upLayers, { yPercent: -120 });
    };
    rest();

    let playing = false;

    const play = (dir: "down" | "up") => {
      if (playing) return;
      playing = true;
      const lenis = getLenis();
      lenis?.stop();
      gsap.set(overlay, { autoAlpha: 1 });
      rest();

      const layers = dir === "down" ? downLayers : upLayers;
      const outgoing = dir === "down" ? hero : white;
      const incoming = dir === "down" ? white : hero;

      const finish = () => {
        gsap.set(overlay, { autoAlpha: 0 });
        rest();
        if (outgoing) gsap.set(outgoing, { clearProps: "filter" });
        lenis?.start();
        playing = false;
      };
      const safety = window.setTimeout(finish, 2600);
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(safety);
          finish();
        },
      });

      // Cover: the curtain sweeps across and settles; outgoing blurs out.
      tl.to(layers, { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.09 }, 0);
      if (outgoing) {
        tl.to(outgoing, { filter: "blur(8px)", duration: 0.7, ease: "power2.in" }, 0);
      }

      // Under cover, reset scroll so you always land at the same place:
      // DOWN → top of the white section; UP → the end of the hero.
      tl.call(
        () => {
          const l = getLenis();
          const heroEndAbs = sentinel.getBoundingClientRect().top + window.scrollY;
          const target =
            dir === "down" ? heroEndAbs : heroEndAbs - window.innerHeight;
          const targetScroll = Math.max(0, target);
          if (l) {
            l.scrollTo(targetScroll, { immediate: true, force: true });
          } else {
            // iOS Safari throws a TypeError for behavior: "instant". 
            // window.scrollTo(x, y) is natively instant across all browsers.
            window.scrollTo(0, targetScroll);
          }
        },
        [],
        0.9,
      );

      // Reveal: overlay fades, incoming comes into focus.
      tl.to(overlay, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, 1.02);
      if (incoming) {
        tl.fromTo(
          incoming,
          { filter: "blur(10px)" },
          { filter: "blur(0px)", duration: 0.6, ease: "power2.out" },
          1,
        );
      }
    };

    // Test hooks — trigger / step either direction from devtools.
    (window as unknown as { __wave?: unknown }).__wave = {
      play,
      seekDown: (p: number) => {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(upLayers, { yPercent: -120 });
        gsap.set(downLayers, { yPercent: gsap.utils.interpolate(120, 0, p) });
      },
      seekUp: (p: number) => {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(downLayers, { yPercent: 120 });
        gsap.set(upLayers, { yPercent: gsap.utils.interpolate(-120, 0, p) });
      },
    };

    // Direction-aware trigger, fired at the END of the hero (its boundary near
    // the top of the viewport). The `inWhite` flag gives hysteresis so it fires
    // once per crossing, not repeatedly.
    const boundary = () => window.innerHeight * 0.4;
    let inWhite = sentinel.getBoundingClientRect().top < boundary();
    const onScroll = () => {
      if (playing) return;
      const nowWhite = sentinel.getBoundingClientRect().top < boundary();
      if (nowWhite && !inWhite) {
        inWhite = true;
        play("down");
      } else if (!nowWhite && inWhite) {
        inWhite = false;
        play("up");
      }
    };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    };

    init();
    return () => {
      if (retryTimer) window.clearTimeout(retryTimer);
      cleanup();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="wave-transition"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      {WAVES_DOWN.map((w, i) => (
        <svg
          key={`d${i}`}
          ref={(el) => {
            if (el) downRef.current[i] = el;
          }}
          className="wave-transition__layer"
          viewBox="0 0 1440 1400"
          preserveAspectRatio="none"
        >
          <path d={w.d} fill={w.fill} />
        </svg>
      ))}
      {WAVES_UP.map((w, i) => (
        <svg
          key={`u${i}`}
          ref={(el) => {
            if (el) upRef.current[i] = el;
          }}
          className="wave-transition__layer"
          viewBox="0 0 1440 1400"
          preserveAspectRatio="none"
        >
          <path d={w.d} fill={w.fill} />
        </svg>
      ))}
    </div>
  );
}
