import { createFileRoute, notFound } from "@tanstack/react-router";
import { getShopifyCollectionByHandle, getShopifyProducts } from "@/lib/shopify";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import {
  CollectionHeader,
  CollectionNotFound,
  ProductGrid,
} from "@/components/umberlla/collection";

// The largest collection in the store holds 25 products; ask for well past that
// so a category never silently shows a truncated set.
const PRODUCTS_PER_COLLECTION = 250;

export const Route = createFileRoute("/collections/$handle")({
  loader: async ({ params }) => {
    // "all" is the handle Shopify themes use for the whole catalog, and the
    // site's "Shop all umbrellas" buttons point at it — but it is not a real
    // collection in the Storefront API, so build it from the product list.
    if (params.handle === "all") {
      const products = await getShopifyProducts({ first: PRODUCTS_PER_COLLECTION });
      return {
        collection: {
          id: "all",
          title: "All Umbrellas",
          description: "Every Sun Umbrella currently in stock.",
          products,
        },
      };
    }

    const collection = await getShopifyCollectionByHandle(params.handle, PRODUCTS_PER_COLLECTION);
    if (!collection) {
      // notFound() rather than a plain throw: an unknown handle must answer 404,
      // not 500, or crawlers treat a dead category as a broken server.
      throw notFound();
    }
    return { collection };
  },
  component: CollectionRoute,
  notFoundComponent: CollectionErrorRoute,
  errorComponent: CollectionErrorRoute,
});

function CollectionErrorRoute() {
  return (
    <div className="u-page u-light">
      <SiteNav />
      <CollectionNotFound />
      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}

function CollectionRoute() {
  const { collection } = Route.useLoaderData();

  return (
    <div className="u-page u-light" style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}>
      <SiteNav />

      <main className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-32">
        {/* A <section> here so SiteNav resolves dark links over this light page. */}
        <section>
        <CollectionHeader
          title={collection.title}
          description={collection.description}
          count={collection.products.length}
        />
        <ProductGrid products={collection.products} />
        </section>
      </main>

      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}
