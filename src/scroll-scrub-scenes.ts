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
    body: "Since 1889 Sun Umbrella has stood between India and the sky. Built to be already in your hand when the monsoon turns, and to open before you are wet.",
    clip: "/assets/world/scene-01.mp4",
    id: "scene-01",
    label: "Since 1889",
    mobileClip: "/assets/world/scene-01-mobile.mp4",
    mobileFrameCount: 151,
    mobileFrameOffset: 0,
    mobileFramePrefix: "/assets/world/scene-mobile/ezgif-frame-",
    mobileFrameSuffix: ".jpg",
    mobilePoster: "/assets/world/scene-01-mobile-poster.png",
    poster: "/assets/world/scene-01-poster.png",
    scroll: 1.6,
    tags: ["Est. 1889", "Sheltering India since 1889"],
    title: "Monsoon never\nlooked this good",
  },
  {
    body: "One touch lifts the ribs in a single push. Auto open-and-close, UV-protective, windproof — it opens with your thumb while your other hand keeps the bag, the phone, the child.",
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
    title: "One hand,\none second",
  },
  {
    body: "Rain leaves the canopy instead of soaking in, the frame springs back after a gust, and the sun never gets through. You arrive looking like the weather stayed outside.",
    clip: "/assets/world/scene-03.mp4",
    id: "scene-03",
    label: "All weather",
    mobileClip: "/assets/world/scene-03-mobile.mp4",
    mobileFrameCount: 150,
    mobileFrameOffset: 302,
    mobileFramePrefix: "/assets/world/scene-mobile/ezgif-frame-",
    mobileFrameSuffix: ".jpg",
    mobilePoster: "/assets/world/scene-03-mobile-poster.png",
    poster: "/assets/world/scene-03-poster.png",
    scroll: 1.6,
    tags: ["Designed for style", "Built for all weather"],
    title: "Designed for style",
  },
];
