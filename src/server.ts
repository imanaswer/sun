import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { applySecurityHeaders } from "./lib/security-headers.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/**
 * Let the CDN hold rendered pages briefly.
 *
 * Every page view re-issued live Shopify GraphQL from the function, so latency
 * and Storefront rate-limit exposure both scaled with traffic. Pages don't vary
 * per visitor — the cart lives in localStorage and renders client-side — so a
 * shared cache is safe. The browser still revalidates (`max-age=0`); only the
 * edge holds a copy, and `stale-while-revalidate` means a price change is at
 * most a minute late rather than a cache miss for everyone at once.
 *
 * Routes that set their own Cache-Control (robots.txt, sitemap.xml) keep it.
 */
function applyPageCaching(request: Request, response: Response): Response {
  if (request.method !== "GET") return response;
  if (response.status !== 200) return response;
  if (response.headers.has("cache-control")) return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(
        applyPageCaching(request, await normalizeCatastrophicSsrResponse(response)),
      );
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
