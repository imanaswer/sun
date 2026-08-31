/**
 * Shopify Storefront API Client
 * Connects directly to Shopify Storefront GraphQL API to query products, collections,
 * and generate native checkout URLs.
 */

const SHOPIFY_STORE_DOMAIN =
  import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "k6grrg-1a.myshopify.com";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "8b1ff51bada35183b34138a4a8cded27";
const SHOPIFY_API_VERSION =
  import.meta.env.VITE_SHOPIFY_API_VERSION || "2024-07";

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  imageAlt: string;
  variantId?: string;
  href: string;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: string;
  href: string;
}

/**
 * Low-level GraphQL fetcher for Shopify Storefront API.
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API HTTP error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  if (json.errors?.length) {
    console.error("Shopify GraphQL errors:", json.errors);
    throw new Error(json.errors[0]?.message || "Shopify GraphQL error");
  }

  return json.data;
}

/**
 * Format currency amount into INR or appropriate currency string.
 */
export function formatPrice(amount: string | number, currencyCode: string = "INR"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return `Rs. 0.00`;
  
  if (currencyCode === "INR") {
    return `Rs. ${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(num);
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int = 20, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch live products list from Shopify.
 */
export async function getShopifyProducts(options: { first?: number; query?: string } = {}): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          description: string;
          availableForSale: boolean;
          priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
          compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
          images: { edges: Array<{ node: { url: string; altText: string | null } }> };
          variants: { edges: Array<{ node: { id: string; availableForSale: boolean } }> };
        };
      }>;
    };
  }>({
    query: PRODUCTS_QUERY,
    variables: { first: options.first ?? 12, query: options.query },
  });

  return data.products.edges.map(({ node }) => {
    const minPrice = parseFloat(node.priceRange.minVariantPrice.amount);
    const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
      : null;

    let discount: string | undefined;
    if (comparePrice && comparePrice > minPrice) {
      const discountPct = Math.round(((comparePrice - minPrice) / comparePrice) * 100);
      if (discountPct > 0) discount = `${discountPct}% OFF`;
    }

    const firstImage = node.images.edges[0]?.node;
    const firstVariant = node.variants.edges[0]?.node;

    return {
      id: node.id,
      title: node.title,
      handle: node.handle,
      description: node.description,
      availableForSale: node.availableForSale,
      price: formatPrice(minPrice, node.priceRange.minVariantPrice.currencyCode),
      originalPrice: comparePrice && comparePrice > minPrice
        ? formatPrice(comparePrice, node.compareAtPriceRange?.minVariantPrice.currencyCode)
        : undefined,
      discount,
      image: firstImage?.url || "/assets/sun/prod-walkingstick.png",
      imageAlt: firstImage?.altText || node.title,
      variantId: firstVariant?.id,
      href: `/products/${node.handle}`,
    };
  });
}

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int = 10) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

/**
 * Fetch live collection categories from Shopify.
 */
export async function getShopifyCollections(first: number = 8): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          description: string;
          image: { url: string; altText: string | null } | null;
        };
      }>;
    };
  }>({
    query: COLLECTIONS_QUERY,
    variables: { first },
  });

  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    image: node.image?.url,
    href: `https://sunumbrella.in/collections/${node.handle}`,
  }));
}

const CREATE_CART_MUTATION = `
  mutation CreateCart($merchandiseId: ID!, $quantity: Int = 1) {
    cartCreate(input: { lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }] }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

/**
 * Create a live cart in Shopify and return the native checkout redirect URL.
 */
export async function createCheckoutUrl(variantId: string, quantity: number = 1): Promise<string> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>({
    query: CREATE_CART_MUTATION,
    variables: { merchandiseId: variantId, quantity },
  });

  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const checkoutUrl = data.cartCreate.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("Unable to retrieve checkout URL from Shopify");
  }

  return checkoutUrl;
}

const CREATE_MULTI_CART_MUTATION = `
  mutation CreateMultiCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface CartLineItem {
  variantId: string;
  quantity: number;
}

