import React, { useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { getShopifyProductByHandle, createCheckoutUrl } from "@/lib/shopify";
import { getProductReviews } from "@/lib/api/reviews.functions";
import { useCart } from "@/context/cart-context";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { RouteLoadError } from "@/components/umberlla/route-error";
import { StructuredData } from "@/components/StructuredData";
import { canonical, metaDescription, pageMeta, productJsonLd } from "@/lib/seo";
import {
  BrandBand,
  BuyPanelCard,
  OptionSwatches,
  PriceRow,
  ProductGallery,
  ProductReviews,
  ProductSpecs,
  QuantityStepper,
  RatingSummary,
  SectionHeading,
  StickyBuyBar,
  TrustRow,
  useScrolledPast,
} from "@/components/umberlla/product-detail";
import { CaretLeft, ShoppingBag } from "@phosphor-icons/react";

const FALLBACK_IMAGE = "/assets/sun/prod-walkingstick.png";

export const Route = createFileRoute("/products/$handle")({
  loader: async ({ params }) => {
    const product = await getShopifyProductByHandle(params.handle);
    if (!product) {
      // notFound() rather than a plain throw: an unknown handle must answer 404,
      // not 500, or crawlers treat a delisted product as a broken server.
      throw notFound();
    }
    // Reviews come from Judge.me and are optional — getProductReviews already
    // swallows its own failures and returns [], so it can't fail the route.
    const reviews = await getProductReviews({ data: { handle: params.handle, perPage: 8 } });
    return { product, reviews };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) return {};
    return {
      meta: pageMeta({
        title: product.title,
        description: metaDescription(
          product.description || `${product.title} from Sun Umbrella. ${product.price}.`,
        ),
        image: product.images[0]?.url,
        type: "product",
      }),
      links: [canonical(`/products/${product.handle}`)],
    };
  },
  component: ProductDetailRoute,
  notFoundComponent: ProductNotFound,
  errorComponent: () => <RouteLoadError title="Couldn't load this umbrella" />,
});

function ProductNotFound() {
  return (
    <div className="u-page u-light">
      <SiteNav />
      <main
        className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center"
        style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}
      >
        <h1 className="u-fun-head text-4xl md:text-6xl" style={{ color: "var(--u-accent-text)" }}>
          Umbrella Not Found
        </h1>
        <p className="mt-4 max-w-[40ch] text-sm" style={{ color: "var(--u-muted)" }}>
          The product you are looking for might have been moved or is currently out of stock.
        </p>
        <Link
          to="/"
          className="u-mono mt-8 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
        >
          Back to Store
        </Link>
      </main>
      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}

