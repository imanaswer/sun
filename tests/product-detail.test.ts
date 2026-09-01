import { describe, expect, test } from "bun:test";
import { computeDiscount, formatDimension, parseRatingValue } from "../src/lib/shopify";

// The product page renders these three straight into the buy panel, so a bad
// parse shows a wrong price or a wrong spec on a live storefront.

describe("formatDimension", () => {
  test("renders a Shopify weight metafield", () => {
    expect(formatDimension('{"value":390.0,"unit":"GRAMS"}')).toBe("390 g");
    expect(formatDimension('{"value":1.2,"unit":"KILOGRAMS"}')).toBe("1.2 kg");
  });

  test("passes an implausible catalog value through rather than inventing one", () => {
    // arnold-27 really does carry 0.625 GRAMS — a data-entry slip in Shopify.
    expect(formatDimension('{"value":0.625,"unit":"GRAMS"}')).toBe("0.625 g");
  });

  test("falls back to the raw string on unknown units or non-JSON", () => {
    expect(formatDimension('{"value":7,"unit":"STONES"}')).toBe("7 stones");
    expect(formatDimension("36 inches")).toBe("36 inches");
    expect(formatDimension('{"unit":"GRAMS"}')).toBe('{"unit":"GRAMS"}');
  });
});

describe("parseRatingValue", () => {
  test("reads the nested string value Shopify sends", () => {
    expect(parseRatingValue('{"scale_min":"1.0","scale_max":"5.0","value":"4.52"}')).toBe(4.52);
  });

  test("accepts a numeric value too", () => {
    expect(parseRatingValue('{"value":4}')).toBe(4);
  });

  test("returns null rather than NaN when it can't parse", () => {
    expect(parseRatingValue("4.5")).toBeNull();
    expect(parseRatingValue('{"value":"not-a-number"}')).toBeNull();
    expect(parseRatingValue("")).toBeNull();
  });
});

describe("computeDiscount", () => {
  test("matches the live storefront figures for Shine", () => {
    expect(computeDiscount(455, 749, "INR")).toEqual({
      discount: "39% OFF",
      savings: "₹294.00",
    });
  });

  test("stays empty when there is nothing to discount", () => {
    expect(computeDiscount(455, null, "INR")).toEqual({});
    expect(computeDiscount(455, 455, "INR")).toEqual({});
    // A compareAt below the price would otherwise render a negative "saving".
    expect(computeDiscount(455, 300, "INR")).toEqual({});
  });

  test("drops a badge that rounds to zero but keeps the real saving", () => {
    expect(computeDiscount(999, 1000, "INR")).toEqual({
      discount: undefined,
      savings: "₹1.00",
    });
  });
});
