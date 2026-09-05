import process from "node:process";
import type { ContactRow } from "@/lib/contact";

/**
 * Server-only half of the contact form. Named .server.ts so the webhook URL and
 * secret can never be pulled into a client bundle by an import graph.
 *
 * Enquiries go to a Google Apps Script webhook that appends a row to a Sheet —
 * the store has no database, and a Vercel function's disk is gone the moment
 * the request ends. Setup: docs/contact-sheet.md.
 */
function webhookConfig(): { url: string; secret: string } | null {
  const url = process.env.CONTACT_SHEET_WEBHOOK_URL;
  const secret = process.env.CONTACT_SHEET_SECRET;
  if (!url || !secret) return null;
  return { url, secret };
}

export async function appendContactRow(row: ContactRow): Promise<void> {
  const config = webhookConfig();
  if (!config) {
    // Louder than a swallowed error: an unconfigured form silently losing a
    // customer's enquiry is the worst outcome here.
    console.error("Contact form: CONTACT_SHEET_WEBHOOK_URL / _SECRET not set");
    throw new Error("The contact form isn't available right now. Please email info@sunumbrellas.in.");
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: config.secret, row }),
  });

  if (!response.ok) {
    console.error(`Contact webhook responded ${response.status}`);
    throw new Error("We couldn't save your message. Please try again, or email info@sunumbrellas.in.");
  }
}

/**
 * Every stored enquiry, newest first. Used only by the CSV export route, which
 * does its own auth check before calling this.
 */
export async function fetchContactRows(): Promise<ContactRow[]> {
  const config = webhookConfig();
  if (!config) throw new Error("Contact sheet is not configured");

  const url = new URL(config.url);
  url.searchParams.set("secret", config.secret);

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Contact webhook responded ${response.status}`);

  const json = (await response.json()) as { rows?: ContactRow[] };
  return json.rows ?? [];
}
