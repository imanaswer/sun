/**
 * Sun Umbrella storefront data. Collections + bestsellers with copy, prices and
 * links pulled from the live Shopify store (sunumbrella.in). Images are local
 * placeholders in /assets/sun/ — swap for final brand photography before launch.
 * Links point at the real Shopify collections/products, so the storefront is
 * navigable today and maps cleanly onto the Shopify Storefront API later.
 */

const SHOP = "https://sunumbrella.in";

export interface Collection {
  name: string;
  sub: string;
  blurb: string;
  image: string;
  href: string;
}

export interface Product {
  name: string;
  tag: string;
  price: string;
  image: string;
  href: string;
}

export const COLLECTIONS: Collection[] = [
  {
    name: "Non-Fold",
    sub: "Black & Colours",
    blurb:
      "The full-length stick that lives by the door. Rose-wood finish, UV-protective, windproof.",
    image: "/assets/sun/prod-walkingstick.png",
    href: `${SHOP}/collections/non-fold`,
  },
  {
    name: "2-Fold",
    sub: "Black & Colours",
    blurb:
      "Auto-open compact that still spans wide — the everyday monsoon carry for the bag.",
    image: "/assets/sun/blue-droplet.jpg",
    href: `${SHOP}/collections/2-fold`,
  },
  {
    name: "3-Fold",
    sub: "Black & Colours",
    blurb:
      "Folds to a paperback. Auto open-and-close, double-rib storm frames that spring back.",
    image: "/assets/sun/prod-reporter-silver.png",
    href: `${SHOP}/collections/3-fold`,
  },
  {
    name: "Kids",
    sub: "Bright & safe",
    blurb:
      "Light sticks and non-folds sized for small hands, big puddles and brighter walks to school.",
    image: "/assets/sun/sun-poster.png",
    href: `${SHOP}/collections/kids`,
  },
  {
    name: "Promotional",
    sub: "Your brand on top",
    blurb:
      "Custom-branded umbrellas for corporates. Trusted by Bosch, Mercedes-Benz, Shell and more.",
    image: "/assets/sun/prod-pidilite.png",
    href: `${SHOP}/collections/promotional-umbrella`,
  },
];

export const BESTSELLERS: Product[] = [
  {
    name: "Walking Stick 2-in-1",
    tag: "Non-Fold",
    price: "₹1,555",
    image: "/assets/sun/prod-walkingstick.png",
    href: `${SHOP}/collections/non-fold-black-umbrellas`,
  },
  {
    name: "Reporter — Rose Wood, Windproof",
    tag: "Non-Fold · UV",
    price: "₹665",
    image: "/assets/sun/prod-reporter-black.png",
    href: `${SHOP}/collections/non-fold-black-umbrellas`,
  },
  {
    name: "Storm Breaker — Double Rib",
    tag: "3-Fold · Auto",
    price: "₹2,530",
    image: "/assets/sun/blue-droplet.jpg",
    href: `${SHOP}/collections/3-fold-black-umbrellas`,
  },
  {
    name: "Topline 27 — Auto UV",
    tag: "2-Fold · Auto",
    price: "₹790",
    image: "/assets/sun/prod-reporter-silver.png",
    href: `${SHOP}/collections/2-fold-umbrella-black-catagory`,
  },
];

export interface Reel {
  src: string;
  poster: string;
  label: string;
  caption: string;
  href: string;
}

/**
 * Portrait product video reels (the "Next-Gen Premium Umbrellas" section). Real
 * clips pulled from the live store; the other reel entries on sunumbrella.in are
 * HLS-only and need transcoding to mp4 before they can be added here.
 */
export const REEL: Reel[] = [
  {
    src: "/assets/sun/videos/reel-walkingstick.mp4",
    poster: "",
    label: "Come rain or shine",
    caption: "Built for every downpour",
    href: `${SHOP}/collections/all`,
  },
  {
    src: "/assets/sun/videos/reel-maybach.mp4",
    poster: "",
    label: "Designed for style",
    caption: "UV protective · windproof",
    href: `${SHOP}/collections/all`,
  },
];

export const RETAIL = [
  { name: "Amazon", image: "/assets/sun/retail-amazon.png" },
  { name: "Myntra", image: "/assets/sun/retail-myntra.png" },
  { name: "Reliance", image: "/assets/sun/retail-reliance.png" },
  { name: "Blinkit", image: "/assets/sun/retail-blinkit.png" },
  { name: "Swiggy", image: "/assets/sun/retail-swiggy.png" },
  { name: "DMart", image: "/assets/sun/retail-dmart.png" },
];
