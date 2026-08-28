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
  {
    name: "Outdoor & Golf",
    sub: "Maximum Shade",
    blurb:
      "Extra-large canopies built for shade. Perfect for the beach, the golf course, and long summer days.",
    image: "/assets/sun/prod-reporter-silver.png",
    href: `${SHOP}/collections/outdoor`,
  },
];

export const BESTSELLERS: Product[] = [
  {
    name: "Jet - Auto Open 3-Fold Umbrella, UV protective",
    tag: "3-Fold · UV",
    price: "Rs. 450.00",
    originalPrice: "Rs. 950.00",
    discount: "53% OFF",
    image: "/assets/trending/jet.jpg",
    href: `${SHOP}/products/jet-auto-open-3-fold-umbrella-uv-protective`,
  },
  {
    name: "Edward - UV Protective 3 Fold Umbrella",
    tag: "3-Fold · UV",
    price: "Rs. 475.00",
    originalPrice: "Rs. 699.00",
    discount: "32% OFF",
    image: "/assets/trending/edward.jpg",
    href: `${SHOP}/products/edward-uv-protective-3-fold-umbrella`,
  },
  {
    name: "Nirali - UV Protective 3 Fold Umbrella",
    tag: "3-Fold · UV",
    price: "Rs. 435.00",
    originalPrice: "Rs. 799.00",
    discount: "46% OFF",
    image: "/assets/trending/nirali.jpg",
    href: `${SHOP}/products/nirali-uv-protective-3-fold-umbrella`,
  },
  {
    name: "Madonna - Jumbo Size - 3 Fold - Auto Open",
    tag: "3-Fold · Jumbo",
    price: "Rs. 765.00",
    originalPrice: "Rs. 1,299.00",
    discount: "41% OFF",
    image: "/assets/trending/madonna.jpg",
    href: `${SHOP}/products/madonna-jumbo-size-3-fold-auto-open-uv-protective-umbrella`,
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
  {
    src: "/assets/sun/videos/reel-walkingstick.mp4",
    poster: "",
    label: "Unmatched durability",
    caption: "Tested in heavy storms",
    href: `${SHOP}/collections/all`,
  },
];

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

/** Sun Umbrella customer reviews (placeholder copy; swap for real reviews). */
export const TESTIMONIALS: TestimonialItem[] = [
  {
    text: "Survived three Mumbai monsoons and still opens with one push. The auto-open is a lifesaver on a crowded local train.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Priya Nair",
    role: "Mumbai",
  },
  {
    text: "Bought the 3-fold for my bag — folds to a paperback, opens huge. The UV coating actually keeps the heat off on Chennai afternoons.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Rahul Menon",
    role: "Chennai",
  },
  {
    text: "We ordered 500 branded umbrellas for our dealership event. Premium quality, delivered on time, and everyone kept one.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Anjali Rao",
    role: "Brand Manager",
  },
  {
    text: "135 years and it shows — the frame took a Bengaluru pre-monsoon gust head-on and sprang right back into shape.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "Vikram Shetty",
    role: "Bengaluru",
  },
  {
    text: "My kids love their bright umbrellas and I love that they're genuinely windproof, not the flimsy ones that flip inside out.",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    name: "Fatima Sheikh",
    role: "Kochi",
  },
  {
    text: "The walking-stick model gives my father support and shelter in one. Beautifully made, and the rose-wood handle feels solid.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Deepa Iyer",
    role: "Mysuru",
  },
  {
    text: "Gifted these to the whole team for Diwali. Everyone keeps asking where they're from — best corporate gift we've done.",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    name: "Arjun Kapoor",
    role: "HR Lead",
  },
  {
    text: "The rose-wood finish looks so premium people think it cost triple. Rain just beads and slides straight off the canopy.",
    image: "https://randomuser.me/api/portraits/women/90.jpg",
    name: "Sana Qureshi",
    role: "Hyderabad",
  },
  {
    text: "Ordered on Amazon, arrived next day, and it has already outlasted every cheap umbrella I've ever owned. Worth every rupee.",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    name: "Karthik Reddy",
    role: "Pune",
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
