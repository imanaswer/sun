import { expect, test } from "bun:test";
import { computeDiscount, formatPrice } from "../src/lib/shopify";

// formatPrice renders every price on the site and had no coverage at all.
test("formats INR with the rupee glyph and Indian digit grouping", () => {
  expect(formatPrice(455)).toBe("₹455.00");
  expect(formatPrice("1299.00")).toBe("₹1,299.00");
  // Indian grouping is 1,29,900 — not the 129,900 en-US would produce.
  expect(formatPrice(129900)).toBe("₹1,29,900.00");
  expect(formatPrice(0)).toBe("₹0.00");
});

test("a non-numeric price never renders as a plausible number", () => {
  expect(formatPrice("not-a-price")).toBe("₹0.00");
  expect(formatPrice(Number.NaN)).toBe("₹0.00");
});

test("non-INR currencies keep their own symbol", () => {
  expect(formatPrice(20, "USD")).toBe("$20.00");
});

// The card paths used to inline their own copy of this arithmetic, which meant
// they could never show `savings` and could report a percentage belonging to no
// real variant. All four call sites route through here now.
test("discount is derived from compare-at price, or absent", () => {
  expect(computeDiscount(455, 749, "INR")).toEqual({
    discount: "39% OFF",
    savings: "₹294.00",
  });
  expect(computeDiscount(455, null, "INR")).toEqual({});
  expect(computeDiscount(455, 455, "INR")).toEqual({});
  // A compare-at below the price is bad merchant data, not a negative discount.
  expect(computeDiscount(455, 300, "INR")).toEqual({});
});