/**
 * Create a live multi-item cart in Shopify and return the checkout redirect URL.
 */
export async function createCartCheckoutUrl(lines: CartLineItem[]): Promise<string> {
  const formattedLines = lines.map((item) => ({
    merchandiseId: item.variantId,
    quantity: item.quantity,
  }));

  const data = await shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>({
    query: CREATE_MULTI_CART_MUTATION,
    variables: { lines: formattedLines },
  });

  if (data.cartCreate.userErrors?.length) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }

  const checkoutUrl = data.cartCreate.cart?.checkoutUrl;
  if (!checkoutUrl) {
    throw new Error("Unable to retrieve checkout URL from Shopify");
  }

  return checkoutUrl;
}

export interface ProductSpec {
  key: string;
  label: string;
  value: string;
}

export interface ShopifyProductDetail {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  price: string;
  originalPrice?: string;
  discount?: string;
  savings?: string;
  priceNumeric: number;
  rating?: { value: number; count: number };
  specs: ProductSpec[];
  options: Array<{ name: string; values: string[] }>;
  images: Array<{ url: string; altText: string }>;
  variants: Array<{
    id: string;
    title: string;
    availableForSale: boolean;
    price: string;
    priceNumeric: number;
    originalPrice?: string;
    discount?: string;
    savings?: string;
    selectedOptions: Array<{ name: string; value: string }>;
    image?: string;
  }>;
}

/**
 * Spec tiles shown on the product page, in display order.
 *
 * The Storefront API can only return metafields you name explicitly, so every
 * spec the store might carry has to be listed here. Keys absent from a product
 * come back null and their tile is simply not rendered — adding a new spec is
 * one row plus one entry in PRODUCT_METAFIELD_IDENTIFIERS.
 */
const SPEC_FIELDS: Array<{ key: string; label: string; format?: (raw: string) => string }> = [
  { key: "fabric_type", label: "Fabric" },
  { key: "frame_material", label: "Frame" },
  { key: "method_of_operation", label: "Operation" },
  { key: "weight", label: "Weight", format: formatDimension },
  { key: "closed_length", label: "Closed Length" },
  { key: "open_diameter", label: "Open Diameter" },
];

const WEIGHT_UNIT_LABELS: Record<string, string> = {
  GRAMS: "g",
  KILOGRAMS: "kg",
  POUNDS: "lb",
  OUNCES: "oz",
};

/**
 * Shopify dimension/weight metafields arrive as JSON: {"value":390.0,"unit":"GRAMS"}.
 * Rendered verbatim from the store — a wrong number here is a catalog data issue,
 * not something to silently "correct" on the storefront.
 */
export function formatDimension(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { value?: number; unit?: string };
    if (typeof parsed.value !== "number") return raw;
    const unit = WEIGHT_UNIT_LABELS[parsed.unit ?? ""] ?? parsed.unit?.toLowerCase() ?? "";
    return `${parsed.value} ${unit}`.trim();
  } catch {
    return raw;
  }
}

