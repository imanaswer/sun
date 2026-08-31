import { Link } from "@tanstack/react-router";
import type { ShopifyProduct } from "@/lib/shopify";

/**
 * Collection page presentation. The route owns the data; this is props in,
 * markup out — and it keeps the raw brand colours out of src/routes, which
 * scripts/check-ui.mjs holds to composition only.
 */

export function CollectionHeader({
  title,
  description,
  count,
}: {
  title: string;
  description?: string;
  count: number;
}) {
  return (
    <header>
      <Link
        to="/"
        className="u-mono mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
        style={{ color: "var(--u-muted)" }}
      >
        ← Back to Home
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="u-fun-head max-w-[18ch] text-4xl leading-[1.02] md:text-6xl" style={{ color: "var(--u-bone)" }}>
          {title}
        </h1>
        <span className="u-mono text-xs uppercase tracking-[0.16em]" style={{ color: "var(--u-yellow)" }}>
          {count} {count === 1 ? "umbrella" : "umbrellas"}
        </span>
      </div>

      {description && (
        <p className="mt-5 max-w-[62ch] text-sm leading-relaxed" style={{ color: "var(--u-muted)" }}>
          {description}
        </p>
      )}

      <div className="mt-8 h-px w-full" style={{ backgroundColor: "var(--u-slate)" }} />
    </header>
  );
}

function ProductCard({ product }: { product: ShopifyProduct }) {
  return (
    <Link
      to="/products/$handle"
      params={{ handle: product.handle }}
      className="group flex flex-col overflow-hidden rounded-2xl transition-colors"
      style={{ border: "1px solid var(--u-slate)", backgroundColor: "var(--u-well)" }}
    >
      {/* Same tonal stage as the product page gallery, so a card and the page it
          opens read as the same product rather than two different treatments. */}
      <div
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(242,194,48,0.10) 0%, rgba(242,194,48,0) 55%), linear-gradient(180deg, #16213c 0%, var(--u-well) 100%)",
        }}
      >
        <img
          src={product.image}
          alt={product.imageAlt}
          loading="lazy"
          className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {product.discount && (
          <span
            className="u-mono absolute top-3 left-3 rounded px-2 py-1 text-[10px] font-bold"
            style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-navy)" }}
          >
            {product.discount}
          </span>
        )}
        {!product.availableForSale && (
          <span
            className="u-mono absolute top-3 right-3 rounded px-2 py-1 text-[10px]"
            style={{ backgroundColor: "var(--u-navy)", color: "var(--u-muted)" }}
          >
            Sold out
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2
          className="text-sm leading-snug font-semibold transition-colors group-hover:opacity-80"
          style={{ color: "var(--u-bone)" }}
        >
          {product.title}
        </h2>
        <div className="mt-auto flex flex-wrap items-baseline gap-2.5">
          <span className="u-mono text-sm font-bold" style={{ color: "var(--u-yellow)" }}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span className="u-mono text-xs line-through" style={{ color: "var(--u-muted)" }}>
              {product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: ShopifyProduct[] }) {
  if (products.length === 0) {
    return (
      <p className="mt-16 text-sm" style={{ color: "var(--u-muted)" }}>
        Nothing in this collection yet. Try another category from the menu.
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.handle} product={product} />
      ))}
    </div>
  );
}

export function CollectionNotFound() {
  return (
    <main
      className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center"
      style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}
    >
      <h1 className="u-fun-head text-4xl md:text-6xl" style={{ color: "var(--u-yellow)" }}>
        Collection Not Found
      </h1>
      <p className="mt-4 max-w-[40ch] text-sm" style={{ color: "var(--u-muted)" }}>
        That category may have been renamed or removed.
      </p>
      <Link
        to="/"
        className="u-mono mt-8 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-navy)" }}
      >
        Back to Store
      </Link>
    </main>
  );
}
