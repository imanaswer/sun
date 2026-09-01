import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Start the loader on hover/focus so a category or product is usually
    // already fetched by the time the click lands.
    defaultPreload: "intent",
    // Catalog data (price, stock) must not be served stale from a preload, so
    // keep the fetch itself fresh; the CDN layer in server.ts absorbs the load.
    defaultPreloadStaleTime: 0,
    // Without this a click sat on the old page with no feedback until Shopify
    // answered. 150ms is below the threshold where a spinner reads as a stall.
    defaultPendingMs: 150,
    defaultPendingMinMs: 300,
  });

  return router;
};
