# Sun Umbrella

Storefront for **Sun Umbrella** (est. 1889) — a heritage umbrella brand.
Cinematic scroll-film hero, autoplaying product video reel, and a monsoon
collection grid that links into the live Shopify store, ready for full Shopify
Storefront API integration.

## Stack

- [TanStack Start](https://tanstack.com/start) + [Vite](https://vitejs.dev/) (React 19)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Runs on [Bun](https://bun.com/); deploys to Cloudflare Workers (Wrangler)

## Develop

```bash
bun install
bun run dev
```

The dev server prints its local URL (e.g. http://localhost:5173).

## Notes

- `packages/@higgsfield/*` are local reconstructed shims of the private design
  system the template was generated against.
- Images and videos under `public/assets/sun/` are placeholders pulled from the
  live store — replace with final brand assets before launch.
