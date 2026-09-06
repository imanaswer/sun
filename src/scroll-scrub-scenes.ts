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
    body: "Sun brings monsoon cheer, year after year. For 100+ years these canopies have popped up cheerfully across India — a tradition of trust you can spot from down the street.",
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
    tags: ["100+ years", "Sheltering India"],
    title: "Monsoon never\nlooked this good",
  },
  {
    body: "Precision-moulded handles on a frame that snaps open or shut in a single motion. Your thumb does the work — the other hand keeps the bag, the phone, the child.",
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
    tags: ["Auto open & close", "One-hand release"],
    title: "Snap open,\nsnap shut",
  },
  {
    body: "Waterproof, UV-protected fabric on ribs that spring back after a gust. Hand-finished in Mysuru, chosen without compromise, and built to last you many monsoons.",
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
    tags: ["UV-protective", "Built for all weather"],
    title: "Yours for\nmany seasons",
  },
];