/** reviews.rating is JSON: {"scale_min":"1.0","scale_max":"5.0","value":"4.52"} */
export function parseRatingValue(raw: string): number | null {
  try {
    const parsed = JSON.parse(raw) as { value?: string | number };
    const value = typeof parsed.value === "string" ? parseFloat(parsed.value) : parsed.value;
    return typeof value === "number" && !isNaN(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Discount badge + savings line for one price pair. Shared by the product and
 * each variant so a colour that costs more can't show the cheapest colour's
 * "% OFF". Returns empty when compareAt is missing or not above the price.
 */
export function computeDiscount(
  price: number,
  compareAt: number | null,
  currencyCode: string
): { discount?: string; savings?: string } {
  if (!compareAt || compareAt <= price) return {};
  const percent = Math.round(((compareAt - price) / compareAt) * 100);
  return {
    discount: percent > 0 ? `${percent}% OFF` : undefined,
    savings: formatPrice(compareAt - price, currencyCode),
  };
}

const PRODUCT_METAFIELD_IDENTIFIERS = [
  ...SPEC_FIELDS.map((f) => ({ namespace: "custom", key: f.key })),
  { namespace: "reviews", key: "rating" },
  { namespace: "reviews", key: "rating_count" },
];

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!, $identifiers: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      options {
        name
        values
      }
      metafields(identifiers: $identifiers) {
        namespace
        key
        value
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch a single product's detail from Shopify by its URL handle.
 */
export async function getShopifyProductByHandle(handle: string): Promise<ShopifyProductDetail | null> {
  const data = await shopifyFetch<{
    product: {
      id: string;
      title: string;
      handle: string;
      description: string;
      descriptionHtml: string;
      availableForSale: boolean;
      options: Array<{ name: string; values: string[] }>;
      metafields: Array<{ namespace: string; key: string; value: string } | null>;
      priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
      compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
      images: { edges: Array<{ node: { url: string; altText: string | null } }> };
      variants: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            availableForSale: boolean;
            price: { amount: string; currencyCode: string };
            compareAtPrice: { amount: string; currencyCode: string } | null;
            selectedOptions: Array<{ name: string; value: string }>;
            image: { url: string } | null;
          };
        }>;
      };
    } | null;
  }>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle, identifiers: PRODUCT_METAFIELD_IDENTIFIERS },
  });

  const node = data.product;
  if (!node) return null;

  const currency = node.priceRange.minVariantPrice.currencyCode;
  const minPrice = parseFloat(node.priceRange.minVariantPrice.amount);
  const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
    : null;

  const { discount, savings } = computeDiscount(minPrice, comparePrice, currency);

  // metafields() answers in identifier order with nulls for keys the product
  // does not carry, so index by namespace:key rather than by position.
  const metafields = new Map<string, string>();
  for (const field of node.metafields ?? []) {
    if (field?.value) metafields.set(`${field.namespace}:${field.key}`, field.value);
  }

  const specs: ProductSpec[] = SPEC_FIELDS.flatMap((field) => {
    const raw = metafields.get(`custom:${field.key}`);
    if (!raw) return [];
    const value = field.format ? field.format(raw) : raw;
    return value ? [{ key: field.key, label: field.label, value }] : [];
  });

  const ratingRaw = metafields.get("reviews:rating");
  const ratingCountRaw = metafields.get("reviews:rating_count");
  const ratingValue = ratingRaw ? parseRatingValue(ratingRaw) : null;
  const ratingCount = ratingCountRaw ? parseInt(ratingCountRaw, 10) : NaN;
  const rating =
    ratingValue !== null && !isNaN(ratingCount) ? { value: ratingValue, count: ratingCount } : undefined;

  const images = node.images.edges.map(({ node: img }) => ({
    url: img.url,
    altText: img.altText || node.title,
  }));

  const variants = node.variants.edges.map(({ node: v }) => {
    const variantPrice = parseFloat(v.price.amount);
    const variantCompare = v.compareAtPrice ? parseFloat(v.compareAtPrice.amount) : null;
    return {
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: formatPrice(variantPrice, v.price.currencyCode),
      priceNumeric: variantPrice,
      originalPrice:
        variantCompare && variantCompare > variantPrice
          ? formatPrice(variantCompare, v.compareAtPrice!.currencyCode)
          : undefined,
      ...computeDiscount(variantPrice, variantCompare, v.price.currencyCode),
      selectedOptions: v.selectedOptions ?? [],
      image: v.image?.url,
    };
  });

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    price: formatPrice(minPrice, currency),
    originalPrice: comparePrice && comparePrice > minPrice ? formatPrice(comparePrice, currency) : undefined,
    discount,
    savings,
    priceNumeric: minPrice,
    rating,
    specs,
    // "Title / Default Title" is Shopify's placeholder for products with no real
    // options — showing it as a swatch group would be noise.
    options: (node.options ?? []).filter((o) => o.name !== "Title"),
    images,
    variants,
  };
}

