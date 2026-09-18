"use client";

import { useState, useEffect } from "react";

interface Testimonial {
  id: number; author_name: string; author_role: string | null; company: string | null;
  content: string; rating: number; visible: number; display_order: number;
  project_id: number | null; avatar_media_id: number | null;
}

const STARS = [1, 2, 3, 4, 5];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const emptyForm = { author_name: "", author_role: "", company: "", content: "", rating: 5, visible: true };
  const [form, setForm] = useState(emptyForm);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function fetchTestimonials() {
    setLoading(true);
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    setTestimonials(data.testimonials || []);
    setLoading(false);
  }

  useEffect(() => { fetchTestimonials(); }, []);

  function startEdit(t: Testimonial) {
    setEditId(t.id);
    setForm({ author_name: t.author_name, author_role: t.author_role || "", company: t.company || "", content: t.content, rating: t.rating, visible: !!t.visible });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() { setEditId(null); setForm(emptyForm); setShowForm(false); }

  async function save() {
    if (!form.author_name || !form.content) { showToast("Name and content are required."); return; }
    setSaving(true);
    const url = editId ? `/api/admin/testimonials/${editId}` : "/api/admin/testimonials";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, display_order: testimonials.length }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success || data.id) {
      showToast(editId ? "Updated." : "Testimonial added.");
      resetForm();
      fetchTestimonials();
    } else {
      showToast(data.error || "Failed.");
    }
  }

  async function toggleVisible(t: Testimonial) {
    await fetch(`/api/admin/testimonials/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...t, visible: !t.visible }),
    });
    fetchTestimonials();
  }

  async function deleteTestimonial(id: number) {
    if (!confirm("Delete this testimonial?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    fetchTestimonials();
    showToast("Deleted.");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Testimonials</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{testimonials.length} testimonials</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="btn btn-primary btn-sm">
          {showForm && !editId ? "✕ Cancel" : "+ Add Testimonial"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
          <h3 style={{ marginBottom: "var(--space-lg)", fontSize: "var(--text-base)" }}>{editId ? "Edit Testimonial" : "New Testimonial"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required" htmlFor="t-name">Author Name</label>
              <input id="t-name" className="form-input" value={form.author_name} onChange={(e) => setForm((p) => ({ ...p, author_name: e.target.value }))} placeholder="John Smith" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="t-role">Role / Title</label>
              <input id="t-role" className="form-input" value={form.author_role} onChange={(e) => setForm((p) => ({ ...p, author_role: e.target.value }))} placeholder="CEO" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="t-company">Company</label>
              <input id="t-company" className="form-input" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} placeholder="Acme Corp" />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
            <label className="form-label required" htmlFor="t-content">Testimonial Text</label>
            <textarea id="t-content" className="form-textarea" rows={4} value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="What the client said..." />
          </div>
          <div style={{ display: "flex", gap: "var(--space-xl)", alignItems: "center", marginBottom: "var(--space-lg)" }}>
            <div>
              <div className="form-label" style={{ marginBottom: "var(--space-xs)" }}>Rating</div>
              <div style={{ display: "flex", gap: 4 }}>
                {STARS.map((s) => (
                  <button key={s} onClick={() => setForm((p) => ({ ...p, rating: s }))}
                    style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: s <= form.rating ? "#fbbf24" : "var(--bg-border)" }}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <label style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((p) => ({ ...p, visible: e.target.checked }))} />
              <span style={{ fontSize: "var(--text-sm)" }}>Visible on site</span>
            </label>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-sm">{saving ? "Saving..." : editId ? "Update" : "Add Testimonial"}</button>
            <button onClick={resetForm} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ color: "var(--text-muted)" }}>Loading...</div>
      ) : testimonials.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">⭐</div>
          <h3 className="empty-state-title">No Testimonials Yet</h3>
          <p className="empty-state-desc">Add your first client testimonial.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm">+ Add Testimonial</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {testimonials.map((t) => (
            <div key={t.id} style={{
              background: "var(--bg-surface)", border: "1px solid var(--bg-border)",
              borderRadius: "var(--radius-lg)", padding: "var(--space-lg)",
              display: "flex", gap: "var(--space-lg)", alignItems: "flex-start",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-sm)" }}>
                  <span style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "var(--text-sm)", color: "var(--text-primary)" }}>{t.author_name}</span>
                  {t.author_role && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{t.author_role}{t.company ? ` · ${t.company}` : ""}</span>}
                  <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                    {STARS.map((s) => <span key={s} style={{ fontSize: 14, color: s <= t.rating ? "#fbbf24" : "var(--bg-border)" }}>★</span>)}
                  </div>
                </div>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "100%" }}>{t.content}</p>
              </div>
              <div style={{ display: "flex", gap: "var(--space-xs)", flexShrink: 0 }}>
                <button
                  onClick={() => toggleVisible(t)}
                  className={`badge ${t.visible ? "badge-success" : "badge-muted"}`}
                  style={{ border: "none", cursor: "pointer" }}>
                  {t.visible ? "Visible" : "Hidden"}
                </button>
                <button onClick={() => startEdit(t)} className="btn btn-ghost btn-sm">Edit</button>
                <button onClick={() => deleteTestimonial(t.id)} className="btn btn-ghost btn-sm btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </div>
  );
}
