/**
 * Clean-up for policy bodies authored in Shopify admin before they render here.
 */

const LEGACY_LINK = /<a\b[^>]*href="https?:\/\/(?:www\.)?sunumbrellas?\.in([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;

/**
 * Old-storefront links: the contact page becomes our /contact, everything else
 * is unwrapped to its words. Shopify's default privacy policy wraps whole
 * paragraphs in a contact link, so only a short label is kept as a link —
 * a paragraph-long one would render as a wall of underlined text.
 */
export function rewriteLegacyLinks(html: string): string {
  return html.replace(LEGACY_LINK, (_, path: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    if (path.includes("contact") && text.length <= 40) return `<a href="/contact">${inner}</a>`;
    return inner;
  });
}

/**
 * Every plain-text "Contact Us" outside a link or heading becomes a link to
 * /contact, so a customer reading a policy is one click from the form.
 */
export function linkContactMentions(html: string): string {
  let inLink = 0;
  let inHeading = 0;
  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<a\b/i.test(part)) inLink++;
        else if (/^<\/a>/i.test(part)) inLink = Math.max(0, inLink - 1);
        else if (/^<h[1-6]\b/i.test(part)) inHeading++;
        else if (/^<\/h[1-6]>/i.test(part)) inHeading = Math.max(0, inHeading - 1);
        return part;
      }
      if (inLink || inHeading) return part;
      return part.replace(/\bcontact us( page)?\b/gi, (m) => `<a href="/contact">${m}</a>`);
    })
    .join("");
}

export function cleanPolicyHtml(html: string): string {
  return linkContactMentions(rewriteLegacyLinks(html));
}
