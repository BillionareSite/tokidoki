"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard({ admin }) {
  const router = useRouter();
  const [tab, setTab] = useState("products");

  async function handleLogout() {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl">Admin Panel</h1>
          <p className="text-xs text-[var(--color-textMuted)]">Logged in as {admin.name || admin.email}</p>
        </div>
        <button onClick={handleLogout} className="text-xs sm:text-sm px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-pill)]">
          Log Out
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-6 border-b border-[var(--color-divider)]">
        {["products", "categories"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 px-4 py-2 text-sm capitalize border-b-2 ${
              tab === t ? "border-[var(--color-accent)] text-[var(--color-text)]" : "border-transparent text-[var(--color-textMuted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "products" && <ProductsTab />}
      {tab === "categories" && <CategoriesTab />}
    </div>
  );
}

function ProductsTab() {
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

function CategoriesTab() {
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
function OrdersTab() {
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
        </div>
      ))}
      {orders.length === 0 && <p className="text-sm text-[var(--color-textMuted)]">No orders yet.</p>}
    </div>
  );
}

function CouponsTab() {
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

function TicketsTab() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyDrafts, setReplyDrafts] = useState({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/tickets");
    const data = await res.json();
    setTickets(data.tickets || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function sendReply(id) {
    await fetch(`/api/admin/tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: replyDrafts[id] || "", status: "resolved" }),
    });
    load();
  }

  if (loading) return <p className="text-sm text-[var(--color-textMuted)]">Loading tickets...</p>;

  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <div key={t.id} className="border border-[var(--color-border)] rounded-[var(--radius-md)] p-4">
          <div className="flex justify-between mb-1">
            <p className="text-sm">{t.subject}</p>
            <span className="text-xs capitalize text-[var(--color-textMuted)]">{t.status}</span>
          </div>
          <p className="text-xs text-[var(--color-textMuted)] mb-2">{t.name} · {t.email}</p>
          <p className="text-sm mb-3">{t.message}</p>
          {t.reply && <p className="text-sm text-[var(--color-accent)] mb-3">Your reply: {t.reply}</p>}
          {t.status !== "resolved" && (
            <div className="flex gap-2">
              <input
                className="flex-1 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm"
                placeholder="Type a reply..."
                value={replyDrafts[t.id] || ""}
                onChange={(e) => setReplyDrafts({ ...replyDrafts, [t.id]: e.target.value })}
              />
              <button onClick={() => sendReply(t.id)} className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-xs shrink-0">Reply</button>
            </div>
          )}
        </div>
      ))}
      {tickets.length === 0 && <p className="text-sm text-[var(--color-textMuted)]">No support tickets yet.</p>}
    </div>
  );
}