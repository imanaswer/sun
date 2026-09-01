import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getShopPolicy, isShopPolicyHandle } from "@/lib/shopify";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { RouteLoadError } from "@/components/umberlla/route-error";
import { canonical, pageMeta } from "@/lib/seo";

/** Shopify's default privacy policy wraps every paragraph in a link back to the
 *  old storefront's contact page, which renders as a wall of blue text and
 *  leaks the old domain. Unwrap those, keeping the words. */
function unwrapLegacyLinks(html: string): string {
  return html.replace(/<a\b[^>]*href="[^"]*sunumbrellas?\.in[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

/**
 * Privacy, refund, terms and shipping — the four policies the Consumer
 * Protection (E-Commerce) Rules 2020 expect a storefront to display. Bodies are
 * authored in Shopify admin and fetched live, so there is nothing to keep in
 * sync here; editing them in Shopify updates these pages.
 */
export const Route = createFileRoute("/policies/$handle")({
  loader: async ({ params }) => {
    if (!isShopPolicyHandle(params.handle)) throw notFound();
    const policy = await getShopPolicy(params.handle);
    // An unwritten policy is a missing page, not a server error.
    if (!policy) throw notFound();
    // Strip here rather than at render: the loader's return value is also
    // serialised into the SSR payload, so sanitising later leaves the raw
    // old-domain markup in the HTML anyway.
    return { policy: { ...policy, body: unwrapLegacyLinks(policy.body) } };
  },
  head: ({ loaderData, params }) => {
    const policy = loaderData?.policy;
    if (!policy) return {};
    return {
      meta: pageMeta({
        title: policy.title,
        description: `${policy.title} for Sun Umbrella — how we handle your order, your data and your rights as a customer.`,
      }),
      links: [canonical(`/policies/${params.handle}`)],
    };
  },
  component: PolicyRoute,
  notFoundComponent: PolicyNotFound,
  errorComponent: () => <RouteLoadError title="Couldn't load this policy" />,
});

function PolicyShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="u-page u-light"
      style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}
    >
      <SiteNav />
      <main className="mx-auto max-w-[780px] px-5 py-32 md:px-8">{children}</main>
      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}

function PolicyRoute() {
  const { policy } = Route.useLoaderData();

  return (
    <PolicyShell>
      <h1 className="u-fun-head text-3xl md:text-5xl">{policy.title}</h1>
      <div
        className="u-policy-body mt-10 text-sm leading-relaxed"
        style={{ color: "var(--u-bone)" }}
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </PolicyShell>
  );
}

function PolicyNotFound() {
  return (
    <PolicyShell>
      <h1 className="u-fun-head text-3xl md:text-5xl">Policy not found</h1>
      <p className="mt-4 text-sm" style={{ color: "var(--u-muted)" }}>
        We couldn&rsquo;t find that policy. Everything we publish is linked in the
        footer.
      </p>
      <Link
        to="/"
        className="u-mono mt-8 inline-block rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest"
        style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
      >
        Back to Store
      </Link>
    </PolicyShell>
  );
}
