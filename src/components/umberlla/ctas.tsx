/**
 * Sun Umbrella bespoke chrome. There is deliberately no shared button
 * component. Three sibling CTAs lived here and were never rendered; they went
 * with the /app scaffolding route.
 */

/** Chapter link: the yellow rule draws across, the arrow slides. */
export function OpenTheStory() {
  return (
    <a href="#collections" className="u-btn-primary inline-flex items-center gap-2 group">
      Open the story
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        &rarr;
      </span>
    </a>
  );
}
