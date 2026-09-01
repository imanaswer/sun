import { expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";

/**
 * The storefront used to hardcode two old domains — sunumbrella.in (the Shopify
 * online store) and www.sunumbrellas.in (an older site whose TLS certificate has
 * expired). They shipped in the server-rendered HTML, so crawlers and any tap
 * landing before hydration were sent off the site entirely.
 *
 * They came back more than once. This test is the guard.
 */
const SRC = new URL("../src", import.meta.url).pathname;

/** mailto:info@sunumbrellas.in is the business's real mailbox — Shopify's own
 *  policy copy uses it — so only navigable http(s) links are forbidden. */
const LEGACY_LINK = /https?:\/\/(www\.)?sunumbrellas?\.in/i;

/** Files that name the domain as a fact rather than link to it. */
const ALLOWED = new Set([
  // The regex that strips old-domain anchors out of Shopify's policy HTML.
  "routes/policies.$handle.tsx",
  // SITE_ORIGIN — where the site is *going*, used to build canonical URLs.
  "lib/seo.ts",
]);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return [".ts", ".tsx"].includes(extname(path)) ? [path] : [];
  });
}

test("no source file links to the old storefront domains", () => {
  const offenders = sourceFiles(SRC).filter((path) => {
    if (ALLOWED.has(path.slice(SRC.length + 1))) return false;
    return LEGACY_LINK.test(readFileSync(path, "utf8"));
  });

  expect(offenders.map((p) => p.slice(SRC.length + 1))).toEqual([]);
});
