"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface MediaItem { id: number; thumb_path: string | null; alt_text: string | null; }
interface Package { id?: number; name: string; price: string; currency: string; is_starting_from: boolean; description: string; features: string[]; display_order: number; visible: boolean; }
interface Service { id: number; name: string; slug: string; description: string | null; pricing_mode: string; display_order: number; visible: number; cover_media_id: number | null; }

export default function AdminServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function uploadCover(file: File) {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingCover(false);
    if (data.success) {
      setService((prev) => prev ? { ...prev, cover_media_id: data.media.id } : prev);
      showToast("Cover image uploaded. Click 'Save Service' to apply.");
    } else {
      showToast(data.error || "Upload failed.");
    }
  }

  useEffect(() => {
    fetch(`/api/admin/services/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setService(data.service);
        setPackages(
          (data.packages || []).map((p: Package & { features_json?: string | string[] }) => {
            let feats: string[] = [];
            if (Array.isArray(p.features_json)) {
              feats = p.features_json;
            } else if (typeof p.features_json === "string") {
              try {
                feats = JSON.parse(p.features_json);
              } catch {
                feats = [];
              }
            }
            return {
              ...p,
              price: String(p.price || ""),
              features: feats,
            };
          })
        );
        setLoading(false);
      });
  }, [id]);

  async function saveService() {
    if (!service) return;
    setSaving(true);
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(service),
    });
    const data = await res.json();
    if (data.success) showToast("Service saved.");
    else showToast(data.error || "Save failed.");
    setSaving(false);
  }

  async function savePackages() {
    setSaving(true);
    const res = await fetch(`/api/admin/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packages: packages.map((p, i) => ({ ...p, display_order: i, price: p.price ? parseFloat(p.price) : null })) }),
    });
    const data = await res.json();
    if (data.success) showToast("Packages saved.");
    else showToast(data.error || "Save failed.");
    setSaving(false);
  }

  function addPackage() {
    setPackages((prev) => [...prev, { name: "New Package", price: "", currency: "USD", is_starting_from: false, description: "", features: [], display_order: prev.length, visible: true }]);
  }

  function removePackage(i: number) { setPackages((prev) => prev.filter((_, idx) => idx !== i)); }

  function updatePackage(i: number, key: keyof Package, value: unknown) {
    setPackages((prev) => prev.map((p, idx) => idx === i ? { ...p, [key]: value } : p));
  }

  function addFeature(pkgIdx: number) {
    setPackages((prev) => prev.map((p, i) => i === pkgIdx ? { ...p, features: [...p.features, ""] } : p));
  }

  function updateFeature(pkgIdx: number, featIdx: number, value: string) {
    setPackages((prev) => prev.map((p, i) => i === pkgIdx ? { ...p, features: p.features.map((f, fi) => fi === featIdx ? value : f) } : p));
  }

  function removeFeature(pkgIdx: number, featIdx: number) {
    setPackages((prev) => prev.map((p, i) => i === pkgIdx ? { ...p, features: p.features.filter((_, fi) => fi !== featIdx) } : p));
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading...</div>;
  if (!service) return <div style={{ color: "var(--danger)" }}>Service not found.</div>;

  const showPackages = service.pricing_mode === "pricing" || service.pricing_mode === "both";

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", marginBottom: 4, fontSize: "var(--text-sm)" }}>← Back</button>
          <h2 style={{ marginBottom: 0 }}>Edit Service</h2>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <a href={`/services/${service.slug}`} target="_blank" rel="noopener" className="btn btn-outline btn-sm">View ↗</a>
          <button onClick={saveService} disabled={saving} className="btn btn-primary btn-sm">{saving ? "Saving..." : "Save Service"}</button>
        </div>
      </div>

      {/* Service fields */}
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        <h3 style={{ marginBottom: "var(--space-lg)", fontSize: "var(--text-base)" }}>Service Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="edit-name">Service Name</label>
            <input id="edit-name" className="form-input" value={service.name} onChange={(e) => setService((s) => s ? { ...s, name: e.target.value } : s)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="edit-slug">URL Slug</label>
            <input id="edit-slug" className="form-input" value={service.slug} onChange={(e) => setService((s) => s ? { ...s, slug: e.target.value } : s)} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
          <label className="form-label" htmlFor="edit-desc">Description</label>
          <textarea id="edit-desc" className="form-textarea" rows={3} value={service.description || ""} onChange={(e) => setService((s) => s ? { ...s, description: e.target.value } : s)} />
        </div>

        {/* Cover Image / Banner Section */}
        <div style={{ marginBottom: "var(--space-md)" }}>
          <label className="form-label">Service Banner / Showcase Image</label>
          <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center", background: "var(--bg-elevated)", padding: "var(--space-md)", borderRadius: "var(--radius-md)", border: "1px solid var(--bg-border)" }}>
            {service.cover_media_id ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/media/${service.cover_media_id}?size=thumb`}
                alt="Service Cover"
                style={{ width: 80, height: 50, objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--accent-border)" }}
              />
            ) : (
              <div style={{ width: 80, height: 50, background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 20 }}>
                🖼️
              </div>
            )}
            <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
              <input
                type="file"
                accept="image/*"
                id="service-cover-upload"
                style={{ display: "none" }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await uploadCover(file);
                  e.target.value = "";
                }}
              />
              <label htmlFor="service-cover-upload" className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
                {uploadingCover ? "Uploading..." : service.cover_media_id ? "Change Banner" : "Upload Banner Image"}
              </label>
              {service.cover_media_id && (
                <button
                  type="button"
                  onClick={() => setService((prev) => prev ? { ...prev, cover_media_id: null } : prev)}
                  className="btn btn-ghost btn-sm btn-danger"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-end" }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label" htmlFor="edit-pricing">Pricing Mode</label>
            <select id="edit-pricing" className="form-select" value={service.pricing_mode} onChange={(e) => setService((s) => s ? { ...s, pricing_mode: e.target.value } : s)}>
              <option value="quote_only">Quote Only</option>
              <option value="pricing">Show Pricing Packages</option>
              <option value="both">Both Packages + Quote</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", cursor: "pointer", paddingBottom: 12 }}>
            <input type="checkbox" checked={!!service.visible} onChange={(e) => setService((s) => s ? { ...s, visible: e.target.checked ? 1 : 0 } : s)} />
            <span style={{ fontSize: "var(--text-sm)" }}>Visible</span>
          </label>
          <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
            <label className="form-label" htmlFor="edit-order">Display Order</label>
            <input id="edit-order" type="number" className="form-input" value={service.display_order} onChange={(e) => setService((s) => s ? { ...s, display_order: parseInt(e.target.value) } : s)} />
          </div>
        </div>
      </div>

      {/* Packages */}
      {showPackages && (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
            <h3 style={{ fontSize: "var(--text-base)", margin: 0 }}>Pricing Packages</h3>
            <button onClick={addPackage} className="btn btn-outline btn-sm">+ Add Package</button>
          </div>

          {packages.map((pkg, i) => (
            <div key={i} style={{ border: "1px solid var(--bg-border)", borderRadius: "var(--radius-md)", padding: "var(--space-lg)", marginBottom: "var(--space-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-md)" }}>
                <span style={{ fontWeight: 700, fontFamily: "Space Grotesk", fontSize: "var(--text-sm)" }}>Package {i + 1}</span>
                <button onClick={() => removePackage(i)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "var(--text-sm)" }}>✕ Remove</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor={`pkg-name-${i}`}>Package Name</label>
                  <input id={`pkg-name-${i}`} className="form-input" value={pkg.name} onChange={(e) => updatePackage(i, "name", e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor={`pkg-price-${i}`}>Price (leave blank for custom)</label>
                  <input id={`pkg-price-${i}`} type="number" className="form-input" value={pkg.price} onChange={(e) => updatePackage(i, "price", e.target.value)} placeholder="0" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor={`pkg-currency-${i}`}>Currency</label>
                  <select id={`pkg-currency-${i}`} className="form-select" value={pkg.currency} onChange={(e) => updatePackage(i, "currency", e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="BDT">BDT (৳)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "var(--space-sm)" }}>
                <label className="form-label" htmlFor={`pkg-desc-${i}`}>Description</label>
                <textarea id={`pkg-desc-${i}`} className="form-textarea" rows={2} value={pkg.description} onChange={(e) => updatePackage(i, "description", e.target.value)} />
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--space-xs)", fontFamily: "Space Grotesk", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Features</div>
                {pkg.features.map((feat, fi) => (
                  <div key={fi} style={{ display: "flex", gap: "var(--space-xs)", marginBottom: "var(--space-xs)" }}>
                    <input className="form-input" value={feat} onChange={(e) => updateFeature(i, fi, e.target.value)} placeholder="Feature..." style={{ flex: 1 }} />
                    <button onClick={() => removeFeature(i, fi)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "0 8px" }}>✕</button>
                  </div>
                ))}
                <button onClick={() => addFeature(i)} className="btn btn-ghost btn-sm" style={{ marginTop: "var(--space-xs)" }}>+ Add Feature</button>
              </div>
              <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-sm)" }}>
                <label style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center", cursor: "pointer", fontSize: "var(--text-xs)" }}>
                  <input type="checkbox" checked={pkg.is_starting_from} onChange={(e) => updatePackage(i, "is_starting_from", e.target.checked)} />
                  Starting from
                </label>
                <label style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center", cursor: "pointer", fontSize: "var(--text-xs)" }}>
                  <input type="checkbox" checked={pkg.visible} onChange={(e) => updatePackage(i, "visible", e.target.checked)} />
                  Visible
                </label>
              </div>
            </div>
          ))}

          <button onClick={savePackages} disabled={saving} className="btn btn-outline btn-sm">
            {saving ? "Saving..." : "Save Packages"}
          </button>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className="toast toast-success">{toast}</div>
        </div>
      )}
    </div>
  );
}
