# Sun Umbrella

Headless storefront for **Sun Umbrella**, a heritage umbrella brand of 100+ years.
Cinematic scroll-film hero, autoplaying product reel, and a catalog served live
from the Shopify Storefront API.

Shopify remains the system of record — catalog, inventory, policies and the
hosted checkout. This app is the customer-facing half.

## Stack

- [TanStack Start](https://tanstack.com/start) + [Vite](https://vitejs.dev/) (React 19)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Runs on [Bun](https://bun.com/); deploys to Vercel (`scripts/vercel-build.mjs`
  emits Build Output API v3 with an SSR Node function)

## Develop

```bash
cp .env.example .env    # fill in the Shopify values
bun install
bun run dev             # prints its local URL, e.g. http://localhost:5173
```

## Environment

The Shopify variables are **required** — the app throws at startup without them,
deliberately, so a misconfigured deploy fails loudly instead of silently serving
the wrong store.

| Variable | Required | Notes |
|---|---|---|
| `VITE_SHOPIFY_STORE_DOMAIN` | yes | `your-store.myshopify.com` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | yes | Storefront token — public by design, ships in the client bundle. Never an Admin token. |
| `VITE_SHOPIFY_API_VERSION` | no | Defaults to a current version. Shopify supports one for ~a year. |
| `JUDGEME_API_TOKEN` | no | Private. Powers product reviews and the homepage testimonials. Server-only — never give it a `VITE_` prefix. |
| `JUDGEME_SHOP_DOMAIN` | no | Paired with the above. |

`VITE_*` values are inlined by Vite at **build** time, so on Vercel they must be
set as *build* environment variables, not runtime-only ones.

Without the Judge.me pair the product page still shows Shopify's aggregate
rating, and the homepage testimonials section hides itself rather than
displaying placeholder reviews.

## Checks

```bash
bun run typecheck   # tsr generate && tsc --noEmit
bun test            # pricing, cart, discount math, legacy-domain guard
bun run build       # UI lint gate + typecheck + vite build + Vercel output
```

## Routes

| Path | Source |
|---|---|
| `/` | Homepage; bestsellers and reviews load in the route loader (SSR) |
| `/collections` | Index of all collections |
| `/collections/$handle` | Shopify collection; `all` is synthesised from the product list |
| `/products/$handle` | Shopify product + Judge.me reviews |
| `/policies/$handle` | Privacy, refund, terms, shipping — fetched from Shopify |
| `/robots.txt`, `/sitemap.xml` | Generated; robots disallows non-production deploys |

## Deploying

The Shopify store's **primary domain must not be the domain this app serves**.
`cart.checkoutUrl` is issued on Shopify's primary domain, so if the apex points
here while Shopify still owns it, every checkout URL lands on this app and 404s.
Move Shopify to a subdomain first, then point the apex at Vercel.

## Notes

- `packages/@higgsfield/*` are local reconstructed shims of the private design
  system the template was generated against.
- Images and videos under `public/assets/sun/` are placeholders pulled from the
  live store — replace with final brand assets before launch.
- Do not "correct" the misspelled collection handles (`3-fols-colour-umbrelllas`,
  `2-fold-umbrella-black-catagory`). They are Shopify's own and must match.
