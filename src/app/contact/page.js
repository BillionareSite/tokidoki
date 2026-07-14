"use client";

import { useState } from "react";
import config from "@/lib/config";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSending(false);
    if (res.ok) {
      setSent(true);
      setForm({ name: "", email: "", whatsapp: "", subject: "", message: "" });
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm";

  return (
    <div className="px-4 sm:px-6 py-8 sm:py-12 max-w-lg mx-auto">
      <h1 className="text-2xl sm:text-3xl mb-2">Contact Us</h1>
      <p className="text-sm text-[var(--color-textMuted)] mb-6">
        Reach us at {config.contactEmail} or {config.supportPhone}, or send a message below.
      </p>

      {sent ? (
        <p className="text-sm text-[var(--color-accent)]">Thanks — we've received your message and will get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className={inputClass} placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={inputClass} type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={inputClass} placeholder="WhatsApp (optional)" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          <input className={inputClass} placeholder="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          <textarea className={inputClass} rows={4} placeholder="Your message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit" disabled={sending} className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm">
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}