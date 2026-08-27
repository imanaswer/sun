import { useEffect, useState } from "react";

import { OpenTheStory } from "@/components/umberlla/ctas";
import { scrollScrubScenes } from "@/scroll-scrub-scenes";

/** True on phone-sized viewports (client-side; safe initial value on the SPA). */
export function useIsMobile() {
  const [mobile, setMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

/**
 * Lightweight hero for phones. The desktop hero scrubs a video frame-by-frame
 * on scroll, which mobile browsers handle terribly (heavy decode + poor
 * seeking) — so on phones we show the first scene as a plain full-screen hero:
 * a poster image with a simple autoplaying, looping, muted video over it (no
 * scrubbing) and the headline/copy/CTA on top. Loads fast, never lags.
 */
export function MobileHero() {
  const s = scrollScrubScenes[0];
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-[var(--u-navy)] px-5 pb-16 pt-28">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster={s.mobilePoster ?? s.poster}
        src={s.mobileClip ?? s.clip}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--u-navy)] via-[var(--u-navy)]/45 to-[var(--u-navy)]/10" />

      <div className="relative z-10">
        <h1 className="u-fun-head max-w-[14ch] text-[13vw] leading-[0.95] text-[var(--u-yellow)]">
          {s.title}
        </h1>
        <p className="mt-4 max-w-[38ch] text-base leading-relaxed text-[var(--u-bone)]/90">
          {s.body}
        </p>
        {s.tags && s.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {s.tags.map((t) => (
              <span
                key={t}
                className="u-mono rounded-md border border-[var(--u-bone)]/25 px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--u-bone)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-7">
          <OpenTheStory />
        </div>
      </div>
    </section>
  );
}
