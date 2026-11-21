import { describe, expect, test } from "bun:test";
import { colourOptionName, computeDiscount, formatDimension, galleryForColour, imageColour, imageVariantLabels, inStockOptions, parseRatingValue } from "../src/lib/shopify";

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

describe("inStockOptions", () => {
  const options = [{ name: "Color", values: ["Blue", "Maroon", "Green"] }];
  const variant = (value: string, availableForSale: boolean) => ({
    availableForSale,
    selectedOptions: [{ name: "Color", value }],
  });

  test("keeps only the values that some purchasable variant carries", () => {
    const variants = [variant("Blue", false), variant("Maroon", true), variant("Green", true)];
    expect(inStockOptions(options, variants)).toEqual([{ name: "Color", values: ["Maroon", "Green"] }]);
  });

  test("drops an option group entirely when every value is sold out", () => {
    const variants = [variant("Blue", false), variant("Maroon", false)];
    expect(inStockOptions(options, variants)).toEqual([]);
  });
});

describe("imageVariantLabels", () => {
  const cdn = "https://cdn.shopify.com/files/";
  test("labels own photos, and a shared photo only with the colour its filename names", () => {
    const labels = imageVariantLabels([
      { title: "Blue", image: `${cdn}Z_series_Maroon_3.jpg?v=1` },
      { title: "Maroon", image: `${cdn}Z_series_Maroon_3.jpg?v=1` },
      { title: "Royal Blue", image: `${cdn}Z_series_Royal_Blue_3_94f2.jpg?v=1` },
      { title: "Dark Purple", image: `${cdn}Z_series_Purple_3.jpg` },
    ]);
    expect(labels).toEqual({
      [`${cdn}Z_series_Maroon_3.jpg`]: "Maroon",
      [`${cdn}Z_series_Royal_Blue_3_94f2.jpg`]: "Royal Blue",
      [`${cdn}Z_series_Purple_3.jpg`]: "Dark Purple",
    });
  });

  test("leaves a shared photo unlabelled when no filename match", () => {
    expect(imageVariantLabels([{ title: "Blue", image: `${cdn}a.jpg` }, { title: "Pink", image: `${cdn}a.jpg` }])).toEqual({});
  });
});

describe("colour galleries", () => {
  const colours = ["Blue", "Royal Blue", "Red"];
  const img = (url: string, altText: string) => ({ url, altText });
  const images = [
    img("main.jpg", "Umbrella"),
    img("red-1.jpg", "Red"),
    img("blue-1.jpg", "blue umbrella, open"),
    img("royal-1.jpg", "Royal Blue side view"),
    img("red-2.jpg", "Red folded"),
  ];

  test("finds the colour option by name", () => {
    expect(colourOptionName([{ name: "Size" }, { name: "Colour" }])).toBe("Colour");
    expect(colourOptionName([{ name: "Size" }])).toBeUndefined();
  });

  test("longest colour in the alt text wins", () => {
    expect(imageColour("Royal Blue side view", colours)).toBe("Royal Blue");
    expect(imageColour("blue umbrella, open", colours)).toBe("Blue");
    expect(imageColour("Reddish", colours)).toBeUndefined();
  });

  test("shows only the selected colour's photos, variant photo first", () => {
    expect(galleryForColour(images, colours, "Red", "red-2.jpg?v=1", "Umbrella").map((i) => i.url)).toEqual([
      "red-2.jpg",
      "red-1.jpg",
    ]);
  });

  test("falls back to every photo when the colour has none tagged", () => {
    expect(galleryForColour(images, [...colours, "Green"], "Green", undefined, "Umbrella")).toEqual(images);
  });

  test("ignores alt text that is just the product title", () => {
    const titled = [img("a.jpg", "Red Umbrella"), img("b.jpg", "Red Umbrella")];
    expect(galleryForColour(titled, colours, "Blue", undefined, "Red Umbrella")).toEqual(titled);
  });
});
