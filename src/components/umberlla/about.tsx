import type { ReactNode } from "react";
import {
  Briefcase,
  Eye,
  Gear,
  Globe,
  Handshake,
  ShieldCheck,
  ShoppingCart,
  Sun,
  Target,
  type Icon,
} from "@phosphor-icons/react";
import { TypeSequence } from "@/components/umberlla/type-sequence";

/**
 * Rotated, white-bordered sticker badge matching the site's CRAV design language.
 */
export function Sticker({
  children,
  tone = "yellow",
  rotate = -3,
  className = "",
}: {
  children: ReactNode;
  tone?: "yellow" | "navy" | "cream" | "white";
  rotate?: number;
  className?: string;
}) {
  const tones: Record<string, string> = {
    yellow: "bg-[#f2c230] text-[#101b33]",
    navy: "bg-[#101b33] text-white",
    cream: "bg-[#f3efe4] text-[#101b33]",
    white: "bg-white text-[#101b33]",
  };
  return (
    <span
      className={`u-sticker shadow-[3px_3px_0_0_rgba(16,27,51,1)] ${tones[tone]} ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

/**
 * Tilted marquee ribbon dividing page sections with scrolling brand slogans.
 */
export function AboutMarquee() {
  const items =
    "★ 100+ YEARS OF TRUST \u00A0\u00A0 5TH-GENERATION LEADERSHIP \u00A0\u00A0 MYSORE AUTOMATION \u00A0\u00A0 MUMBAI · CALICUT · MYSORE \u00A0\u00A0 UNCOMPROMISING QUALITY \u00A0\u00A0 ";
  return (
    <div className="u-marquee-banner select-none py-3 shadow-md" aria-hidden="true">
      <div className="u-marquee font-['Fredoka'] tracking-wider text-sm md:text-base uppercase font-bold">
        <span>{items}</span>
        <span>{items}</span>
        <span>{items}</span>
        <span>{items}</span>
      </div>
    </div>
  );
}

/**
 * Key brand stats highlighting the 100+ year legacy in playful tactile cards.
 */
const STATS = [
  { figure: "100+", label: "Years of Trust", note: "Sheltering India", rotate: -1.5 },
  { figure: "Iconic", label: "Smiling Logo", note: "Known in every home", rotate: 1.5 },
  { figure: "5th Gen", label: "Family Leadership", note: "Generations of care", rotate: -1 },
  { figure: "3 Hubs", label: "National Presence", note: "Mumbai · Calicut · Mysore", rotate: 2 },
];

export function AboutStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="u-tilt-card bg-white p-6 md:p-8 text-center border-4 border-white shadow-[5px_5px_0_0_rgba(16,27,51,1)] transition-transform duration-300 hover:scale-105 hover:rotate-0"
          style={{ transform: `rotate(${stat.rotate}deg)` }}
        >
          <div className="u-fun-heading text-4xl sm:text-5xl md:text-6xl text-[#101b33]">
            {stat.figure}
          </div>
          <div className="u-mono mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[#101b33]">
            {stat.label}
          </div>
          <div className="mt-1 text-xs text-[#101b33]/60 font-medium">
            {stat.note}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Company Profile narrative and Mysore manufacturing facility showcase.
 */
export function AboutStory() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Photo Column with tactile frame and stickers */}
      <div className="lg:col-span-5 relative">
        <div className="u-tilt-card u-tilt-left bg-white p-3.5 shadow-[8px_8px_0_0_rgba(16,27,51,1)] border-4 border-white">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
            <img
              src="/assets/products/storm.jpg"
              alt="Sun Umbrella canopy enduring driving rain with strength and precision"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101b33]/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="u-mono text-[11px] font-bold uppercase tracking-wider text-[#f2c230]">
                Made in Mysuru, India
              </span>
              <p className="font-['Fredoka'] text-lg font-bold drop-shadow">
                Traditional Craftsmanship Meets Advanced Automation
              </p>
            </div>
          </div>
        </div>

        {/* Playful overlapping stickers */}
        <div className="absolute -bottom-5 -right-2 md:-right-6 z-20">
          <Sticker tone="yellow" rotate={5} className="text-xs md:text-sm py-2 px-4 shadow-[4px_4px_0_0_rgba(16,27,51,1)]">
            ☂ 100+ Years
          </Sticker>
        </div>
        <div className="absolute -top-4 -left-2 z-20">
          <Sticker tone="navy" rotate={-6} className="text-[11px] md:text-xs py-1.5 px-3.5 shadow-[3px_3px_0_0_rgba(242,194,48,1)]">
            😊 Iconic Smiling Logo
          </Sticker>
        </div>
      </div>

      {/* Copy Column */}
      <div className="lg:col-span-7">
        <Sticker tone="yellow" rotate={-2} className="mb-4">
          ☂ Pioneer & Market Leader
        </Sticker>

        <h2 className="u-fun-heading text-3xl sm:text-4xl md:text-5xl text-[#101b33] mt-2">
          Company Profile
        </h2>

        <div className="mt-6 space-y-5 text-base md:text-lg leading-relaxed text-[#101b33]/80">
          <p>
            <strong className="text-[#101b33] font-bold">
              Sun Umbrella Private Limited
            </strong>{" "}
            is a pioneer and market leader in umbrella manufacturing in India.
            Currently driven by 5th-generation
            leadership, the iconic Sun Brand Umbrella—recognized by its cheerful,
            smiling logo—has represented trust, durability, and innovation for
            100+ years.
          </p>
          <p>
            With offices in{" "}
            <span className="font-bold text-[#101b33]">Mumbai</span> and{" "}
            <span className="font-bold text-[#101b33]">Calicut</span>, and a modern
            manufacturing facility in{" "}
            <span className="font-bold text-[#101b33]">Mysore, India</span>, Sun
            Umbrellas blends traditional craftsmanship with advanced automation.
            From precision-moulded handles and easy-snap frames to UV-protected
            and high-grade water repellent fabrics, every component of our
            personal umbrellas is engineered under an uncompromising commitment
            to quality.
          </p>
        </div>

        {/* Feature badges */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          {[
            "5th-Generation Leadership",
            "Iconic Smiling Logo",
            "Mysore Automated Facility",
            "Mumbai & Calicut Offices",
            "Precision-Moulded Frames",
            "UV & Water Repellent Fabrics",
          ].map((tag, idx) => (
            <span
              key={tag}
              className="u-sticker text-xs bg-white text-[#101b33] border-2 border-[#101b33] shadow-[2px_2px_0_0_rgba(16,27,51,1)]"
              style={{ transform: `rotate(${idx % 2 === 0 ? -1 : 1}deg)` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Mission & Vision side-by-side statement cards with bold tactile styling.
 */
export function AboutMissionVision() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Mission Card (Warm Yellow ground) */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#f2c230] p-8 md:p-12 border-4 border-[#101b33] shadow-[7px_7px_0_0_rgba(16,27,51,1)] transition-transform duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <Sticker tone="white" rotate={-2} className="text-xs uppercase font-bold">
            🎯 MISSION STATEMENT
          </Sticker>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101b33] text-[#f2c230] shadow-md">
            <Target size={28} weight="bold" />
          </div>
        </div>

        <div className="mt-8">
          <span className="font-['Fredoka'] text-6xl text-[#101b33]/25 leading-none block -mb-4 select-none">
            “
          </span>
          <blockquote className="font-['Fredoka'] text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-[#101b33]">
            To bring monsoon cheer and reliable personal umbrella solutions,
            year after year, by crafting world-class, durable umbrellas through
            innovation, precision engineering, and customer-centric
            design—without ever compromising on quality.
          </blockquote>
          <span className="font-['Fredoka'] text-6xl text-[#101b33]/25 leading-none block text-right -mt-2 select-none">
            ”
          </span>
        </div>
      </div>

      {/* Vision Card (Deep Navy ground) */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#101b33] p-8 md:p-12 border-4 border-white shadow-[7px_7px_0_0_rgba(242,194,48,1)] transition-transform duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <Sticker tone="yellow" rotate={2} className="text-xs uppercase font-bold">
            👁️ VISION STATEMENT
          </Sticker>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#f2c230] border border-white/20">
            <Eye size={28} weight="bold" />
          </div>
        </div>

        <div className="mt-8">
          <span className="font-['Fredoka'] text-6xl text-white/20 leading-none block -mb-4 select-none">
            “
          </span>
          <blockquote className="font-['Fredoka'] text-xl sm:text-2xl md:text-3xl font-bold leading-snug text-[#f3efe4]">
            To remain the world’s most trusted icon in personal umbrella
            craftsmanship by seamlessly connecting 100+ years of heritage with
            modern manufacturing excellence, global distribution, and
            sustainable design.
          </blockquote>
          <span className="font-['Fredoka'] text-6xl text-white/20 leading-none block text-right -mt-2 select-none">
            ”
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Global & Domestic Footprint with 3 large tactile cards & partner pills.
 */
export function AboutFootprint() {
  const footprintPillars = [
    {
      icon: ShoppingCart,
      badge: "Retail & E-Com",
      rotate: -1,
      title: "Retail & E-Commerce Supply Chain",
      description:
        "Key supplier to India’s retail giants and quick-commerce leaders, ensuring rapid availability across thousands of stores and instant delivery carts nationwide.",
      sections: [
        {
          heading: "India's Retail Giants",
          partners: ["Avenue Supermarts (DMart)", "Reliance Retail", "Tata Trent"],
        },
        {
          heading: "Quick-Commerce & E-Commerce",
          partners: [
            "Amazon",
            "Swiggy Instamart",
            "Blinkit",
            "Flipkart Minutes",
            "Myntra",
          ],
        },
      ],
    },
    {
      icon: Briefcase,
      badge: "Corporate & B2B",
      rotate: 1,
      title: "Corporate & Promotional Solutions",
      description:
        "Trusted custom manufacturing partner for personal and promotional umbrellas for celebrated global icons, enterprise institutions, and airlines.",
      sections: [
        {
          heading: "Global Icons & Corporate Partners",
          partners: [
            "Mercedes-Benz",
            "Bosch",
            "Crocs",
            "Virgin",
            "IndiGo Airlines",
            "Tata Capital",
            "Ernst & Young",
            "ICICI",
          ],
        },
      ],
    },
    {
      icon: Globe,
      badge: "Worldwide Export",
      rotate: -1,
      title: "International Export",
      description:
        "A strong, growing international footprint supplying high-volume, premium personal rainwear, fashion, golf, and custom branded umbrellas to global B2B markets.",
      sections: [
        {
          heading: "Global Portfolio Solutions",
          partners: [
            "High-Volume Personal Rainwear",
            "Premium Fashion Umbrellas",
            "Professional Golf Umbrellas",
            "Custom Branded B2B Umbrellas",
          ],
        },
      ],
    },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {footprintPillars.map((pillar) => {
        const PillarIcon = pillar.icon;
        return (
          <div
            key={pillar.title}
            className="flex flex-col justify-between rounded-[28px] bg-white p-7 md:p-9 border-4 border-[#101b33] shadow-[6px_6px_0_0_rgba(16,27,51,1)] transition-transform duration-300 hover:scale-[1.02]"
            style={{ transform: `rotate(${pillar.rotate}deg)` }}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2c230] text-[#101b33] shadow-sm">
                  <PillarIcon size={26} weight="bold" />
                </div>
                <Sticker tone="cream" rotate={2} className="text-[11px] font-bold">
                  {pillar.badge}
                </Sticker>
              </div>

              <h3 className="u-fun-heading mt-6 text-2xl md:text-3xl text-[#101b33]">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm md:text-base leading-relaxed text-[#101b33]/70">
                {pillar.description}
              </p>
            </div>

            <div className="mt-8 border-t-2 border-[#101b33]/10 pt-6 space-y-5">
              {pillar.sections.map((sec) => (
                <div key={sec.heading}>
                  <div className="u-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#101b33]/80">
                    {sec.heading}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sec.partners.map((partner) => (
                      <span
                        key={partner}
                        className="rounded-lg border-2 border-[#101b33] bg-[#faf8f5] px-3 py-1.5 text-xs font-bold text-[#101b33] shadow-[2px_2px_0_0_rgba(16,27,51,1)] hover:bg-[#f2c230] transition-colors"
                      >
                        {partner}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The 4 Core Values in fun, thick-bordered pop cards.
 */
const VALUES: Array<{
  icon: Icon;
  emoji: string;
  title: string;
  blurb: string;
  rotate: number;
}> = [
  {
    icon: ShieldCheck,
    emoji: "🛡️",
    title: "Uncompromising Quality",
    blurb:
      "Every frame, fabric, and handle undergo rigorous standards to ensure multi-season durability and customer pride in every personal umbrella we make.",
    rotate: -1.5,
  },
  {
    icon: Handshake,
    emoji: "🤝",
    title: "Heritage of Trust",
    blurb:
      "Built on a 100+ year legacy of reliability, honesty, and long-term partnerships with retail chains, corporate clients, and end consumers alike.",
    rotate: 1.5,
  },
  {
    icon: Gear,
    emoji: "⚙️",
    title: "Craftsmanship & Innovation",
    blurb:
      "Blending hand-craftsmanship with state-of-the-art automation at our Mysore facility to ensure meticulous attention to detail across high-volume production.",
    rotate: -1,
  },
  {
    icon: Sun,
    emoji: "☀️",
    title: "Customer Cheer & Proximity",
    blurb:
      "Staying close to our market needs across Mumbai, Calicut, and beyond, creating personal umbrellas that bring a smile, and delivering exceptional value across all retail, e-commerce, and corporate channels.",
    rotate: 1,
  },
];

export function AboutValues() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {VALUES.map(({ icon: ValueIcon, emoji, title, blurb, rotate }) => (
        <div
          key={title}
          className="rounded-[24px] bg-white p-8 border-4 border-[#101b33] shadow-[5px_5px_0_0_rgba(16,27,51,1)] transition-transform duration-300 hover:scale-[1.02] hover:rotate-0"
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f2c230] text-[#101b33] shadow-sm">
              <ValueIcon size={26} weight="bold" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xl mr-2">{emoji}</span>
              <h3 className="u-fun-heading inline text-2xl text-[#101b33]">
                {title}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-base leading-relaxed text-[#101b33]/75 font-medium">
            {blurb}
          </p>
        </div>
      ))}
    </div>
  );
}