function ProductDetailRoute() {
  const { product, reviews } = Route.useLoaderData();
  const { addToCart } = useCart();

  // Option values drive the selection; the variant is derived from them, so a
  // multi-option product can't land on a variant that doesn't exist.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (product.variants[0]?.selectedOptions ?? []).map((option) => [option.name, option.value])
    )
  );
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInstantBuying, setIsInstantBuying] = useState(false);

  const ctaRef = useRef<HTMLDivElement>(null);
  const showStickyBar = useScrolledPast(ctaRef);

  const selectedVariant = useMemo(() => {
    const match = product.variants.find((variant) =>
      variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
    );
    return match ?? product.variants[0] ?? null;
  }, [product.variants, selectedOptions]);

  // An explicit thumbnail click wins; otherwise follow the selected variant.
  const activeImage =
    pickedImage ?? selectedVariant?.image ?? product.images[0]?.url ?? FALLBACK_IMAGE;

  // Every price-related figure comes from the same variant, so a colour that
  // costs more can't show the cheapest colour's badge next to its own price.
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayOriginalPrice = selectedVariant?.originalPrice ?? product.originalPrice;
  const displayDiscount = selectedVariant ? selectedVariant.discount : product.discount;
  const displaySavings = selectedVariant ? selectedVariant.savings : product.savings;
  const isSoldOut = !product.availableForSale || !selectedVariant?.availableForSale;

  const handleSelectOption = (name: string, value: string) => {
    setSelectedOptions((current) => ({ ...current, [name]: value }));
    setPickedImage(null);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(
      {
        id: selectedVariant.id,
        title:
          selectedVariant.title && selectedVariant.title !== "Default Title"
            ? `${product.title} (${selectedVariant.title})`
            : product.title,
        handle: product.handle,
        price: selectedVariant.price,
        priceNumeric: selectedVariant.priceNumeric,
        image: activeImage,
      },
      quantity
    );
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    setIsInstantBuying(true);
    try {
      window.location.href = await createCheckoutUrl(selectedVariant.id, quantity);
    } catch (e) {
      // Used to fail silently: the spinner stopped and the button just looked
      // broken, with nothing to tell the customer what happened.
      console.error("Instant checkout failed:", e);
      toast.error("We couldn't start checkout", {
        description:
          e instanceof Error && e.message
            ? e.message
            : "Please try again in a moment, or add the item to your cart.",
      });
      setIsInstantBuying(false);
    }
  };

  return (
    <div className="u-page u-light" style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}>
      <StructuredData json={productJsonLd(product)} />
      <SiteNav />

      <main className="mx-auto max-w-[1200px] px-5 py-24 md:px-8 md:py-32">
        <Link
          to="/"
          className="u-mono mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] transition-opacity hover:opacity-70"
          style={{ color: "var(--u-muted)" }}
        >
          <CaretLeft size={16} weight="bold" />
          Back to Collections
        </Link>

        {/* A <section> here so SiteNav resolves dark links over this light page. */}
        <section className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <ProductGallery
                images={product.images}
                title={product.title}
                activeUrl={activeImage}
                onSelect={setPickedImage}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <BuyPanelCard>
            <span
              className="u-mono self-start rounded px-2.5 py-1 uppercase tracking-[0.18em]"
              style={{
                fontSize: "11px",
                color: isSoldOut ? "var(--u-muted)" : "var(--u-accent-text)",
                border: `1px solid ${isSoldOut ? "var(--u-slate)" : "var(--u-accent-text)"}`,
              }}
            >
              {isSoldOut ? "Out of Stock" : "In Stock"}
            </span>

            <h1
              className="u-fun-head mt-4 text-3xl leading-[1.05] md:text-5xl"
              style={{ color: "var(--u-bone)" }}
            >
              {product.title}
            </h1>

            {product.rating && <RatingSummary rating={product.rating} />}

            <PriceRow
              price={displayPrice}
              originalPrice={displayOriginalPrice}
              discount={displayDiscount}
              savings={displaySavings}
            />

            <OptionSwatches
              options={product.options}
              selected={selectedOptions}
              onSelect={handleSelectOption}
            />

            <div className="mt-8 space-y-2.5">
              <span className="u-mono text-xs uppercase tracking-[0.14em]" style={{ color: "var(--u-muted)" }}>
                Quantity
              </span>
              <QuantityStepper quantity={quantity} onChange={setQuantity} />
            </div>

            <div ref={ctaRef} className="mt-10 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isSoldOut}
                className="u-mono flex cursor-pointer items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ border: "1px solid var(--u-slate)", color: "var(--u-bone)" }}
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isSoldOut || isInstantBuying}
                className="u-mono flex cursor-pointer items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all hover:opacity-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
              >
                {isInstantBuying ? "Processing…" : "Buy It Now"}
              </button>
            </div>

            <TrustRow />
            </BuyPanelCard>
          </div>
        </section>

        <ProductSpecs specs={product.specs} />

        {product.descriptionHtml && (
          <section className="mt-24 md:mt-32">
            <SectionHeading index="02" title="Product Details" />
            <div
              className="prose prose-invert mt-8 max-w-[68ch] text-sm leading-[1.85]"
              style={{ color: "var(--u-bone)" }}
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          </section>
        )}

        <ProductReviews rating={product.rating} reviews={reviews} />
      </main>

      <BrandBand />

      <StickyBuyBar
        visible={showStickyBar && !isSoldOut}
        image={activeImage}
        title={product.title}
        price={displayPrice}
        originalPrice={displayOriginalPrice}
        disabled={isSoldOut}
        onAddToCart={handleAddToCart}
      />

      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}
