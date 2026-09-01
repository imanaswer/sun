import { createFileRoute, redirect } from "@tanstack/react-router";

// Shopify serves /products as the full catalog. Nothing here duplicates
// /collections/all, so send the URL there instead of 404ing an indexed page.
export const Route = createFileRoute("/products/")({
  loader: () => {
    throw redirect({ to: "/collections/$handle", params: { handle: "all" } });
  },
});
