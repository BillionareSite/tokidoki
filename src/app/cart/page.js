"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("tokidoki_cart") || "[]"));
    setLoaded(true);
  }, []);

  function updateQty(id, qty) {
    const updated = cart
      .map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item))
      .filter((item) => item.qty > 0);
    setCart(updated);
    localStorage.setItem("tokidoki_cart", JSON.stringify(updated));
  }

  function removeItem(id) {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("tokidoki_cart", JSON.stringify(updated));
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!loaded) return null;

  if (cart.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-[var(--color-textMuted)] mb-4">Your cart is empty.</p>
        <Link href="/products" className="text-[var(--color-accent)] underline">
          Browse perfumes
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-[var(--color-divider)] pb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[var(--color-surfaceMuted)] rounded-[var(--radius-md)] overflow-hidden">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base truncate">{item.name}</h3>
              <p className="text-xs text-[var(--color-textMuted)]">{item.sizeMl}ml</p>
              <p className="text-sm text-[var(--color-accent)] mt-1">₹{item.price}</p>

              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 border border-[var(--color-border)] rounded-full text-sm">
                  −
                </button>
                <span className="text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 border border-[var(--color-border)] rounded-full text-sm">
                  +
                </button>
                <button onClick={() => removeItem(item.id)} className="ml-auto text-xs text-[var(--color-error)] underline">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-lg">
        <span>Total</span>
        <span className="text-[var(--color-accent)]">₹{total}</span>
      </div>

      <Link
        href="/checkout"
        className="block text-center mt-6 w-full py-3 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}