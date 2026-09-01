import { expect, test } from "bun:test";
import { bgLuminance } from "../src/components/umberlla/sections";

/** Stands in for a DOM node with a resolved backgroundColor. */
const node = (backgroundColor: string, parentElement: any = null) =>
  ({ backgroundColor, parentElement }) as unknown as Element;

const g = globalThis as any;
g.getComputedStyle = (el: any) => el;

const THRESHOLD = 0.55;

test("site palette lands on the right side of the nav threshold", () => {
  // Navy page ground and the reviews section: links must stay light.
  expect(bgLuminance(node("rgb(16, 27, 51)"))).toBeLessThan(THRESHOLD);
  expect(bgLuminance(node("rgb(11, 19, 36)"))).toBeLessThan(THRESHOLD);
  // Yellow, bone and the white storefront: links must go dark ink.
  expect(bgLuminance(node("rgb(242, 194, 48)"))).toBeGreaterThan(THRESHOLD);
  expect(bgLuminance(node("rgb(243, 239, 228)"))).toBeGreaterThan(THRESHOLD);
  expect(bgLuminance(node("rgb(255, 255, 255)"))).toBeGreaterThan(THRESHOLD);
});

test("a transparent section inherits the nearest painted ancestor", () => {
  const page = node("rgb(255, 255, 255)");
  expect(bgLuminance(node("rgba(0, 0, 0, 0)", page))).toBeGreaterThan(THRESHOLD);
  // Nothing painted anywhere falls back to dark, matching the navy page ground.
  expect(bgLuminance(node("rgba(0, 0, 0, 0)"))).toBe(0);
});
