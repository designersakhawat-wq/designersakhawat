"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  pricing_mode: string;
  display_order: number;
  visible: number;
  cover_media_id: number | null;
  thumb_path: string | null;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", pricing_mode: "quote_only", visible: true });
  const [saving, setSaving] = useState(false);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  async function fetchServices() {
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data.services || []);
    setLoading(false);
  }

  useEffect(() => { fetchServices(); }, []);

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function createService() {
    if (!form.name || !form.slug) { showToast("Name and slug required."); return; }
    setSaving(true);
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, display_order: services.length }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.success) {
      setShowForm(false);
      setForm({ name: "", slug: "", description: "", pricing_mode: "quote_only", visible: true });
      fetchServices();
      showToast("Service created.");
    } else {
      showToast(data.error || "Failed.");
    }
  }

  async function toggleVisibility(id: number, visible: number) {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...service, visible: !visible }),
    });
    fetchServices();
  }

  async function deleteService(id: number) {
    if (!confirm("Move this service to trash? It can be restored later.")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    fetchServices();
    showToast("Service moved to trash.");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Services</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{services.length} services</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
          {showForm ? "✕ Cancel" : "+ New Service"}
        </button>
      </div>

      {/* New service form */}
      {showForm && (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
          <h3 style={{ marginBottom: "var(--space-lg)", fontSize: "var(--text-lg)" }}>New Service</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required" htmlFor="svc-name">Service Name</label>
              <input id="svc-name" type="text" className="form-input" value={form.name}
                onChange={(e) => { const n = e.target.value; setForm((p) => ({ ...p, name: n, slug: generateSlug(n) })); }}
                placeholder="Logo & Branding"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label required" htmlFor="svc-slug">URL Slug</label>
              <input id="svc-slug" type="text" className="form-input" value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                placeholder="logo-branding"
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
            <label className="form-label" htmlFor="svc-desc">Description</label>
            <textarea id="svc-desc" className="form-textarea" rows={3} value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Brief description of this service..."
            />
          </div>
          <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center", marginBottom: "var(--space-lg)" }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label" htmlFor="svc-pricing">Pricing Mode</label>
              <select id="svc-pricing" className="form-select" value={form.pricing_mode}
                onChange={(e) => setForm((p) => ({ ...p, pricing_mode: e.target.value }))}>
                <option value="quote_only">Quote Only (no prices shown)</option>
                <option value="pricing">Show Pricing Packages</option>
                <option value="both">Show Both Packages + Quote</option>
              </select>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", cursor: "pointer", marginTop: 24 }}>
              <input type="checkbox" checked={form.visible} onChange={(e) => setForm((p) => ({ ...p, visible: e.target.checked }))} />
              <span style={{ fontSize: "var(--text-sm)" }}>Visible on site</span>
            </label>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button onClick={createService} disabled={saving} className="btn btn-primary btn-sm">
              {saving ? "Creating..." : "Create Service"}
            </button>
            <button onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Services table */}
      {loading ? (
        <div style={{ color: "var(--text-muted)", padding: "var(--space-xl)" }}>Loading...</div>
      ) : services.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎨</div>
          <h3 className="empty-state-title">No Services Yet</h3>
          <p className="empty-state-desc">Create your first service to get started.</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm">+ Create Service</button>
        </div>
      ) : (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Slug</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                      {svc.thumb_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`/api/media/${svc.cover_media_id}?size=thumb`} alt="" style={{ width: 40, height: 32, objectFit: "cover", borderRadius: "var(--radius-sm)" }} />
                      ) : (
                        <div style={{ width: 40, height: 32, background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>◈</div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--text-sm)" }}>{svc.name}</div>
                        {svc.description && <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{svc.description}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: "var(--text-xs)", background: "var(--bg-elevated)", padding: "2px 8px", borderRadius: 4 }}>/{svc.slug}</code>
                  </td>
                  <td>
                    <span className={`badge ${svc.pricing_mode === "quote_only" ? "badge-muted" : "badge-accent"}`}>
                      {svc.pricing_mode === "quote_only" ? "Quote Only" : svc.pricing_mode === "pricing" ? "Packages" : "Both"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleVisibility(svc.id, svc.visible)}
                      className={`badge ${svc.visible ? "badge-success" : "badge-muted"}`}
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      {svc.visible ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                      <Link href={`/admin/services/${svc.id}`} className="btn btn-ghost btn-sm">Edit</Link>
                      <a href={`/services/${svc.slug}`} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">↗</a>
                      <button onClick={() => deleteService(svc.id)} className="btn btn-ghost btn-sm btn-danger">Trash</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast toast-success">{toastMsg}</div>
        </div>
      )}
    </div>
  );
}
