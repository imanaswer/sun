import { SiteNav } from "@/components/umberlla/sections";

/**
 * Shown while a Shopify-backed route loads.
 *
 * There was no pending UI at all: a click sat on the old page, apparently
 * ignored, until Shopify answered. These mirror the real layout so the page
 * doesn't jump when the data lands.
 */
function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{ backgroundColor: "var(--u-slate)" }}
    />
  );
}

function PendingShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="u-page u-light"
      style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}
    >
      <SiteNav />
      <main
        aria-busy="true"
        aria-label="Loading"
        className="mx-auto max-w-[1200px] px-5 py-32 md:px-8"
      >
        {children}
      </main>
    </div>
  );
}

export function CollectionPending() {
  return (
    <PendingShell>
      <Block className="h-9 w-64" />
      <Block className="mt-4 h-4 w-96 max-w-full" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <Block className="aspect-square w-full" />
            <Block className="mt-3 h-4 w-3/4" />
            <Block className="mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </PendingShell>
  );
}

export function ProductPending() {
  return (
    <PendingShell>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Block className="aspect-square w-full" />
        </div>
        <div className="lg:col-span-5">
          <Block className="h-8 w-3/4" />
          <Block className="mt-4 h-6 w-32" />
          <Block className="mt-8 h-12 w-full" />
          <Block className="mt-3 h-12 w-full" />
          <Block className="mt-8 h-4 w-full" />
          <Block className="mt-2 h-4 w-5/6" />
        </div>
      </div>
    </PendingShell>
  );
}
