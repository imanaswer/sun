import { createFileRoute, Link } from "@tanstack/react-router";
import { getShopifyCollections } from "@/lib/shopify";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { COLLECTIONS } from "@/sun-data";
import { canonical, pageMeta } from "@/lib/seo";
import { CollectionPending } from "@/components/umberlla/route-pending";

// Shopify serves /collections on the old storefront, so bookmarks and indexed
// results for that URL survive the domain move instead of hitting a 404.
export const Route = createFileRoute("/collections/")({
  loader: async () => ({
    collections: await getShopifyCollections(50).catch((error) => {
      console.warn("Shopify collections fetch failed, using static list:", error);
      return [];
    }),
  }),
  head: () => ({
    meta: pageMeta({
      title: "All collections",
      description:
        "Every Sun Umbrella category — non-fold, 2 fold, 3 fold, kids, golf and promotional umbrellas. UV protective, auto open & close, built for all weather.",
    }),
    links: [canonical("/collections")],
  }),
  pendingComponent: CollectionPending,
  component: CollectionsIndex,
});

function CollectionsIndex() {
  const { collections } = Route.useLoaderData();
  // Fall back to the curated list rather than an empty page if Shopify is down.
  const items =
    collections.length > 0
      ? collections.map((c) => ({ name: c.title, href: c.href, blurb: c.description }))
      : COLLECTIONS.map((c) => ({ name: c.name, href: c.href, blurb: c.blurb }));

  return (
    <div
      className="u-page u-light"
      style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}
    >
      <SiteNav />

      <main className="mx-auto max-w-[1200px] px-5 py-32 md:px-8">
        <h1 className="u-fun-head text-4xl md:text-6xl">All collections</h1>
        <p className="mt-4 max-w-[52ch] text-sm" style={{ color: "var(--u-muted)" }}>
          Every Sun Umbrella category — non-fold, 2 fold, 3 fold, kids, golf and
          promotional.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <Link
              key={c.href}
              to={c.href}
              className="group flex flex-col rounded-2xl border p-6 transition-colors"
              style={{ borderColor: "var(--u-slate)", background: "var(--u-card)" }}
            >
              <h2 className="text-lg font-medium">{c.name}</h2>
              {c.blurb && (
                <p className="mt-2 flex-1 text-sm" style={{ color: "var(--u-muted)" }}>
                  {c.blurb}
                </p>
              )}
              <span className="u-mono mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em]">
                Browse
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}
