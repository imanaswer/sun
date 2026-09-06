import {
  Certificate,
  Heart,
  Leaf,
  Lightning,
  ShieldCheck,
  Star,
  type Icon,
} from "@phosphor-icons/react";

/**
 * About page presentation: the numbers, the story, and the values grid. Props
 * would be ceremony here — every figure below is brand copy, not live data.
 */

const STATS = [
  { figure: "100+", label: "Years of craftsmanship" },
  { figure: "5 Lac+", label: "Happy customers" },
  { figure: "200+", label: "Retail partners" },
  { figure: "50+", label: "Umbrella designs" },
];

export function AboutStats() {
  return (
    <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
      {STATS.map((stat, index) => (
        <div
          key={stat.label}
          className={[
            "px-4 text-center md:px-8",
            // Rules between the figures, never trailing off the last one.
            index > 0 ? "border-l" : "",
            index === 2 ? "border-l-0 md:border-l" : "",
          ].join(" ")}
          style={{ borderColor: "var(--u-slate)" }}
        >
          <div className="u-fun-head text-4xl leading-none md:text-6xl" style={{ color: "var(--u-bone)" }}>
            {stat.figure}
          </div>
          <div className="u-mono mt-3 text-xs uppercase tracking-[0.14em]" style={{ color: "var(--u-muted)" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AboutStory() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="overflow-hidden rounded-[28px]" style={{ border: "1px solid var(--u-slate)" }}>
        <img
          src="/assets/products/storm.jpg"
          alt="A Sun Umbrella canopy holding steady in driving rain"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>

      <div>
        <span className="u-mono text-xs uppercase tracking-[0.18em]" style={{ color: "var(--u-accent-text)" }}>
          Who we are
        </span>
        <h2 className="u-fun-head mt-4 text-3xl leading-[1.08] md:text-5xl" style={{ color: "var(--u-bone)" }}>
          Built for every storm since day one
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-[1.85] md:text-base" style={{ color: "var(--u-muted)" }}>
          <p>
            For 100+ years Sun Umbrella has stood between India and the sky. What
            began as a family workshop in Mysuru is now a factory whose frames,
            fabric and finishing are made to survive a monsoon rather than
            photograph well in one.
          </p>
          <p>
            Every umbrella is cut, assembled and tested in-house — ribs flexed
            until they spring back, canopies soaked, handles pulled. The ones
            that pass carry the sun mark. The ones that don't never reach a
            shelf.
          </p>
        </div>
      </div>
    </div>
  );
}

const VALUES: Array<{ icon: Icon; title: string; blurb: string }> = [
  {
    icon: Certificate,
    title: "Quality",
    blurb: "Every frame, panel and handle is checked before it earns the sun mark.",
  },
  {
    icon: ShieldCheck,
    title: "Durability",
    blurb: "Fibreglass ribs and windproof vents, built for a season that repeats.",
  },
  {
    icon: Star,
    title: "Style",
    blurb: "Prints and finishes worth carrying on a day it never ends up raining.",
  },
  {
    icon: Lightning,
    title: "Innovation",
    blurb: "Auto open-and-close, UV-protective coatings, inverted no-drip canopies.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    blurb: "An umbrella that lasts years is the greenest one we know how to make.",
  },
  {
    icon: Heart,
    title: "Customer first",
    blurb: "Repairs, spares and a Mysuru office that answers its own phone.",
  },
];

export function AboutValues() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {VALUES.map(({ icon: ValueIcon, title, blurb }) => (
        <div
          key={title}
          className="rounded-2xl p-7 text-center transition-colors"
          style={{ border: "1px solid var(--u-slate)", background: "var(--u-card)" }}
        >
          {/* Inline icons rather than image files: they take the accent colour
              from the theme and stay sharp at any size. */}
          <ValueIcon
            size={40}
            weight="bold"
            aria-hidden="true"
            className="mx-auto"
            style={{ color: "var(--u-accent-text)" }}
          />
          <h3 className="u-fun-head mt-5 text-xl" style={{ color: "var(--u-bone)" }}>
            {title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--u-muted)" }}>
            {blurb}
          </p>
        </div>
      ))}
    </div>
  );
}
