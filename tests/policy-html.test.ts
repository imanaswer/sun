import { expect, test } from "bun:test";
import { cleanPolicyHtml } from "../src/lib/policy-html";

test("old-domain contact link becomes /contact", () => {
  const html =
    '<p>Please contact us through the <a href="https://sunumbrella.in/pages/contact"><strong>Contact Us page</strong></a> on our website.</p>';
  const out = cleanPolicyHtml(html);
  expect(out).toContain('<a href="/contact"><strong>Contact Us page</strong></a>');
  expect(out).not.toContain("sunumbrella.in");
  // The plain "contact us" earlier in the sentence is linked too, once.
  expect(out.match(/href="\/contact"/g)?.length).toBe(2);
});

test("paragraph-long legacy links are unwrapped, not linked", () => {
  const long = "x".repeat(80);
  const out = cleanPolicyHtml(`<p><a href="https://sunumbrella.in/pages/contact">${long}</a></p>`);
  expect(out).toBe(`<p>${long}</p>`);
});

test("headings, existing links and mailto survive", () => {
  const html =
    '<h2>Contact Us</h2><p>Email <a href="mailto:info@sunumbrellas.in">info@sunumbrellas.in</a> or <a href="/contact">contact us</a>.</p>';
  expect(cleanPolicyHtml(html)).toBe(html);
});
