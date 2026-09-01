import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        // Preview deployments serve the whole catalog on a *.vercel.app host.
        // Left crawlable they compete with production for the same content, so
        // only the production deployment invites indexing.
        const body =
          process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production"
            ? ["User-agent: *", "Disallow: /"].join("\n")
            : ["User-agent: *", "Allow: /", "", `Sitemap: ${origin}/sitemap.xml`].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
