"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function handleCancellation(id, status) {
    await fetch(`/api/admin/cancellations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  if (loading) return <p className="text-sm text-[var(--color-textMuted)]">Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl mb-6">Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
            <div className="flex flex-wrap justify-between gap-2 mb-2">
              <div>
                <p className="text-sm">#{o.orderId} — {o.name}</p>
                <p className="text-xs text-[var(--color-textMuted)]">{o.phone} · {o.address}, {o.pincode}</p>
              </div>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                className="text-xs px-3 py-1.5 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-background)]"
              >
                {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-[var(--color-textMuted)]">
              {o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
            </p>
            <p className="text-sm mt-1">Total: ₹{o.total} {o.discount > 0 && `(₹${o.discount} off via ${o.couponCode})`}</p>

            {o.cancellationRequest && o.cancellationRequest.status === "pending" && (
              <div className="mt-2 p-2 bg-[var(--color-surfaceMuted)] rounded-[var(--radius-sm)] text-xs">
                <p>Cancellation requested: {o.cancellationRequest.reason}</p>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => handleCancellation(o.cancellationRequest.id, "approved")} className="px-3 py-1 bg-[var(--color-error)] text-white rounded-[var(--radius-pill)]">Approve</button>
                  <button onClick={() => handleCancellation(o.cancellationRequest.id, "rejected")} className="px-3 py-1 border border-[var(--color-border)] rounded-[var(--radius-pill)]">Reject</button>
                </div>
              </div>
            )}
            {o.cancellationRequest && o.cancellationRequest.status !== "pending" && (
              <p className="text-xs text-[var(--color-textMuted)] mt-2">
                Cancellation {o.cancellationRequest.status}
              </p>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-sm text-[var(--color-textMuted)]">No orders yet.</p>}
      </div>
    </div>
  );
}