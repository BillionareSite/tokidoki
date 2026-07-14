"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setForm(data.user || {});
        setLoading(false);
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function handleSave(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  }

  if (loading) return null;

  if (!user) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="mb-4 text-[var(--color-textMuted)]">You're not logged in.</p>
        <Link href="/login" className="text-[var(--color-accent)] underline">Log in</Link>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm";

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl">My Profile</h1>
        <button onClick={handleLogout} className="text-xs px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-pill)]">Log Out</button>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        <input className={inputClass} value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
        <input className={inputClass} value={user.email} disabled />
        <input className={inputClass} value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
        <input className={inputClass} value={form.whatsapp || ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="WhatsApp number" />
        <textarea className={inputClass} rows={2} value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" />
        <input className={inputClass} value={form.pincode || ""} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode" />

        <button type="submit" className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm">
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </form>

      <Link href="/orders" className="block text-center mt-6 text-sm text-[var(--color-accent)] underline">
        View My Orders
      </Link>
    </div>
  );
}