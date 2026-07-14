"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminHomePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  const cards = [
    { label: "Total Products", value: stats?.products, href: "/admin/products", color: "var(--color-accent)" },
    { label: "Total Orders", value: stats?.orders, href: "/admin/orders", color: "var(--color-success)" },
    { label: "Pending Cancellations", value: stats?.pendingCancellations, href: "/admin/orders", color: "var(--color-error)" },
    { label: "Open Support Tickets", value: stats?.openTickets, href: "/admin/tickets", color: "var(--color-warning)" },
  ];

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="block border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 sm:p-5">
            <p className="text-2xl sm:text-3xl mb-1" style={{ color: c.color }}>
              {c.value ?? "—"}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-textMuted)]">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}