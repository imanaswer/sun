import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { createCartCheckoutUrl, getCartVariantStates } from "@/lib/shopify";

export interface CartItem {
  id: string; // Shopify variantId
  productId?: string;
  title: string;
  handle: string;
  price: string; // Formatted price, e.g. "₹775.00"
  priceNumeric: number; // Raw number for calculation
  image: string;
  quantity: number;
  /** Set by revalidation: the variant is gone from Shopify or has sold out.
   *  Such a line can never check out, so it has to be visible and removable
   *  rather than failing silently at the payment step. */
  unavailable?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  isOpen: boolean;
  isCheckingOut: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  removeUnavailable: () => void;
  checkout: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  hasUnavailable: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sun_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("sun_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart, isHydrated]);

  // Reconcile the saved snapshot against Shopify once the cart is restored:
  // prices move, variants get unpublished, stock runs out. Failures here are
  // non-fatal — a Shopify hiccup must not empty someone's cart.
  useEffect(() => {
    if (!isHydrated || cart.length === 0) return;
    let cancelled = false;

    getCartVariantStates(cart.map((item) => item.id))
      .then((states) => {
        if (cancelled) return;
        let repriced = 0;
        setCart((prev) =>
          prev.map((item) => {
            const live = states.get(item.id);
            if (!live || !live.availableForSale) return { ...item, unavailable: true };
            if (live.priceNumeric !== item.priceNumeric) repriced += 1;
            return {
              ...item,
              unavailable: false,
              price: live.price,
              priceNumeric: live.priceNumeric,
            };
          }),
        );
        if (repriced > 0) {
          toast.info(
            repriced === 1
              ? "One item's price changed since you added it."
              : `${repriced} items' prices changed since you added them.`,
          );
        }
      })
      .catch((error) => {
        console.warn("Cart revalidation skipped:", error);
      });

    return () => {
      cancelled = true;
    };
    // Runs on restore, not on every edit — re-checking after each quantity tap
    // would hammer Shopify for no benefit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === newItem.id);
      if (existingIndex > -1) {
        // Replace the entry rather than mutating it in place — the old code
        // edited an object still referenced by prevCart.
        return prevCart.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [...prevCart, { ...newItem, quantity }];
    });
    setIsOpen(true); // Automatically slide open cart drawer when item is added
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const removeUnavailable = () => {
    setCart((prevCart) => prevCart.filter((item) => !item.unavailable));
  };

  const checkout = async () => {
    if (cart.length === 0) return;

    const blocked = cart.filter((item) => item.unavailable);
    if (blocked.length > 0) {
      toast.error("Some items are no longer available", {
        description: `Remove ${blocked.map((i) => i.title).join(", ")} to continue.`,
        action: { label: "Remove them", onClick: removeUnavailable },
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const lines = cart.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
      }));
      const checkoutUrl = await createCartCheckoutUrl(lines);
      window.location.href = checkoutUrl;
    } catch (e) {
      console.error("Checkout redirection failed:", e);
      toast.error("We couldn't start checkout", {
        description:
          e instanceof Error && e.message
            ? e.message
            : "Please try again in a moment — your cart is saved.",
      });
      setIsCheckingOut(false);
    }
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => (item.unavailable ? total : total + item.priceNumeric * item.quantity),
    0,
  );
  const hasUnavailable = cart.some((item) => item.unavailable);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isCheckingOut,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        removeUnavailable,
        checkout,
        cartCount,
        cartTotal,
        hasUnavailable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
