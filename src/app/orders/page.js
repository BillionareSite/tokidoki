"use client";

import { useState } from "react";

export default function OrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLookup(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  async function requestCancellation(orderId) {
    const reason = prompt("Reason for cancellation:");
    if (!reason) return;
    const res = await fetch(`/api/orders/${orderId}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      alert("Cancellation request submitted.");
      handleLookup({ preventDefault: () => {} });
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  const statusColors = {
    pending: "var(--color-warning)", confirmed: "var(--color-accent)",
    shipped: "var(--color-accent)", delivered: "var(--color-success)", cancelled: "var(--color-error)",
  };

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl mb-6">Track Your Orders</h1>

      <form onSubmit={handleLookup} className="flex gap-2 mb-8">
        <input
          className="flex-1 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm shrink-0">
          {loading ? "..." : "Find Orders"}
        </button>
      </form>

      {orders && orders.length === 0 && <p className="text-sm text-[var(--color-textMuted)]">No orders found for this number.</p>}

      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm">#{order.orderId}</p>
                <p className="text-xs text-[var(--color-textMuted)]">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-[var(--radius-pill)] capitalize" style={{ background: statusColors[order.status], color: "#fff" }}>
                {order.status}
              </span>
            </div>
            {order.items.map((item, i) => (
              <p key={i} className="text-xs text-[var(--color-textMuted)]">{item.name} × {item.qty}</p>
            ))}
            <p className="text-sm mt-2">Total: ₹{order.total}</p>

            {!order.cancellationRequest && ["pending", "confirmed"].includes(order.status) && (
              <button onClick={() => requestCancellation(order.id)} className="text-xs text-[var(--color-error)] underline mt-2">
                Request Cancellation
              </button>
            )}
            {order.cancellationRequest && (
              <p className="text-xs text-[var(--color-textMuted)] mt-2">
                Cancellation request: {order.cancellationRequest.status}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}