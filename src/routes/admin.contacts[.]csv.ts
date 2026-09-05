import { createFileRoute } from "@tanstack/react-router";
import process from "node:process";
import { fetchContactRows } from "@/lib/api/contact.server";
import { toCsv } from "@/lib/contact";

/**
 * Download every contact enquiry as a CSV:
 *   /admin/contacts.csv?token=<CONTACT_EXPORT_TOKEN>
 * or with an `Authorization: Bearer <token>` header, which keeps the secret out
 * of browser history and server logs.
 *
 * This serves customers' names, phone numbers and addresses, so it is closed by
 * default: with no CONTACT_EXPORT_TOKEN set it answers 404 rather than opening
 * up. Set a long random value (`openssl rand -hex 32`).
 */

/** Constant-time compare, so a wrong token can't be found one character at a time. */
function secretsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const Route = createFileRoute("/admin/contacts.csv")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const expected = process.env.CONTACT_EXPORT_TOKEN;
        if (!expected) {
          return new Response("Not found", { status: 404 });
        }

        const url = new URL(request.url);
        const provided =
          request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ??
          url.searchParams.get("token") ??
          "";

        if (!secretsMatch(provided, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        let csv: string;
        try {
          csv = toCsv(await fetchContactRows());
        } catch (e) {
          console.error("Contact export failed:", e);
          return new Response("Could not read the contact sheet", { status: 502 });
        }

        const stamp = new Date().toISOString().split("T")[0];
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="sun-umbrella-contacts-${stamp}.csv"`,
            "Cache-Control": "no-store",
            "X-Robots-Tag": "noindex, nofollow",
          },
        });
      },
    },
  },
});
