/**
 * Scene data for the UMBERLLA scroll-scrub journey.
 *
 * Journey shape: single-shot. One continuous 15s film of one umbrella opening
 * in a dark rain studio, cut into three consecutive seam-true segments so the
 * page carries three chapters over one unbroken camera move. Every `poster` is
 * the exact first frame of the encoded clip beside it.
 *
 * Keep this array a module constant.
 */
import type {
  ScrollScrubScene,
  ScrollScrubTheme,
} from "@/components/scroll-scrub/scroll-scrub";

/** Brand tokens for the journey layer (locked in app/design-brief.md). */
export const scrollScrubTheme: ScrollScrubTheme = {
  accent: "#f2c230",
  background: "#101b33",
  ink: "#f3efe4",
  muted: "#9aa7bf",
};

export const scrollScrubScenes: ScrollScrubScene[] = [
  {
    body: "Recognized by our iconic smiling logo, Sun Brand Umbrella has been an essential part of Indian homes for 100+ years—sheltering generations with unmatched quality through every storm.",
    clip: "/assets/world/scene-01.mp4",
    id: "scene-01",
    label: "Monsoon cheer",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobileFrameCount: 151,
    mobileFrameOffset: 0,
    mobileFramePrefix: "/assets/world/scene-mobile/ezgif-frame-",
    mobileFrameSuffix: ".jpg",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    poster: "/assets/world/scene-01-poster.png",
    scroll: 1.6,
    tags: ["100+ YEARS", "ICONIC SUN BRAND"],
    title: "100+ Years of Trust,\nDurability & Innovation.",
  },
  {
    body: "Effortless protection engineered for every season and every generation. Rain glides off the canopy, flexible frames withstand harsh gusts, and UV shielding keeps the sun at bay—so you always arrive looking fresh.",
    clip: "/assets/world/scene-02.mp4",
    id: "scene-02",
    label: "The mechanism",
    mobileClip: "/assets/world/scene-02-mobile.mp4",
    mobileFrameCount: 151,
    mobileFrameOffset: 151,
    mobileFramePrefix: "/assets/world/scene-mobile/ezgif-frame-",
    mobileFrameSuffix: ".jpg",
    mobilePoster: "/assets/world/scene-02-mobile-poster.png",
    poster: "/assets/world/scene-02-poster.png",
    scroll: 1.6,
    tags: ["ALL-WEATHER SHIELD", "FOR EVERY GENERATION"],
    title: "Designed for Style.\nBuilt for All Weather.",
  },
  {
    body: "Blending traditional craftsmanship with modern automation. Built with precision-moulded handles, easy-snap frames, and high-grade UV and water-repellent fabrics for ultimate durability.",
    clip: "/assets/world/scene-03.mp4",
    id: "scene-03",
    label: "Made to last",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    mobileFrameCount: 150,
    mobileFrameOffset: 302,
    mobileFramePrefix: "/assets/world/scene-mobile/ezgif-frame-",
    mobileFrameSuffix: ".jpg",
    mobilePoster: "/assets/world/scene-03-mobile-poster.png",
    poster: "/assets/world/scene-03-poster.png",
    scroll: 1.6,
    tags: ["ADVANCED AUTOMATION", "UV & WATER REPELLENT"],
    title: "Precision Engineering.\nUncompromising Quality.",
  },
];
