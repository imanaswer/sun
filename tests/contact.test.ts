import { expect, test } from "bun:test";
import { contactSchema, csvCell, toCsv, type ContactRow } from "../src/lib/contact";

const row = (over: Partial<ContactRow> = {}): ContactRow => ({
  submittedAt: "2026-09-05T10:00:00.000Z",
  name: "Asha",
  phone: "+91 63649 13526",
  email: "asha@example.com",
  city: "Mysuru",
  message: "Need 200 promotional umbrellas.",
  ...over,
});

test("requires a name and a plausible phone number", () => {
  expect(contactSchema.safeParse({ name: "Asha", phone: "+91 821 2514578" }).success).toBe(true);
  expect(contactSchema.safeParse({ name: "A", phone: "+918212514578" }).success).toBe(false);
  expect(contactSchema.safeParse({ name: "Asha", phone: "call me" }).success).toBe(false);
  expect(contactSchema.safeParse({ name: "Asha" }).success).toBe(false);
});

test("email is optional but must be an email when given", () => {
  expect(contactSchema.safeParse({ name: "Asha", phone: "9900112233", email: "" }).success).toBe(true);
  expect(contactSchema.safeParse({ name: "Asha", phone: "9900112233", email: "nope" }).success).toBe(false);
});

test("a filled honeypot fails validation", () => {
  expect(
    contactSchema.safeParse({ name: "Asha", phone: "9900112233", website: "http://spam" }).success,
  ).toBe(false);
});

test("commas, quotes and newlines survive the CSV round trip", () => {
  const csv = toCsv([row({ message: 'Two, please — "urgent"\nby Friday' })]);
  expect(csv).toContain('"Two, please — ""urgent""\nby Friday"');
  expect(csv.split("\r\n")[0]).toBe(
    '"Submitted at","Name","Phone","Email","Address / City","Message"',
  );
});

test("a cell that a spreadsheet would run as a formula is defused", () => {
  // Without the leading quote Excel executes this on open.
  expect(csvCell('=HYPERLINK("http://evil","click")')).toBe(
    '"\'=HYPERLINK(""http://evil"",""click"")"',
  );
  expect(csvCell("+1 800 SCAM")).toBe("\"'+1 800 SCAM\"");
  expect(csvCell("-2")).toBe("\"'-2\"");
  expect(csvCell("@sum(1)")).toBe("\"'@sum(1)\"");
  // A phone number that starts with + is quoted the same way — still readable.
  expect(csvCell("Mysuru")).toBe('"Mysuru"');
  expect(csvCell(undefined)).toBe('""');
});

test("every stored field reaches the file, in column order", () => {
  const [, line] = toCsv([row()]).split("\r\n");
  expect(line).toBe(
    '"2026-09-05T10:00:00.000Z","Asha","\'+91 63649 13526","asha@example.com","Mysuru","Need 200 promotional umbrellas."',
  );
});
