import { createServerFn } from "@tanstack/react-start";
import { appendContactRow } from "@/lib/api/contact.server";
import { contactSchema, type ContactRow } from "@/lib/contact";

/** Store one contact enquiry. The sheet itself lives behind contact.server.ts. */
export const submitContact = createServerFn({ method: "POST" })
  .validator(contactSchema)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    // Honeypot filled means a bot. Answer ok so it learns nothing, store nothing.
    if (data.website) return { ok: true };

    const row: ContactRow = {
      submittedAt: new Date().toISOString(),
      name: data.name,
      phone: data.phone,
      email: data.email ?? "",
      city: data.city ?? "",
      message: data.message ?? "",
    };

    await appendContactRow(row);
    return { ok: true };
  });
