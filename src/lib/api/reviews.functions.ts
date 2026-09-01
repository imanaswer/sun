import { createServerFn } from "@tanstack/react-start";
import process from "node:process";
import { z } from "zod";

export interface ProductReview {
  id: number;
  rating: number;
  title: string;
  body: string;
  reviewerName: string;
  createdAt: string;
}

interface JudgeMeReview {
  id: number;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  reviewer: { name: string | null } | null;
}

/**
 * Judge.me holds the written reviews; Shopify's Storefront API only exposes the
 * aggregate (reviews.rating / reviews.rating_count) that the product page shows
 * in its star row.
 *
 * The Judge.me API token is a private key, so this stays a server function —
 * an import.meta.env.VITE_* value would be bundled into the client. Without the
 * token the page still renders the real aggregate, just no written reviews.
 * Token: Judge.me dashboard -> Settings -> API tokens.
 */
export const getProductReviews = createServerFn({ method: "POST" })
  .validator(z.object({ handle: z.string().min(1), perPage: z.number().min(1).max(50).default(10) }))
  .handler(async ({ data }): Promise<ProductReview[]> => {
    const apiToken = process.env.JUDGEME_API_TOKEN;
    const shopDomain = process.env.JUDGEME_SHOP_DOMAIN;
    if (!apiToken || !shopDomain) return [];

    const url = new URL("https://judge.me/api/v1/reviews");
    url.searchParams.set("api_token", apiToken);
    url.searchParams.set("shop_domain", shopDomain);
    url.searchParams.set("handle", data.handle);
    url.searchParams.set("per_page", String(data.perPage));

    try {
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) {
        console.error(`Judge.me responded ${response.status} for ${data.handle}`);
        return [];
      }
      const json = (await response.json()) as { reviews?: JudgeMeReview[] };
      return (json.reviews ?? [])
        .filter((r) => r.body || r.title)
        .map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title ?? "",
          body: r.body ?? "",
          reviewerName: r.reviewer?.name ?? "Verified buyer",
          createdAt: r.created_at,
        }));
    } catch (e) {
      // Reviews are supplementary — a Judge.me outage must not take the page down.
      console.error("Failed to load Judge.me reviews:", e);
      return [];
    }
  });

/**
 * Shop-wide reviews for the homepage testimonials wall.
 *
 * That section used to render nine invented customers with stock portraits.
 * Real reviews or nothing: when Judge.me is unconfigured or has too few
 * reviews, the caller drops the section rather than padding it.
 */
export const getShopReviews = createServerFn({ method: "POST" })
  .validator(z.object({ perPage: z.number().min(1).max(50).default(30) }))
  .handler(async ({ data }): Promise<ProductReview[]> => {
    const apiToken = process.env.JUDGEME_API_TOKEN;
    const shopDomain = process.env.JUDGEME_SHOP_DOMAIN;
    if (!apiToken || !shopDomain) return [];

    const url = new URL("https://judge.me/api/v1/reviews");
    url.searchParams.set("api_token", apiToken);
    url.searchParams.set("shop_domain", shopDomain);
    url.searchParams.set("per_page", String(data.perPage));

    try {
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) {
        console.error(`Judge.me responded ${response.status} for shop reviews`);
        return [];
      }
      const json = (await response.json()) as { reviews?: JudgeMeReview[] };
      return (json.reviews ?? [])
        // A star rating with no words says nothing on a testimonials wall, and
        // 1-2 star reviews belong on the product page, not the shop front.
        .filter((r) => (r.body ?? "").trim().length >= 40 && r.rating >= 4)
        .map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title ?? "",
          body: r.body ?? "",
          reviewerName: r.reviewer?.name ?? "Verified buyer",
          createdAt: r.created_at,
        }));
    } catch (e) {
      console.error("Failed to load Judge.me shop reviews:", e);
      return [];
    }
  });
