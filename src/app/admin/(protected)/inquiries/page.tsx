"use client";

import { useState, useEffect } from "react";

interface Inquiry {
  id: number; name: string; email: string; service: string | null;
  budget: string | null; message: string; read_at: string | null; created_at: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function fetchInquiries() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (filter === "unread") params.set("unread", "true");
    const res = await fetch(`/api/admin/inquiries?${params}`);
    const data = await res.json();
    setInquiries(data.inquiries || []);
    setTotal(data.total || 0);
    setUnreadCount(data.unreadCount || 0);
    setLoading(false);
  }

  useEffect(() => { fetchInquiries(); }, [page, filter]);

  async function markRead(id: number) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "read" }),
    });
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, read_at: new Date().toISOString() } : i));
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function deleteInquiry(id: number) {
    if (!confirm("Delete this inquiry?")) return;
    await fetch("/api/admin/inquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    showToast("Inquiry deleted.");
  }

  function openInquiry(inq: Inquiry) {
    setExpanded(expanded === inq.id ? null : inq.id);
    if (!inq.read_at) markRead(inq.id);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Inquiries</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>
            {total} total
            {unreadCount > 0 && <span style={{ color: "var(--accent)", marginLeft: 8, fontWeight: 700 }}>• {unreadCount} unread</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-xs)" }}>
          {(["all", "unread"] as const).map((f) => (
            <button key={f} onClick={() => { setFilter(f); setPage(1); }}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline"}`}>
              {f === "all" ? "All" : `Unread (${unreadCount})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)" }}>Loading...</div>
      ) : inquiries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✉️</div>
          <h3 className="empty-state-title">No Inquiries{filter === "unread" ? " Unread" : ""}</h3>
          <p className="empty-state-desc">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {inquiries.map((inq) => (
            <div key={inq.id} style={{
              background: "var(--bg-surface)", border: "1px solid",
              borderColor: inq.read_at ? "var(--bg-border)" : "var(--accent-border)",
              borderRadius: "var(--radius-lg)", overflow: "hidden",
              transition: "border-color 0.2s",
            }}>
              {/* Header row */}
              <button
                onClick={() => openInquiry(inq)}
                style={{ width: "100%", background: "none", border: "none", padding: "var(--space-md) var(--space-lg)", cursor: "pointer", display: "flex", alignItems: "center", gap: "var(--space-md)", textAlign: "left" }}
              >
                <div style={{ width: 8, height: 8, background: inq.read_at ? "var(--text-muted)" : "var(--accent)", borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
                    <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>{inq.name}</span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{inq.email}</span>
                    {inq.service && <span className="badge badge-muted" style={{ fontSize: 10 }}>{inq.service}</span>}
                    {inq.budget && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Budget: {inq.budget}</span>}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginTop: 2 }}>
                    {new Date(inq.created_at).toLocaleString()} · {inq.read_at ? "Read" : "Unread"}
                  </div>
                </div>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{expanded === inq.id ? "▲" : "▼"}</span>
              </button>

              {/* Expanded body */}
              {expanded === inq.id && (
                <div style={{ padding: "0 var(--space-lg) var(--space-lg)", borderTop: "1px solid var(--bg-border)" }}>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginTop: "var(--space-md)", whiteSpace: "pre-wrap", maxWidth: "100%" }}>{inq.message}</p>
                  <div style={{ display: "flex", gap: "var(--space-sm)", marginTop: "var(--space-md)" }}>
                    <a href={`mailto:${inq.email}?subject=Re: ${inq.service || "Your inquiry"}`} className="btn btn-primary btn-sm">
                      ✉️ Reply
                    </a>
                    <a href={`https://wa.me/${inq.email.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener" className="btn btn-outline btn-sm">💬 WhatsApp</a>
                    <button onClick={() => deleteInquiry(inq.id)} className="btn btn-ghost btn-sm btn-danger">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </div>
  );
}
