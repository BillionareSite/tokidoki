"use client";

import { useEffect, useState } from "react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: "", description: "", type: "percentage", value: "", maxDiscount: "", minCartValue: "", totalLimit: "", expiryDate: "" });
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", description: "", type: "percentage", value: "", maxDiscount: "", minCartValue: "", totalLimit: "", expiryDate: "" });
    load();
  }

  async function toggleActive(id, isActive) {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    load();
  }

  const inputClass = "px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm";

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl mb-6">Coupons</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4">
        <input className={inputClass} placeholder="Code (e.g. WELCOME10)" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="percentage">Percentage %</option>
          <option value="flat">Flat ₹ amount</option>
        </select>
        <input className={inputClass} placeholder="Value" type="number" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        <input className={inputClass} placeholder="Max discount ₹ (percentage only)" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
        <input className={inputClass} placeholder="Min cart value ₹" type="number" value={form.minCartValue} onChange={(e) => setForm({ ...form, minCartValue: e.target.value })} />
        <input className={inputClass} placeholder="Total usage limit (0 = unlimited)" type="number" value={form.totalLimit} onChange={(e) => setForm({ ...form, totalLimit: e.target.value })} />
        <input className={inputClass} type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
        <button type="submit" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm sm:col-span-2">
          Create Coupon
        </button>
      </form>

      {loading ? <p className="text-sm text-[var(--color-textMuted)]">Loading...</p> : (
        <div className="space-y-2">
          {coupons.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-3 border border-[var(--color-border)] rounded-[var(--radius-md)] p-3">
              <span className="text-sm font-medium">{c.code}</span>
              <span className="text-xs text-[var(--color-textMuted)]">
                {c.type === "percentage" ? `${c.value}% off` : `₹${c.value} off`} · Used {c.totalUsed}/{c.totalLimit || "∞"}
              </span>
              <button onClick={() => toggleActive(c.id, c.isActive)} className={`ml-auto text-xs px-3 py-1.5 rounded-[var(--radius-pill)] border ${c.isActive ? "border-[var(--color-success)] text-[var(--color-success)]" : "border-[var(--color-border)] text-[var(--color-textMuted)]"}`}>
                {c.isActive ? "Active" : "Inactive"}
              </button>
              <button onClick={() => handleDelete(c.id)} className="text-xs px-3 py-1.5 text-[var(--color-error)] border border-[var(--color-error)] rounded-[var(--radius-pill)]">Delete</button>
            </div>
          ))}
          {coupons.length === 0 && <p className="text-sm text-[var(--color-textMuted)]">No coupons yet.</p>}
        </div>
      )}
    </div>
  );
}