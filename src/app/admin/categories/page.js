"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", icon: "🌸", sortOrder: "0" });
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  }

  useEffect(() => { loadCategories(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", icon: "🌸", sortOrder: "0" });
    loadCategories();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  const inputClass = "px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm";

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl mb-6">Categories</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4">
        <input className={inputClass} placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className={`${inputClass} w-20`} placeholder="Icon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        <input className={`${inputClass} w-24`} placeholder="Order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
        <button type="submit" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm">
          Add Category
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-[var(--color-textMuted)]">Loading categories...</p>
      ) : (
        <div className="space-y-2">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-3 border border-[var(--color-border)] rounded-[var(--radius-md)] p-3">
              <span className="text-xl">{c.icon}</span>
              <span className="flex-1 text-sm">{c.name}</span>
              <button onClick={() => handleDelete(c.id)} className="text-xs px-3 py-1.5 text-[var(--color-error)] border border-[var(--color-error)] rounded-[var(--radius-pill)]">Delete</button>
            </div>
          ))}
          {categories.length === 0 && <p className="text-sm text-[var(--color-textMuted)]">No categories yet.</p>}
        </div>
      )}
    </div>
  );
}