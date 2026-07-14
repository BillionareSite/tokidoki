"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "🧴" },
  { href: "/admin/categories", label: "Categories", icon: "🏷️" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/coupons", label: "Coupons", icon: "🎟️" },
  { href: "/admin/tickets", label: "Support Tickets", icon: "💬" },
];

export default function AdminSidebar({ admin }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] min-h-screen p-4">
        <div className="mb-6 px-2">
          <p className="text-lg font-medium">TOKI-DOKI</p>
          <p className="text-xs text-[var(--color-textMuted)]">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm"
              style={{
                background: pathname === l.href ? "var(--color-surfaceMuted)" : "transparent",
                color: pathname === l.href ? "var(--color-text)" : "var(--color-textMuted)",
              }}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-[var(--color-divider)]">
          <p className="text-xs text-[var(--color-textMuted)] mb-2 px-2 truncate">{admin.email}</p>
          <button onClick={handleLogout} className="w-full text-xs px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius-pill)]">
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar + horizontal scroll nav */}
      <div className="md:hidden border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-medium">TOKI-DOKI Admin</p>
          <button onClick={handleLogout} className="text-xs px-3 py-1.5 border border-[var(--color-border)] rounded-[var(--radius-pill)]">
            Log Out
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 px-3 py-1.5 rounded-[var(--radius-pill)] text-xs"
              style={{
                background: pathname === l.href ? "var(--color-primary)" : "var(--color-surfaceMuted)",
                color: pathname === l.href ? "var(--color-textInverse)" : "var(--color-text)",
              }}
            >
              {l.icon} {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}