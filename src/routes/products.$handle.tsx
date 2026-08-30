import React, { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { getShopifyProductByHandle, createCheckoutUrl } from "@/lib/shopify";
import { useCart } from "@/context/cart-context";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { ArrowLeft, Minus, Plus, ShoppingBag, CaretLeft } from "@phosphor-icons/react";

export const Route = createFileRoute("/products/$handle")({
  loader: async ({ params }) => {
    try {
      const product = await getShopifyProductByHandle(params.handle);
      if (!product) {
        throw new Error("Product not found");
      }
      return { product };
    } catch (e) {
      console.error("Failed to load product in loader:", e);
      throw e;
    }
  },
  component: ProductDetailRoute,
  errorComponent: ProductNotFoundError,
});

function ProductNotFoundError() {
  return (
    <div className="u-page">
      <SiteNav />
      <main
        className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center"
        style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}
      >
        <h1 className="u-fun-head text-4xl md:text-6xl" style={{ color: "var(--u-yellow)" }}>
          Umbrella Not Found
        </h1>
        <p className="mt-4 max-w-[40ch] text-sm" style={{ color: "var(--u-muted)" }}>
          The product you are looking for might have been moved or is currently out of stock.
        </p>
        <Link
          to="/"
          className="mt-8 u-mono rounded-full px-6 py-3 text-xs uppercase tracking-widest font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-navy)" }}
        >
          Back to Store
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductDetailRoute() {
  const { product } = Route.useLoaderData();
  const { addToCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] || null);
  const [activeImage, setActiveImage] = useState(product.images[0]?.url || "/assets/sun/prod-walkingstick.png");
  const [quantity, setQuantity] = useState(1);
  const [isInstantBuying, setIsInstantBuying] = useState(false);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(
      {
        id: selectedVariant.id,
        title: `${product.title} ${selectedVariant.title !== "Default Title" ? `(${selectedVariant.title})` : ""}`,
        handle: product.handle,
        price: selectedVariant.price,
        priceNumeric: selectedVariant.priceNumeric,
        image: product.images[0]?.url || "/assets/sun/prod-walkingstick.png",
      },
      quantity
    );
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setIsInstantBuying(true);
    try {
      const checkoutUrl = await createCheckoutUrl(selectedVariant.id, quantity);
      window.location.href = checkoutUrl;
    } catch (e) {
      console.error("Instant checkout failed:", e);
      alert("Failed to proceed to checkout. Please try again.");
      setIsInstantBuying(false);
    }
  };

  return (
    <div className="u-page" style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}>
      <SiteNav />

      {/* Main product box */}
      <main className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-36">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 u-mono text-xs uppercase tracking-[0.14em] transition-colors mb-8 hover:opacity-80"
          style={{ color: "var(--u-muted)" }}
        >
          <CaretLeft size={16} weight="bold" />
          Back to Collections
        </Link>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Images Section */}
          <div className="lg:col-span-7 space-y-4">
            {/* Active Display Image */}
            <div
              className="aspect-[4/5] w-full overflow-hidden rounded-2xl border bg-white p-6 flex items-center justify-center"
              style={{ borderColor: "var(--u-slate)" }}
            >
              <img
                src={activeImage}
                alt={product.title}
                className="h-full max-h-[500px] w-full object-contain"
              />
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex flex-wrap gap-3">
                {product.images.map((img) => (
                  <button
                    key={img.url}
                    onClick={() => setActiveImage(img.url)}
                    className="h-20 w-20 overflow-hidden rounded-xl border-2 bg-white p-2 flex items-center justify-center transition-colors cursor-pointer"
                    style={{
                      borderColor: activeImage === img.url ? "var(--u-yellow)" : "var(--u-slate)",
                    }}
                  >
                    <img src={img.url} alt={img.altText} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span
              className="u-mono uppercase tracking-[0.18em] rounded px-2.5 py-1 self-start"
              style={{
                fontSize: "11px",
                color: "var(--u-yellow)",
                border: "1px solid var(--u-yellow)",
                background: "transparent",
              }}
            >
              {product.availableForSale ? "In Stock" : "Out of Stock"}
            </span>

            <h1 className="u-fun-head text-3xl md:text-5xl mt-4 leading-none" style={{ color: "var(--u-bone)" }}>
              {product.title}
            </h1>

            {/* Price display */}
            <div className="mt-6 flex items-baseline gap-4 border-b pb-6" style={{ borderBottomColor: "var(--u-slate)" }}>
              <span className="u-mono text-2xl font-bold" style={{ color: "var(--u-yellow)" }}>
                {selectedVariant ? selectedVariant.price : product.price}
              </span>
              {product.originalPrice && (
                <span className="u-mono text-base line-through" style={{ color: "var(--u-muted)" }}>
                  {product.originalPrice}
                </span>
              )}
              {product.discount && (
                <span className="u-mono text-xs font-bold text-red-500 border border-red-500/35 px-2 py-0.5 rounded">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Variants Selector */}
            {product.variants.length > 1 && (
              <div className="mt-6 space-y-3">
                <span className="u-mono text-xs uppercase tracking-wider" style={{ color: "var(--u-muted)" }}>Select Options:</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                      }}
                      className="u-mono px-4 py-2 text-xs border rounded-full transition-all cursor-pointer"
                      style={
                        selectedVariant?.id === v.id
                          ? {
                              backgroundColor: "var(--u-yellow)",
                              color: "var(--u-navy)",
                              borderColor: "var(--u-yellow)",
                              fontWeight: "600",
                            }
                          : { borderColor: "var(--u-slate)", color: "var(--u-bone)" }
                      }
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-8 space-y-3">
              <span className="u-mono text-xs uppercase tracking-wider" style={{ color: "var(--u-muted)" }}>Quantity:</span>
              <div className="flex items-center rounded-full border bg-black/25 px-2.5 py-1 w-fit" style={{ borderColor: "var(--u-slate)" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 hover:opacity-80 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} weight="bold" />
                </button>
                <span className="u-mono px-6 text-sm font-semibold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1 hover:opacity-80 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} weight="bold" />
                </button>
              </div>
            </div>

            {/* Checkout buttons */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.availableForSale}
                className="flex items-center justify-center gap-2 u-mono rounded-full border py-4 text-xs uppercase tracking-widest font-bold transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ borderColor: "var(--u-slate)", color: "var(--u-bone)" }}
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.availableForSale || isInstantBuying}
                className="flex items-center justify-center gap-2 u-mono rounded-full py-4 text-xs uppercase tracking-widest font-bold transition-all hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-navy)" }}
              >
                {isInstantBuying ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      style={{ color: "var(--u-navy)" }}
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Buy It Now"
                )}
              </button>
            </div>

            {/* Description Section */}
            {product.descriptionHtml && (
              <div className="mt-12 border-t pt-8" style={{ borderTopColor: "var(--u-slate)" }}>
                <h3 className="u-mono text-xs uppercase tracking-wider mb-4" style={{ color: "var(--u-muted)" }}>Product Details</h3>
                <div
                  className="prose prose-invert max-w-none text-sm leading-relaxed space-y-4"
                  style={{ color: "var(--u-bone)" }}
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
