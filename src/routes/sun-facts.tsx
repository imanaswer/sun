import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { Sticker } from "@/components/umberlla/about";
import { canonical, pageMeta } from "@/lib/seo";
import DottedBg2 from "@/components/dotted-bg-2";
import {
  CheckCircle,
  Drop,
  Lightbulb,
  ShieldCheck,
  Sparkle,
  Sun,
  Wind,
} from "@phosphor-icons/react";

export const Route = createFileRoute("/sun-facts")({
  head: () => ({
    meta: pageMeta({
      title: "Sun Facts | Sun Brand Umbrella",
      description:
        "Discover the material science, UV protection ratings, and precision engineering behind Sun Brand Umbrellas.",
    }),
    links: [canonical("/sun-facts")],
  }),
  component: SunFactsPage,
});

function SunFactsPage() {
  const precisionComponents = [
    { num: "01", name: "Precision Handle", desc: "Moulded for ergonomic grip & thumb-release" },
    { num: "02", name: "Self-Locking Runner", desc: "Glides smoothly along the main shaft" },
    { num: "03", name: "Top Crown / Notch", desc: "Anchors all rib spokes under tension" },
    { num: "04", name: "Canopy End Tips", desc: "Protects fabric seams from pulling out" },
    { num: "05", name: "Protective Ferrule", desc: "Weather-sealed cap at the canopy apex" },
    { num: "06", name: "Tension Bushings", desc: "Absorbs vibration and reduces spoke wear" },
    { num: "07", name: "Auto-Trigger Button", desc: "One-touch opening spring latch" },
    { num: "08", name: "Spring Housing Core", desc: "Encloses the internal tension coils" },
    { num: "09", name: "Rib Joint Spacers", desc: "Prevents metal-on-metal friction & rust" },
    { num: "10", name: "Snap Band Fastener", desc: "Secure closure snap for neat folding" },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#101b33] overflow-hidden">
      <SiteNav />

      {/* ─── Hero Section with vibrant Sun Yellow background ─── */}
      <section className="relative u-section-warm overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 border-b-4 border-[#101b33]">
        <div className="absolute inset-0 z-0">
          <DottedBg2 bgColor="#f2c230" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-5 md:px-8 text-center">
          <Sticker
            tone="navy"
            rotate={-2}
            className="mb-6 mx-auto text-xs sm:text-sm py-2 px-5"
          >
            ☀️ UV & MATERIAL SCIENCE
          </Sticker>

          <h1 className="u-fun-heading text-5xl sm:text-7xl md:text-8xl text-[#101b33] max-w-[16ch] mx-auto leading-[0.98] drop-shadow-sm">
            Sun Facts
          </h1>

          <p className="mt-6 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#101b33]/85 max-w-[62ch] mx-auto leading-relaxed">
            The engineering, weather-shield science, and material purity behind
            every Sun Brand umbrella. Built to shelter you through every storm and
            sunny afternoon.
          </p>
        </div>
      </section>

      {/* ─── Main Content Container ─── */}
      <main className="relative z-10 mx-auto max-w-[1240px] px-5 py-16 md:py-24 space-y-16 md:space-y-24">
        {/* ─── Fact 1: Fabric & UV Protection Table ─── */}
        <section className="rounded-[32px] bg-white p-7 md:p-12 border-4 border-[#101b33] shadow-[8px_8px_0_0_rgba(16,27,51,1)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Sticker tone="navy" rotate={-2} className="text-xs uppercase font-bold">
              Fact 01 · Fabric Science
            </Sticker>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#101b33]/60">
              <Sun size={20} weight="fill" className="text-[#f2c230]" />
              Certified UV Testing
            </div>
          </div>

          <h2 className="u-fun-heading mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#101b33] leading-tight">
            1. Our fabrics protect you from rain and harmful UV rays of the sun:
          </h2>

          <p className="mt-4 text-base md:text-lg text-[#101b33]/75 leading-relaxed max-w-[70ch]">
            Every Sun umbrella canopy is engineered with tightly woven micro-fibres
            and specialised polymer treatments to provide impenetrable dual-season
            protection—keeping you completely dry in torrential rain and safely
            shielded under intense solar radiation.
          </p>

          {/* UV Table */}
          <div className="mt-8 overflow-hidden rounded-2xl border-3 border-[#101b33] shadow-[4px_4px_0_0_rgba(16,27,51,1)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#b2d1f7] border-b-3 border-[#101b33]">
                    <th className="py-4 px-5 sm:px-6 font-['Fredoka'] text-base sm:text-lg text-[#101b33] font-bold">
                      Fabric Type
                    </th>
                    <th className="py-4 px-5 sm:px-6 font-['Fredoka'] text-base sm:text-lg text-[#101b33] font-bold">
                      UV Blocking % (A & B)
                    </th>
                    <th className="py-4 px-5 sm:px-6 font-['Fredoka'] text-base sm:text-lg text-[#101b33] font-bold">
                      Protection Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-[#101b33]/15 font-medium text-sm sm:text-base text-[#101b33]">
                  <tr className="bg-white hover:bg-[#faf8f5] transition-colors">
                    <td className="py-4 px-5 sm:px-6 font-bold text-[#101b33]">
                      Man-made fabric with Silver Coating
                    </td>
                    <td className="py-4 px-5 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f2c230] px-3.5 py-1 text-xs font-bold text-[#101b33] shadow-sm">
                        <CheckCircle size={15} weight="bold" />
                        Above 98%
                      </span>
                    </td>
                    <td className="py-4 px-5 sm:px-6">
                      <span className="inline-block rounded-md border border-[#101b33] bg-[#f3efe4] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#101b33]">
                        UPF 50+
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-[#faf8f5] hover:bg-white transition-colors">
                    <td className="py-4 px-5 sm:px-6 font-bold text-[#101b33]">
                      Man-made fabric (Mono Color / Black)
                    </td>
                    <td className="py-4 px-5 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6f0fc] px-3.5 py-1 text-xs font-bold text-[#101b33] border border-[#101b33]/20">
                        <CheckCircle size={15} weight="bold" />
                        Above 92%
                      </span>
                    </td>
                    <td className="py-4 px-5 sm:px-6">
                      <span className="inline-block rounded-md border border-[#101b33] bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#101b33]">
                        UV Protection
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Callout Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3.5 rounded-2xl bg-[#faf8f5] p-5 border-2 border-[#101b33]/20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2c230] text-[#101b33]">
                <Drop size={22} weight="fill" />
              </div>
              <div>
                <h4 className="font-['Fredoka'] text-lg font-bold text-[#101b33]">
                  Hydrophobic Water Gliding
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-[#101b33]/70 leading-relaxed">
                  Water beads instantly and glides off with a single shake, so your
                  umbrella dries in minutes indoors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl bg-[#faf8f5] p-5 border-2 border-[#101b33]/20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101b33] text-[#f2c230]">
                <ShieldCheck size={22} weight="fill" />
              </div>
              <div>
                <h4 className="font-['Fredoka'] text-lg font-bold text-[#101b33]">
                  UPF 50+ Broad Spectrum
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-[#101b33]/70 leading-relaxed">
                  High-density silver micro-coatings reflect penetrating UVA & UVB
                  rays to prevent skin heat and sunburns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Fact 2: Frame & Spoke Architecture ─── */}
        <section className="rounded-[32px] bg-white p-7 md:p-12 border-4 border-[#101b33] shadow-[8px_8px_0_0_rgba(16,27,51,1)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Sticker tone="yellow" rotate={2} className="text-xs uppercase font-bold">
              Fact 02 · Frame Strength
            </Sticker>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#101b33]/60">
              <Wind size={20} weight="bold" className="text-[#101b33]" />
              Wind-Tested Architecture
            </div>
          </div>

          <h2 className="u-fun-heading mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#101b33] leading-tight">
            2. Thick tube and spoke sections for enhanced wind resistance and
            overall durability.
          </h2>

          <p className="mt-4 text-base md:text-lg text-[#101b33]/75 leading-relaxed max-w-[70ch]">
            Cheap umbrellas fold inside-out and snap in sudden gusty winds. Sun
            Umbrellas feature heavier gauge tube profiles and reinforced spoke
            geometry designed to flex and spring right back without permanent bend
            or joint failure.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-[#faf8f5] p-6 border-2 border-[#101b33] shadow-[3px_3px_0_0_rgba(16,27,51,1)]">
              <span className="font-['Fredoka'] text-3xl font-bold text-[#f2c230] drop-shadow-sm block">
                01
              </span>
              <h4 className="u-fun-heading mt-2 text-xl text-[#101b33]">
                Heavy-Gauge Tube
              </h4>
              <p className="mt-2 text-sm text-[#101b33]/70 leading-relaxed">
                Substantially thicker center shaft wall to resist torsional torque
                and harsh bending loads.
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf8f5] p-6 border-2 border-[#101b33] shadow-[3px_3px_0_0_rgba(16,27,51,1)]">
              <span className="font-['Fredoka'] text-3xl font-bold text-[#f2c230] drop-shadow-sm block">
                02
              </span>
              <h4 className="u-fun-heading mt-2 text-xl text-[#101b33]">
                Flexible Spring Spokes
              </h4>
              <p className="mt-2 text-sm text-[#101b33]/70 leading-relaxed">
                Specially heat-treated spring steel and fiberglass ribs that flex
                elastically when buffeted by gale-force winds.
              </p>
            </div>

            <div className="rounded-2xl bg-[#faf8f5] p-6 border-2 border-[#101b33] shadow-[3px_3px_0_0_rgba(16,27,51,1)]">
              <span className="font-['Fredoka'] text-3xl font-bold text-[#f2c230] drop-shadow-sm block">
                03
              </span>
              <h4 className="u-fun-heading mt-2 text-xl text-[#101b33]">
                Reinforced Rib Joints
              </h4>
              <p className="mt-2 text-sm text-[#101b33]/70 leading-relaxed">
                Solid rivet joints and protective spacers prevent joint
                dislocation during repetitive opening and folding.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Fact 3: 100% Virgin Granules & 10+ Plastic Components ─── */}
        <section className="rounded-[32px] bg-white p-7 md:p-12 border-4 border-[#101b33] shadow-[8px_8px_0_0_rgba(16,27,51,1)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Sticker tone="cream" rotate={-2} className="text-xs uppercase font-bold">
              Fact 03 · Material Purity
            </Sticker>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#101b33]/60">
              <Sparkle size={20} weight="fill" className="text-[#f2c230]" />
              100% Virgin Polymer
            </div>
          </div>

          <h2 className="u-fun-heading mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#101b33] leading-tight">
            3. All plastic components are made from 100% virgin granules for
            longevity.
          </h2>

          <p className="mt-4 text-base md:text-lg text-[#101b33]/75 leading-relaxed max-w-[70ch]">
            Recycled plastics degrade rapidly under sun exposure, turning brittle
            and cracking within a few months. Every single plastic component in a
            Sun umbrella is molded from fresh, pure virgin polymer granules to
            guarantee impact resistance and high thermal stability.
          </p>

          {/* Did You Know Callout Box */}
          <div className="mt-10 rounded-[28px] bg-[#f2c230] p-6 sm:p-8 md:p-10 border-4 border-[#101b33] shadow-[6px_6px_0_0_rgba(16,27,51,1)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101b33] text-[#f2c230] shadow-md">
                <Lightbulb size={28} weight="bold" />
              </div>
              <div>
                <span className="u-mono text-xs font-bold uppercase tracking-wider text-[#101b33]">
                  Component Engineering
                </span>
                <h3 className="font-['Fredoka'] text-xl sm:text-2xl md:text-3xl font-bold text-[#101b33]">
                  Did you know an umbrella can have more than 10 such precision
                  plastic components?
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base font-medium text-[#101b33]/85 leading-relaxed">
              From the runner that slides smoothly under your thumb to the tiny rib
              bushings that prevent metal fatigue, each component is molded with
              sub-millimeter precision in our Mysore manufacturing facility:
            </p>

            {/* 10 Precision Components Grid */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {precisionComponents.map((item) => (
                <div
                  key={item.num}
                  className="rounded-xl bg-white p-4 border-2 border-[#101b33] shadow-[2px_2px_0_0_rgba(16,27,51,1)] flex flex-col justify-between"
                >
                  <div className="u-mono text-xs font-bold text-[#101b33]/40">
                    {item.num}
                  </div>
                  <div className="mt-2 font-['Fredoka'] text-base font-bold text-[#101b33]">
                    {item.name}
                  </div>
                  <div className="mt-1 text-xs text-[#101b33]/70 font-medium">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Bottom CTA Banner ─── */}
        <section className="rounded-[32px] bg-[#f2c230] p-10 md:p-14 border-4 border-[#101b33] shadow-[8px_8px_0_0_rgba(16,27,51,1)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-[580px] text-center md:text-left">
            <Sticker tone="white" rotate={-2} className="mb-4 text-xs font-bold uppercase">
              ☂ Uncompromised Quality
            </Sticker>
            <h3 className="u-fun-heading text-3xl sm:text-4xl md:text-5xl text-[#101b33]">
              Experience the Sun Difference
            </h3>
            <p className="mt-3 text-base md:text-lg font-medium text-[#101b33]/80">
              Browse our complete catalog of certified UV-protective, auto open
              & close, and storm-proof umbrellas.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/collections/$handle"
              params={{ handle: "all" }}
              className="u-mono rounded-full bg-[#101b33] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:bg-[#101b33]/90 transition-transform hover:scale-105"
            >
              Shop All Umbrellas
            </Link>
            <Link
              to="/about"
              className="u-mono rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#101b33] border-2 border-[#101b33] shadow-[4px_4px_0_0_rgba(16,27,51,1)] hover:bg-white/90 transition-transform hover:scale-105"
            >
              Our 140+ Year Story
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
