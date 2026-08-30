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
      href: `https://sunumbrella.in/products/${node.handle}`,
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