/**
 * Every product handle in the store, following pagination to the end.
 *
 * Used by the sitemap, which has to list all of them — an unlisted product page
 * exists but no crawler ever hears about it. Deliberately fetches only handles
 * and updatedAt so the whole catalog fits in a few cheap requests.
 */
export async function getAllProductHandles(): Promise<Array<{ handle: string; updatedAt: string }>> {
  const query = `
    query AllProductHandles($cursor: String) {
      products(first: 250, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        edges { node { handle updatedAt } }
      }
    }
  `;

  const handles: Array<{ handle: string; updatedAt: string }> = [];
  let cursor: string | null = null;

  // Bounded so a pageInfo bug can never spin forever: 250 x 20 is far past any
  // plausible catalog size for this store.
  for (let page = 0; page < 20; page++) {
    const data: {
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: Array<{ node: { handle: string; updatedAt: string } }>;
      };
    } = await shopifyFetch({ query, variables: { cursor } });

    handles.push(...data.products.edges.map(({ node }) => node));
    if (!data.products.pageInfo.hasNextPage) break;
    cursor = data.products.pageInfo.endCursor;
  }

  return handles;
}

export interface ShopifyCollectionDetail {
  id: string;
  title: string;
  description: string;
  image?: string;
  products: ShopifyProduct[];
}

const COLLECTION_BY_HANDLE_QUERY = `
  query GetCollectionByHandle($handle: String!, $first: Int = 30) {
    collection(handle: $handle) {
      id
      title
      description
      image {
        url
        altText
      }
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch a single collection details along with its products list from Shopify by handle.
 */
export async function getShopifyCollectionByHandle(handle: string, first: number = 24): Promise<ShopifyCollectionDetail | null> {
  const data = await shopifyFetch<{
    collection: {
      id: string;
      title: string;
      description: string;
      image: { url: string; altText: string | null } | null;
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            description: string;
            availableForSale: boolean;
            priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
            compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } };
            images: { edges: Array<{ node: { url: string; altText: string | null } }> };
            variants: { edges: Array<{ node: { id: string; availableForSale: boolean } }> };
          };
        }>;
      };
    } | null;
  }>({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, first },
  });

  const node = data.collection;
  if (!node) return null;

  const products = node.products.edges.map(({ node: prod }) => {
    const minPrice = parseFloat(prod.priceRange.minVariantPrice.amount);
    const comparePrice = prod.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(prod.compareAtPriceRange.minVariantPrice.amount)
      : null;

    let discount: string | undefined;
    if (comparePrice && comparePrice > minPrice) {
      const discountPct = Math.round(((comparePrice - minPrice) / comparePrice) * 100);
      if (discountPct > 0) discount = `${discountPct}% OFF`;
    }

    const firstImage = prod.images.edges[0]?.node;
    const firstVariant = prod.variants.edges[0]?.node;

    return {
      id: prod.id,
      title: prod.title,
      handle: prod.handle,
      description: prod.description,
      availableForSale: prod.availableForSale,
      price: formatPrice(minPrice, prod.priceRange.minVariantPrice.currencyCode),
      originalPrice: comparePrice && comparePrice > minPrice
        ? formatPrice(comparePrice, prod.compareAtPriceRange?.minVariantPrice.currencyCode)
        : undefined,
      discount,
      image: firstImage?.url || "/assets/sun/prod-walkingstick.png",
      imageAlt: firstImage?.altText || prod.title,
      variantId: firstVariant?.id,
      href: `/products/${prod.handle}`,
    };
  });

  return {
    id: node.id,
    title: node.title,
    description: node.description,
    image: node.image?.url,
    products,
  };
}



