"use client";

import React, { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/context/cart-context";
import { X, Minus, Plus, Trash, ShoppingBag, ArrowRight } from "@phosphor-icons/react";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const {
    cart,
    isOpen,
    isCheckingOut,
    closeCart,
    updateQuantity,
    removeFromCart,
    checkout,
    cartTotal,
    cartCount,
    hasUnavailable,
    removeUnavailable,
  } = useCart();

  // Escape closes the drawer. The backdrop was a bare <div onClick>, so a
  // keyboard user had no way out at all.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  // Prevent background scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Container.
          `inert` when closed: it is only slid off-screen, so without this a
          keyboard user tabbing any page walks through invisible quantity
          steppers, remove buttons and the checkout button. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        inert={!isOpen}
        className={`fixed bottom-0 right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--u-navy)] text-[var(--u-bone)] shadow-2xl transition-transform duration-300 ease-in-out border-l border-[var(--u-slate)]/40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--u-slate)]/40 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} className="text-[var(--u-yellow)]" />
            <h2 className="u-fun-head text-xl uppercase tracking-wider text-[var(--u-yellow)]">
              Your Cart
            </h2>
            <span className="u-mono rounded-full bg-[var(--u-yellow)] px-2.5 py-0.5 text-xs font-bold text-[var(--u-navy)]">
              {cartCount}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-1.5 transition-colors hover:bg-[var(--u-slate)]/30 text-[var(--u-bone)]/80 hover:text-[var(--u-bone)]"
            aria-label="Close cart"
          >
            <X size={22} weight="bold" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-10">
              <ShoppingBag size={64} weight="thin" className="mb-4 text-[var(--u-muted)]" />
              <p className="text-lg font-medium text-[var(--u-bone)]/90">Your cart is empty</p>
              <p className="mt-1 text-sm text-[var(--u-muted)]">
                Add some umbrellas to get ready for the monsoon!
              </p>
              <Link
                to="/collections/$handle"
                params={{ handle: "all" }}
                onClick={closeCart}
                className="mt-6 u-mono rounded-full bg-[var(--u-yellow)] px-6 py-2.5 text-xs uppercase tracking-wider font-bold text-[var(--u-navy)] transition-transform active:scale-95 hover:bg-[var(--u-yellow)]/90"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 border-b border-[var(--u-slate)]/20 pb-4 last:border-0 last:pb-0 ${
                  item.unavailable ? "opacity-55" : ""
                }`}
              >
                {/* Product Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-white p-1">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--u-bone)] truncate">
                    {item.title}
                  </h3>
                  {item.unavailable ? (
                    <p className="mt-1 u-mono text-xs text-[#ff6b6b]">
                      No longer available &mdash; remove to check out
                    </p>
                  ) : (
                    <p className="mt-1 u-mono text-xs text-[var(--u-yellow)]">
                      {item.price}
                    </p>
                  )}

                  {/* Quantity & Delete Controls */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-[var(--u-slate)]/55 bg-black/25 px-1.5 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-[var(--u-yellow)] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} weight="bold" />
                      </button>
                      <span className="u-mono px-3 text-xs font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-[var(--u-yellow)] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} weight="bold" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-[var(--u-muted)] hover:text-[#ff4d4f] transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with checkout */}
        {cart.length > 0 && (
          <div className="border-t border-[var(--u-slate)]/40 bg-black/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--u-muted)] uppercase tracking-wider">Subtotal</span>
              <span className="u-mono text-xl font-bold text-[var(--u-yellow)]">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="text-xs text-[var(--u-muted)] text-center">
              Shipping, taxes, and discounts calculated at checkout.
            </p>

            {hasUnavailable && (
              <button
                type="button"
                onClick={removeUnavailable}
                className="u-mono w-full rounded-full border border-[#ff6b6b]/50 py-2.5 text-xs uppercase tracking-widest text-[#ff6b6b] transition-colors hover:bg-[#ff6b6b]/10 cursor-pointer"
              >
                Remove unavailable items
              </button>
            )}

            <button
              type="button"
              onClick={checkout}
              disabled={isCheckingOut || hasUnavailable}
              className="flex w-full items-center justify-center gap-2 u-mono rounded-full bg-[var(--u-yellow)] py-3.5 text-sm uppercase tracking-widest font-bold text-[var(--u-navy)] transition-all hover:bg-[var(--u-yellow)]/95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isCheckingOut ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--u-navy)]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Checkout Now
                  <ArrowRight size={16} weight="bold" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
