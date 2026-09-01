import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

/**
 * A link that navigates client-side when it can.
 *
 * The whole storefront chrome was raw `<a href>`, so every category click was a
 * full document load — which remounted the root and re-ran the intro loader.
 * Converting ~50 call sites individually invites mistakes, so the decision
 * lives here instead: an in-app path becomes a router `<Link>`, and anything
 * else (mailto:, tel:, #hash, an external URL) stays a plain anchor, which is
 * what those need anyway.
 */
export function SiteLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const isInApp = href.startsWith("/") && !href.startsWith("//") && !href.includes("#");

  if (!isInApp) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} {...rest}>
      {children}
    </Link>
  );
}
