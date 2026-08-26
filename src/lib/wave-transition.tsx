import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Premium organic wave/liquid transition between the dark hero and the white
 * storefront. Three full-screen SVG curtains (navy → yellow → cream), each with
 * asymmetrical multi-curve top/bottom edges, sweep up in a staggered liquid
 * motion: they cover the hero (which blurs out) then retract off the top,
 * revealing the white section as it comes into focus. GSAP-driven, transform +
 * filter only, responsive (preserveAspectRatio="none"), ~1.3s, reduced-motion
 * safe. Fired once when scroll crosses the hero→white boundary.
 */

// Asymmetrical, hand-tuned wave curtains — deliberately NOT sine waves. The
// white layer matches the storefront exactly so the reveal is seamless; the
// yellow crest leads the rise for a subtle brand flash.
const WAVES: { fill: string; d: string }[] = [
  {
    // leading crest — brand yellow, rises a beat ahead
    fill: "var(--u-yellow)",
    d: "M0,150 C260,250 470,90 760,190 C1030,280 1230,110 1440,210 L1440,1400 L0,1400 Z",
  },
  {
    // main — white, brings the storefront up and settles into place
    fill: "#ffffff",
    d: "M0,200 C220,90 440,270 720,180 C1010,85 1210,260 1440,160 L1440,1400 L0,1400 Z",
  },
];

export function WaveTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<SVGSVGElement[]>([]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const layers = layersRef.current.filter(Boolean);
    const sentinel = document.getElementById("hero-end");
    if (!overlay || layers.length === 0 || !sentinel) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector<HTMLElement>(".scroll-scrub");
    const incoming = document.getElementById("next-gen");

    gsap.set(layers, { yPercent: 120 });

    let playing = false;

    const play = () => {
      if (playing || reduced) return;
      playing = true;
      const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void; scrollTo(t: number, o?: object): void } }).__lenis;
      // Lock scroll for the duration so where you land is deterministic.
      lenis?.stop();
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(layers, { yPercent: 120 });

      const finish = () => {
        gsap.set(overlay, { autoAlpha: 0 });
        gsap.set(layers, { yPercent: 120 });
        if (hero) gsap.set(hero, { clearProps: "filter" });
        lenis?.start();
        playing = false;
      };
      // Safety net: a full-screen overlay must never get stuck, even if a
      // frame stalls — force it hidden shortly after the timeline should end.
      const safety = window.setTimeout(finish, 2600);
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(safety);
          finish();
        },
      });

      // Bring the white storefront up: the curtains rise from below the fold
      // and ease/settle into full cover over the hero, which blurs out behind.
      tl.to(
        layers,
        { yPercent: 0, duration: 0.9, ease: "power3.out", stagger: 0.09 },
        0,
      );
      if (hero) {
        tl.to(hero, { filter: "blur(8px)", duration: 0.7, ease: "power2.in" }, 0);
      }

      // Under full cover, reset scroll to the top of the white section — so you
      // always emerge at the start of the storefront, whatever your scroll
      // speed was. Hidden behind the curtain, so no visible jump.
      tl.call(
        () => {
          if (incoming && lenis) {
            const target = incoming.getBoundingClientRect().top + window.scrollY;
            lenis.scrollTo(target, { immediate: true, force: true });
          }
        },
        [],
        0.9,
      );

      // Reveal the real white storefront (seamless — same white): the overlay
      // fades once it has settled and the scroll is reset, section into focus.
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

    // Test hook — lets the timeline be triggered / seeked from devtools.
    (window as unknown as { __wave?: unknown }).__wave = {
      play,
      seek: (p: number) => {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(layers, { yPercent: gsap.utils.interpolate(120, 0, p) });
      },
    };

    // Fire once when the hero→white boundary crosses the mid-viewport going
    // down; re-arm after scrolling back well above it.
    let armed = true;
    const onScroll = () => {
      const top = sentinel.getBoundingClientRect().top;
      const vh = window.innerHeight;
      // Fire as the hero is finishing (its end nears the lower third of the
      // viewport). No lower bound: a fast scroll that blows past still fires,
      // and the under-cover scroll reset lands you at the white section's top.
      if (armed && !playing && top < vh * 0.7) {
        armed = false;
        play();
      } else if (top > vh * 1.2) {
        armed = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="wave-transition"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      {WAVES.map((w, i) => (
        <svg
          key={i}
          ref={(el) => {
            if (el) layersRef.current[i] = el;
          }}
          className="wave-transition__layer"
          viewBox="0 0 1440 1200"
          preserveAspectRatio="none"
        >
          <path d={w.d} fill={w.fill} />
        </svg>
      ))}
    </div>
  );
}
