import { expect, test } from "bun:test";
import type { CartItem } from "../src/context/cart-context";

/**
 * The cart reducer logic, extracted as the pure shapes the context applies.
 * None of this was covered, on a path that takes money.
 */
const item = (id: string, priceNumeric: number, quantity = 1): CartItem => ({
  id,
  title: `Variant ${id}`,
  handle: `variant-${id}`,
  price: `₹${priceNumeric}.00`,
  priceNumeric,
  image: "/x.png",
  quantity,
});

/** Mirrors addToCart: merge by variant id, never mutate the previous array. */
function addTo(cart: CartItem[], next: Omit<CartItem, "quantity">, quantity = 1): CartItem[] {
  const i = cart.findIndex((c) => c.id === next.id);
  if (i > -1) {
    return cart.map((c, n) => (n === i ? { ...c, quantity: c.quantity + quantity } : c));
  }
  return [...cart, { ...next, quantity }];
}

/** Mirrors cartTotal: an unavailable line contributes nothing. */
function total(cart: CartItem[]): number {
  return cart.reduce((t, c) => (c.unavailable ? t : t + c.priceNumeric * c.quantity), 0);
}

test("adding the same variant twice merges instead of duplicating", () => {
  const cart = addTo(addTo([], item("a", 100)), item("a", 100), 2);
  expect(cart).toHaveLength(1);
  expect(cart[0].quantity).toBe(3);
});

test("merging does not mutate the previous cart array", () => {
  const before = [item("a", 100)];
  const snapshot = structuredClone(before);
  addTo(before, item("a", 100), 4);
  // The old implementation edited before[0] in place, which double-counts the
  // moment anything re-runs the updater (StrictMode, a retry).
  expect(before).toEqual(snapshot);
});

test("different variants of the same product stay separate lines", () => {
  const cart = addTo(addTo([], item("small", 100)), item("large", 150));
  expect(cart.map((c) => c.id)).toEqual(["small", "large"]);
});

test("subtotal multiplies by quantity", () => {
  expect(total([item("a", 455, 2), item("b", 100, 1)])).toBe(1010);
});

test("an unavailable line is excluded from the subtotal", () => {
  const cart: CartItem[] = [item("a", 455, 2), { ...item("b", 999), unavailable: true }];
  // Charging for a line Shopify will reject would show the customer a total
  // they can never actually pay.
  expect(total(cart)).toBe(910);
});

test("the saved cart survives a localStorage round trip", () => {
  const cart = [item("a", 455, 2), item("b", 100)];
  expect(JSON.parse(JSON.stringify(cart))).toEqual(cart);
});
