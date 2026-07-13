"use client";

import { useState } from "react";

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    const cart = JSON.parse(localStorage.getItem("tokidoki_cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        sizeMl: product.sizeMl,
        qty: 1,
      });
    }

    localStorage.setItem("tokidoki_cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (outOfStock) {
    return (
      <button
        disabled
        className="w-full sm:w-auto px-8 py-3 rounded-[var(--radius-pill)] bg-[var(--color-surfaceMuted)] text-[var(--color-textMuted)] text-sm cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full sm:w-auto px-8 py-3 rounded-[var(--radius-pill)] bg-[var(--color-primary)] text-[var(--color-textInverse)] text-sm"
    >
      {added ? "Added ✓" : "Add to Cart"}
    </button>
  );
}