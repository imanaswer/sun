import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/umberlla/sections";
import { ContactAddress, ContactForm } from "@/components/umberlla/contact";
import { canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title: "Contact us",
      description:
        "Talk to Sun Umbrella — Mysuru office address, phone numbers and an enquiry form for retail, corporate and bulk umbrella orders.",
    }),
    links: [canonical("/contact")],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="u-page u-light" style={{ backgroundColor: "var(--u-navy)", color: "var(--u-bone)" }}>
      <SiteNav />

      <main className="mx-auto max-w-[1200px] px-5 py-32 md:px-8">
        <h1 className="u-fun-head text-4xl md:text-6xl">Contact us</h1>
        <p className="mt-4 max-w-[56ch] text-sm leading-relaxed" style={{ color: "var(--u-muted)" }}>
          Retail questions, corporate and bulk orders, or a repair on an umbrella
          you already own — the Mysuru office answers all of it.
        </p>

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h2 className="u-mono text-xs uppercase tracking-[0.18em]" style={{ color: "var(--u-accent-text)" }}>
              Address
            </h2>
            <div className="mt-5">
              <ContactAddress />
            </div>
          </div>

          <div className="lg:col-span-7">
            <h2 className="u-mono text-xs uppercase tracking-[0.18em]" style={{ color: "var(--u-accent-text)" }}>
              Send a message
            </h2>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <div className="u-dark">
        <SiteFooter />
      </div>
    </div>
  );
}
