/**
 * Per-page title, description, canonical and Open Graph tags.
 *
 * Every route used to inherit the single `head:` in __root, so the sitemap
 * advertised the whole catalog to Google under one title, one description and
 * no canonical. These builders give each page its own.
 */

const SITE_NAME = "Sun Umbrella";

/** Production origin. Canonical URLs must point at the real domain, never at
 *  whichever preview host happened to render the page. */
export const SITE_ORIGIN = "https://sunumbrella.in";

export function canonical(path: string) {
  return { rel: "canonical", href: new URL(path, SITE_ORIGIN).toString() };
}

/** Trim to a length search engines actually display, breaking on a word. */
export function metaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function pageMeta({
  title,
  description,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "product";
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
    ...(image
      ? [
          { property: "og:image", content: image },
          { name: "twitter:image", content: image },
        ]
      : []),
  ];
}

/** Google reads availability as a schema.org URL, not a boolean. */
function availability(inStock: boolean) {
  return inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
}

export function productJsonLd(product: {
  title: string;
  handle: string;
  description: string;
  priceNumeric: number;
  currencyCode?: string;
  availableForSale: boolean;
  images: Array<{ url: string }>;
  rating?: { value: number; count: number };
}) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: metaDescription(product.description, 300),
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: `${SITE_ORIGIN}/products/${product.handle}`,
      price: product.priceNumeric.toFixed(2),
      priceCurrency: product.currencyCode ?? "INR",
      availability: availability(product.availableForSale),
    },
    // Omitted entirely when absent — an AggregateRating with no reviews behind
    // it is exactly the kind of thing Google penalises.
    ...(product.rating && product.rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating.value,
            reviewCount: product.rating.count,
          },
        }
      : {}),
  });
}

export function organizationJsonLd(
  stores: Array<{ city: string; address: string; phones: string[] }>,
) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_ORIGIN,
    foundingDate: "1889",
    logo: `${SITE_ORIGIN}/assets/sun/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: stores[0]?.phones[0],
      contactType: "customer service",
      areaServed: "IN",
    },
    location: stores.map((s) => ({
      "@type": "Place",
      name: `${SITE_NAME} — ${s.city}`,
      address: { "@type": "PostalAddress", streetAddress: s.address, addressCountry: "IN" },
      telephone: s.phones[0],
    })),
  });
}
