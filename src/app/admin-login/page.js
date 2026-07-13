"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl mb-6 text-center">Admin Login</h1>
        {error && <p className="text-sm text-[var(--color-error)] mb-4 text-center">{error}</p>}

        <label className="block text-xs text-[var(--color-textMuted)] mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm"
        />

        <label className="block text-xs text-[var(--color-textMuted)] mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] text-sm"
        />

        <button type="submit" disabled={loading} className="w-full py-3 bg-[var(--color-primary)] text-[var(--color-textInverse)] rounded-[var(--radius-pill)] text-sm">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}