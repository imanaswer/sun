# UMBERLLA — design brief

## Design read
For city people who treat rain as a fact of life, not a problem: UMBERLLA makes
umbrellas that survive a real storm, and the site should feel like standing dry
inside one while the weather works on the outside.

## Concept spine
The site is a storm you walk into and come out of dry. Everything opens: the
scroll opens the canopy, the chapters open the product, the closing section
hands the visitor the handle.

## Delivery tier
cinema. Lenis + GSAP for surrounding motion, the scroll-scrub film as the
Tier-1 mechanic, chapter-driven page structure.

## Locked palette
- Storm navy ground `#101B33` (page ground, film background)
- Deep well `#0B1324` (footer / dense bands)
- Cool slate `#2C3A56` (borders, mid tones)
- Bone `#F3EFE4` (ink on dark)
- Rain-slicker yellow `#F2C230` (the single accent, page-wide)

Defense: yellow slicker on wet navy is the actual colour memory of rain gear,
it reads instantly at product scale, and it is neither a graphite/ember, neon,
beige/brass, nor violet family. One accent only.

## Locked type
`Outfit` display + `IBM Plex Mono` for specs and small labels. No serif: this
is a technical goods brand, not an editorial house.

## Animation mode
Animation mode: animated-website
Journey shape: `single-shot`. ONE continuous ~15s film of one umbrella opening
in a dark rain studio, generated once and cut into three consecutive seam-true
segments so the page carries three chapters over one unbroken camera move. No
separate worlds are needed: the whole story is one object seen ever closer, so
`multi-leg` would cost minutes and buy nothing.

Journey (3 chapters over the one move):
1. `Closed` — focal point: the closed umbrella upright in the rain void.
   Headline about weather arriving. Tags: wind rating, canopy span.
2. `Opening` — focal point: the canopy unfolding mid-orbit, water flicking off.
   Headline about the mechanism. Tags: ribs, one-hand release.
3. `Dry` — focal point: macro of the canopy edge and yellow underside.
   Headline about staying dry. Tag: warranty.

World grammar: one dark rain studio, single top-left key light, locked
exposure, no cuts, slow constant camera speed, subject centred with clean
negative space, palette exactly as locked above, no on-screen text.

Mobile framing: shipped by default. The umbrella stays inside the centre-safe
area at every moment of the move, so the 9:16 crop never loses the canopy;
mobile clips are encoded lighter (720p cap).

How the journey enacts the spine: the scroll literally opens the umbrella. The
visitor performs the brand promise before reading a single spec.

Delivery budget: <= 32 MiB desktop clips total, <= 16 MiB mobile clips total.

## Section plan (one layout family each, no consecutive repeats)
1. Fixed nav (wordmark + 3 chapter links + one CTA) — chrome
2. Journey: 3 scroll-scrub chapters over the film — full-bleed media journey
3. Collection: 3 products as an asymmetric offset grid (not equal cards)
4. Storm test: spec table with mono figures, divided rows
5. Build: split material story, one image + measured copy
6. Cities: horizontal marquee of rain cities with rainfall figures
7. Care: icon row from the generated set, divided
8. Closer: full-width handle-over CTA band
9. Footer: giant wordmark + columns

Eyebrow budget: 3 (9 sections). Used on Collection, Storm test, Build only.

## Asset plan (all Higgsfield generated)
- Storyboard sheet (6 keyframes of the single move) — pins the film's look
- The film: 15s 1080p single take, cut into 3 desktop + 3 mobile encodes with
  exact-first-frame posters
- 3 product photographs (long crook, compact folding, storm double-canopy)
- 9-glyph icon sheet, sliced and background-removed
- Monogram mark (canopy reading as U) for nav and the favicon/head kit
- Launch branding: cover, OG card, icon

## CTA inventory (bespoke chrome, one component each)
- `Shop the range` (nav) — bordered slab, fills with yellow from the left on
  hover, ink flips to navy
- `Open the story` (chapter 1) — yellow underline that draws across on hover,
  arrow slides
- `Find your size` (collection) — framed block with a corner tick that rotates
- `Get one` (closer) — solid yellow monolith, presses down 1px on active
Labels are one per intent, reused nowhere else.
