import { expect, test } from "bun:test";
import { pickRelated, type ProductSpec, type ShopifyProduct } from "../src/lib/shopify";

const spec = (key: string, value: string): ProductSpec => ({ key, label: key, value });

function card(handle: string, specs: ProductSpec[]): ShopifyProduct {
  return {
    id: `gid://${handle}`,
    title: handle,
    handle,
    description: "",
    availableForSale: true,
    price: "₹1,000.00",
    priceNumeric: 1000,
    currencyCode: "INR",
    image: "",
    imageAlt: handle,
    href: `/products/${handle}`,
    specs,
  };
}

const current = {
  handle: "current",
  specs: [spec("open_diameter", "110 cm"), spec("frame_material", "Fibreglass")],
};

const catalogue = [
  card("both", [spec("open_diameter", "110 cm"), spec("frame_material", "Fibreglass")]),
  card("frame-only", [spec("open_diameter", "90 cm"), spec("frame_material", "Fibreglass")]),
  card("neither", [spec("open_diameter", "90 cm"), spec("frame_material", "Steel")]),
  card("current", current.specs),
];

test("keeps only umbrellas sharing a diameter or frame, best match first", () => {
  expect(pickRelated(current, catalogue).map((p) => p.handle)).toEqual(["both", "frame-only"]);
});

test("a product with neither parameter relates to nothing", () => {
  expect(pickRelated({ handle: "current", specs: [] }, catalogue)).toEqual([]);
  // A spec outside the two matched parameters is not a relation either.
  expect(pickRelated({ handle: "current", specs: [spec("weight", "390g")] }, catalogue)).toEqual([]);
});

test("respects the limit", () => {
  expect(pickRelated(current, catalogue, 1).map((p) => p.handle)).toEqual(["both"]);
});
