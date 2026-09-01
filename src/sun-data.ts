/**
 * Sun Umbrella storefront data. Collections + bestsellers with copy, prices and
 * links pulled from the live Shopify store. Images are local placeholders in
 * /assets/sun/ — swap for final brand photography before launch.
 *
 * Every href is an INTERNAL route. The old sunumbrella.in / sunumbrellas.in
 * absolute URLs used to live here and shipped in the server-rendered HTML,
 * which sent crawlers and pre-hydration taps off to the old storefront. Keep
 * them out: tests/no-legacy-domain.test.ts fails if they come back.
 */

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
  originalPrice?: string;
  discount?: string;
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
    href: "/collections/non-fold-black-umbrellas",
  },
  {
    name: "2-Fold",
    sub: "Black & Colours",
    blurb:
      "Auto-open compact that still spans wide — the everyday monsoon carry for the bag.",
    image: "/assets/sun/blue-droplet.jpg",
    href: "/collections/2-fold-umbrella-black-catagory",
  },
  {
    name: "3-Fold",
    sub: "Black & Colours",
    blurb:
      "Folds to a paperback. Auto open-and-close, double-rib storm frames that spring back.",
    image: "/assets/sun/prod-reporter-silver.png",
    href: "/collections/3-fold-black-umbrellas",
  },
  {
    name: "Kids",
    sub: "Bright & safe",
    blurb:
      "Light sticks and non-folds sized for small hands, big puddles and brighter walks to school.",
    image: "/assets/sun/sun-poster.png",
    href: "/collections/kids-umbrellas-tuesday",
  },
  {
    name: "Promotional",
    sub: "Your brand on top",
    blurb:
      "Custom-branded umbrellas for corporates. Trusted by Bosch, Mercedes-Benz, Shell and more.",
    image: "/assets/sun/prod-pidilite.png",
    href: "/collections/promotional-umbrella",
  },
  {
    name: "Outdoor & Golf",
    sub: "Maximum Shade",
    blurb:
      "Extra-large canopies built for shade. Perfect for the beach, the golf course, and long summer days.",
    image: "/assets/sun/prod-reporter-silver.png",
    href: "/collections/golf-umbrellas",
  },
];

export const BESTSELLERS: Product[] = [
  {
    name: "Jet - Auto Open 3-Fold Umbrella, UV protective",
    tag: "3-Fold · UV",
    price: "₹450.00",
    originalPrice: "₹950.00",
    discount: "53% OFF",
    image: "/assets/trending/jet.jpg",
    href: "/products/jet-auto-open-3-fold-umbrella-uv-protective",
  },
  {
    name: "Edward - UV Protective 3 Fold Umbrella",
    tag: "3-Fold · UV",
    price: "₹475.00",
    originalPrice: "₹699.00",
    discount: "32% OFF",
    image: "/assets/trending/edward.jpg",
    href: "/products/edward-uv-protective-3-fold-umbrella",
  },
  {
    name: "Nirali - UV Protective 3 Fold Umbrella",
    tag: "3-Fold · UV",
    price: "₹435.00",
    originalPrice: "₹799.00",
    discount: "46% OFF",
    image: "/assets/trending/nirali.jpg",
    href: "/products/nirali-uv-protective-3-fold-umbrella",
  },
  {
    name: "Madonna - Jumbo Size - 3 Fold - Auto Open",
    tag: "3-Fold · Jumbo",
    price: "₹765.00",
    originalPrice: "₹1,299.00",
    discount: "41% OFF",
    image: "/assets/trending/madonna.jpg",
    href: "/products/madonna-jumbo-size-3-fold-auto-open-uv-protective-umbrella",
  },
];

export const BRANDS = [
  {
    name: "Bosch",
    image: "/assets/sunnxt/bosh.webp",
    href: "/products/bosch",
  },
  {
    name: "Antara",
    image: "/assets/sunnxt/antara.webp",
    href: "/products/antara",
  },
  {
    name: "Mercedes Benz",
    image: "/assets/sunnxt/benz.webp",
    href: "/products/mercedes-benz",
  },
  {
    name: "Shell",
    image: "/assets/sunnxt/Shell.webp",
    href: "/products/shell-umbrella",
  },
  {
    name: "Crocs",
    image: "/assets/sunnxt/crocs.webp",
    href: "/products/crocs-umbrella",
  },
  {
    name: "Sula",
    image: "/assets/sunnxt/sula.webp",
    href: "/products/sula-wines-outdoor-umbrella",
  },
  {
    name: "Tata",
    image: "/assets/sunnxt/Tata.webp",
    href: "/products/tata-capital",
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
    href: "/collections/all",
  },
  {
    src: "/assets/sun/videos/reel-maybach.mp4",
    poster: "",
    label: "Designed for style",
    caption: "UV protective · windproof",
    href: "/collections/all",
  },
  {
    src: "/assets/sun/videos/reel-walkingstick.mp4",
    poster: "",
    label: "Unmatched durability",
    caption: "Tested in heavy storms",
    href: "/collections/all",
  },
];

/* The homepage testimonials wall is fed by real Judge.me reviews via
   getShopReviews(); the nine invented customers and their randomuser.me stock
   portraits that used to live here have been removed. Do not re-add placeholder
   reviews to a storefront that takes money. */

export const RETAIL = [
  { name: "Amazon", image: "/assets/sun/retail-amazon.png" },
  { name: "Myntra", image: "/assets/sun/retail-myntra.png" },
  { name: "Reliance", image: "/assets/sun/retail-reliance.png" },
  { name: "Blinkit", image: "/assets/sun/retail-blinkit.png" },
  { name: "Swiggy", image: "/assets/sun/retail-swiggy.png" },
  { name: "DMart", image: "/assets/sun/retail-dmart.png" },
];

export const STORES = [
  {
    city: "Mumbai",
    address: "94/96, Princess Street, Kalbadevi, Near Marine Lines Station, Municipal Colony, Mumbai - 400002, Maharashtra",
    phones: ["+91 83181 89499"],
    mapQuery: "Sun Umbrellas, Princess Street, Kalbadevi, Mumbai",
    mapLink: "https://maps.google.com/?q=Sun+Umbrellas,+Princess+Street,+Kalbadevi,+Mumbai",
    marker: "18.9495,72.8264",
    bbox: "72.8214,18.9445,72.8314,18.9545",
  },
  {
    city: "Calicut",
    address: "13/1011, Nagjees, Trikovil Lane, Big Bazaar, Near Railway Station, 4th Platform Entrance, Calicut - 673001, Kerala",
    phones: ["+91 (0495) 4015431", "+91 81290 80090"],
    mapQuery: "Sun Umbrella Private Limited, Calicut",
    mapLink: "https://maps.google.com/?q=Sun+Umbrella+Private+Limited,+Calicut",
    marker: "11.2588,75.7804",
    bbox: "75.7754,11.2538,75.7854,11.2638",
  },
  {
    city: "Mysuru",
    address: "#211, Ground Floor, JCK Industrial Park, Phase-2, Belagola Industrial Area, Mysuru - 570016, Karnataka",
    phones: ["+91 0821 - 2514578"],
    mapQuery: "Sun Umbrella Private Limited, Mysuru",
    mapLink: "https://maps.google.com/?q=Sun+Umbrella+Private+Limited,+Mysuru",
    marker: "12.355,76.621",
    bbox: "76.616,12.350,76.626,12.360",
  },
];
