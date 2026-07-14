"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "", address: "", pincode: "", email: "" });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("tokidoki_cart") || "[]"));
    fetch("/api/auth/me").then((r) => r.json()).then((data) => {
      if (data.user) {
        setForm((f) => ({
          ...f,
          name: data.user.name || "",
          phone: data.user.phone || "",
          whatsapp: data.user.whatsapp || "",
          address: data.user.address || "",
          pincode: data.user.pincode || "",
          email: data.user.email || "",
        }));
      }
    });
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    setCouponMsg("");
    if (!couponCode) return;
    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDiscount(0);
      setCouponMsg(data.error);
      return;
    }
    setDiscount(data.discount);
    setCouponMsg(`Coupon applied — ₹${data.discount} off`);
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");
    setPlacing(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: cart,
        couponCode: discount > 0 ? couponCode.toUpperCase() : "",
      }),
    });
    const data = await res.json();
    setPlacing(false);

    if (!res.ok) {
      setError(data.error || "Failed to place order");
      return;
    }

    localStorage.removeItem("tokidoki_cart");
    router.push(`/order-confirmation/${data.order.id}`);
  }

  const inputClass = "w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm";

  if (cart.length === 0) {
    return <p className="text-center py-16 text-[var(--color-textMuted)]">Your cart is empty.</p>;
  }

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={handlePlaceOrder} className="space-y-3 order-2 md:order-1">
        <h1 className="text-xl sm:text-2xl mb-2">Delivery Details</h1>
        {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

        <input className={inputClass} placeholder="Full name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className={inputClass} placeholder="Phone number" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className={inputClass} placeholder="WhatsApp number (optional)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
        <input className={inputClass} type="email" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <textarea className={inputClass} rows={3} placeholder="Full delivery address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input className={inputClass} placeholder="Pincode" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />

        <div className="pt-2 border-t border-[var(--color-divider)]">
          <p className="text-sm mb-2">Payment Method</p>
          <div className="px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-accent)] bg-[var(--color-surfaceMuted)] text-sm">
            Cash on Delivery (COD) — only option available right now
          </div>
        </div>

        <button type="submit" disabled={placing} className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm mt-4">
          {placing ? "Placing order..." : `Place Order — ₹${total}`}
        </button>
      </form>

      <div className="order-1 md:order-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 sm:p-6 h-fit">
        <h2 className="text-lg mb-4">Order Summary</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span className="truncate pr-2">{item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}

        <div className="flex gap-2 my-4">
          <input className={inputClass} placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
          <button type="button" onClick={applyCoupon} className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm shrink-0">Apply</button>
        </div>
        {couponMsg && <p className="text-xs text-[var(--color-accent)] mb-3">{couponMsg}</p>}

        <div className="border-t border-[var(--color-divider)] pt-3 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          {discount > 0 && <div className="flex justify-between text-[var(--color-accent)]"><span>Discount</span><span>-₹{discount}</span></div>}
          <div className="flex justify-between text-base pt-2"><span>Total</span><span>₹{total}</span></div>
        </div>
      </div>
    </div>
  );
}