/**
 * The journey scenes with chapter chrome attached. Module constant: built once
 * at module evaluation, so the scrub controller is never rebuilt.
 */
import type { ScrollScrubScene } from "@/components/scroll-scrub/scroll-scrub";
import { OpenTheStory } from "@/components/umberlla/ctas";
import { scrollScrubScenes } from "@/scroll-scrub-scenes";

export const journeyScenes: ScrollScrubScene[] = scrollScrubScenes.map(
  (scene, index) =>
    index === 0 ? { ...scene, actions: <OpenTheStory /> } : scene,
);
