import { createFileRoute } from "@tanstack/react-router";
import { getAllProductHandles, getShopifyCollections } from "@/lib/shopify";

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const today = new Date().toISOString().split("T")[0];

        // Every product has its own page, so every product belongs in here —
        // an unlisted page exists but no crawler ever hears about it.
        let products: Array<{ handle: string; updatedAt: string }> = [];
        try {
          products = await getAllProductHandles();
        } catch (e) {
          // A Shopify outage must not turn the sitemap into a 500; serving the
          // home entry alone is better than serving nothing.
          console.error("Sitemap: failed to list products:", e);
        }

        // Collections are the browse entry points, so they belong in here too.
        let collections: Array<{ handle: string }> = [];
        try {
          collections = await getShopifyCollections(50);
        } catch (e) {
          console.error("Sitemap: failed to list collections:", e);
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          urlEntry(`${origin}/`, today, "weekly", "1.0"),
          urlEntry(`${origin}/collections/all`, today, "weekly", "0.9"),
          ...collections.map((collection) =>
            urlEntry(`${origin}/collections/${encodeURIComponent(collection.handle)}`, today, "weekly", "0.7"),
          ),
          ...products.map((product) =>
            urlEntry(
              `${origin}/products/${encodeURIComponent(product.handle)}`,
              (product.updatedAt || today).split("T")[0],
              "weekly",
              "0.8",
            ),
          ),
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
