import { z } from "zod";

/**
 * Contact enquiries. Rows live in a Google Sheet (see docs/contact-sheet.md);
 * this module owns the shape they must have and the CSV they come back as.
 */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(120),
  // Indian mobile/landline with optional +91 and separators. Deliberately loose
  // on formatting, strict on "is this a plausible number at all".
  phone: z
    .string()
    .trim()
    .min(6, "A phone number we can reach you on")
    .max(24)
    .regex(/^[+\d][\d\s\-()]{5,23}$/, "That doesn't look like a phone number"),
  email: z.union([z.literal(""), z.email().max(160)]).optional(),
  city: z.string().trim().max(160).optional(),
  message: z.string().trim().max(4000).optional(),
  // Honeypot: a real person never sees this field, so anything in it is a bot.
  website: z.string().max(0).optional(),
});

export type ContactSubmission = z.infer<typeof contactSchema>;

export interface ContactRow {
  submittedAt: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
}

const CSV_COLUMNS: Array<{ key: keyof ContactRow; label: string }> = [
  { key: "submittedAt", label: "Submitted at" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "city", label: "Address / City" },
  { key: "message", label: "Message" },
];

/**
 * One CSV cell. Quotes everything so commas, quotes and newlines inside a
 * message survive, and defuses the leading =, +, - and @ that Excel and Sheets
 * would otherwise execute as a formula from an untrusted submitter.
 */
export function csvCell(value: unknown): string {
  const raw = value == null ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(rows: ContactRow[]): string {
  const lines = [CSV_COLUMNS.map((c) => csvCell(c.label)).join(",")];
  for (const row of rows) {
    lines.push(CSV_COLUMNS.map((c) => csvCell(row[c.key])).join(","));
  }
  // CRLF: what Excel expects, and what every CSV reader accepts.
  return lines.join("\r\n") + "\r\n";
}
