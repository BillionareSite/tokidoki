"use client";

import { useEffect, useState } from "react";

export default function AdminTicketsPage() {
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
    <div>
      <h1 className="text-2xl sm:text-3xl mb-6">Support Tickets</h1>
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
    </div>
  );
}