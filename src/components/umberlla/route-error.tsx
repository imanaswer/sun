import { Link, useRouter } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";

/**
 * The retryable failure state for every Shopify-backed route.
 *
 * Product and collection routes used to pass their "not found" component to
 * `errorComponent` as well, so a network timeout or an expired Storefront token
 * told the customer the product had been discontinued — and made an outage
 * invisible in support tickets. A missing handle and a broken backend are
 * different things and now say different things.
 */
export function RouteLoadError({ title = "Couldn't load this page" }: { title?: string }) {
  const router = useRouter();

  return (
    <div
      className="u-page u-light"
      style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}
    >
      <SiteNav />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <h1 className="u-fun-head text-4xl md:text-6xl" style={{ color: "var(--u-accent-text)" }}>
          {title}
        </h1>
        <p className="mt-4 max-w-[42ch] text-sm" style={{ color: "var(--u-muted)" }}>
          Something went wrong on our side — this isn&rsquo;t you, and the product
          hasn&rsquo;t gone anywhere. Please try again in a moment.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="u-mono rounded-full px-6 py-3 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--u-yellow)", color: "var(--u-ink)" }}
          >
            Try again
          </button>
          <Link
            to="/"
            className="u-mono rounded-full border px-6 py-3 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: "var(--u-slate)", color: "var(--u-bone)" }}
          >
            Back to Store
          </Link>
        </div>
      </main>
      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}
