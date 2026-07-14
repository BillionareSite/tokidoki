"use client";

import { useEffect, useState } from "react";

export default function AdminProductsPage() {
  const emptyProduct = () => ({
    name: "", description: "", price: "", originalPrice: "", images: "",
    category: "Woody", concentration: "EDP", topNotes: "", middleNotes: "",
    baseNotes: "", sizeMl: "50", gender: "unisex", longevity: "", sillage: "",
    stock: "0", featured: false,
  });

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct());
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  function toArray(str) {
    return str ? str.split(",").map((s) => s.trim()).filter(Boolean) : [];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      images: toArray(form.images),
      topNotes: toArray(form.topNotes),
      middleNotes: toArray(form.middleNotes),
      baseNotes: toArray(form.baseNotes),
    };
    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm(emptyProduct());
    setEditingId(null);
    loadProducts();
  }

  function handleEdit(p) {
    setForm({
      name: p.name, description: p.description, price: String(p.price),
      originalPrice: String(p.originalPrice), images: (p.images || []).join(", "),
      category: p.category, concentration: p.concentration,
      topNotes: (p.topNotes || []).join(", "), middleNotes: (p.middleNotes || []).join(", "),
      baseNotes: (p.baseNotes || []).join(", "), sizeMl: String(p.sizeMl),
      gender: p.gender, longevity: p.longevity, sillage: p.sillage,
      stock: String(p.stock), featured: p.featured,
    });
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  const inputClass = "w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm";

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl mb-6">Products</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 sm:p-6">
        <h2 className="sm:col-span-2 text-lg mb-1">{editingId ? "Edit Product" : "Add New Product"}</h2>
        <input className={inputClass} placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className={inputClass} placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <textarea className={`${inputClass} sm:col-span-2`} placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className={inputClass} placeholder="Original Price (optional)" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
        <input className={inputClass} placeholder="Image URLs, comma separated" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {["Woody", "Floral", "Citrus", "Oud", "Musk"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className={inputClass} value={form.concentration} onChange={(e) => setForm({ ...form, concentration: e.target.value })}>
          {["EDT", "EDP", "Parfum", "Attar"].map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className={inputClass} placeholder="Top notes, comma separated" value={form.topNotes} onChange={(e) => setForm({ ...form, topNotes: e.target.value })} />
        <input className={inputClass} placeholder="Heart notes, comma separated" value={form.middleNotes} onChange={(e) => setForm({ ...form, middleNotes: e.target.value })} />
        <input className={inputClass} placeholder="Base notes, comma separated" value={form.baseNotes} onChange={(e) => setForm({ ...form, baseNotes: e.target.value })} />
        <select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          {["unisex", "men", "women"].map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <input className={inputClass} placeholder="Size (ml)" type="number" value={form.sizeMl} onChange={(e) => setForm({ ...form, sizeMl: e.target.value })} />
        <input className={inputClass} placeholder="Longevity (e.g. 6-8 hours)" value={form.longevity} onChange={(e) => setForm({ ...form, longevity: e.target.value })} />
        <input className={inputClass} placeholder="Sillage (e.g. moderate)" value={form.sillage} onChange={(e) => setForm({ ...form, sillage: e.target.value })} />
        <input className={inputClass} placeholder="Stock quantity" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Featured on homepage
        </label>
        <div className="sm:col-span-2 flex gap-3">
          <button type="submit" className="px-6 py-2 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setForm(emptyProduct()); setEditingId(null); }} className="px-6 py-2 border border-[var(--color-border)] rounded-[var(--radius-pill)] text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-[var(--color-textMuted)]">Loading products...</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-3 border border-[var(--color-border)] rounded-[var(--radius-md)] p-3">
              <div className="w-14 h-14 shrink-0 bg-[var(--color-surfaceMuted)] rounded-[var(--radius-sm)] overflow-hidden">
                {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-[120px]">
                <p className="text-sm">{p.name}</p>
                <p className="text-xs text-[var(--color-textMuted)]">₹{p.price} · Stock: {p.stock} {p.featured && "· Featured"}</p>
              </div>
              <button onClick={() => handleEdit(p)} className="text-xs px-3 py-1.5 border border-[var(--color-border)] rounded-[var(--radius-pill)]">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-xs px-3 py-1.5 text-[var(--color-error)] border border-[var(--color-error)] rounded-[var(--radius-pill)]">Delete</button>
            </div>
          ))}
          {products.length === 0 && <p className="text-sm text-[var(--color-textMuted)]">No products yet.</p>}
        </div>
      )}
    </div>
  );
}