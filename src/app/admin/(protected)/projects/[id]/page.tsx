"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Service { id: number; name: string; }
interface Project {
  id: number; title: string; slug: string; status: string; featured: number;
  service_id: number | null; cover_media_id: number | null;
  client: string | null; industry: string | null;
  short_description: string | null; challenge: string | null; solution: string | null; result: string | null;
  services_provided: string | null; display_order: number;
  seo_title: string | null; seo_description: string | null;
}
interface MediaItem { id: number; storage_path: string; thumb_path: string | null; alt_text: string | null; mime_type: string; }

export default function AdminProjectEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tab, setTab] = useState<"details" | "gallery" | "seo">("details");
  const [uploadingMedia, setUploadingMedia] = useState(false);
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
      setProject((p) => (p ? { ...p, cover_media_id: data.media.id } : p));
      showToast("Cover image uploaded. Click 'Save' to apply.");
    } else {
      showToast(data.error || "Upload failed.");
    }
  }

  function setAsCover(mediaId: number) {
    setProject((p) => (p ? { ...p, cover_media_id: mediaId } : p));
    showToast("Selected as Cover Image. Click 'Save' to apply.");
  }

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/projects/${id}`).then((r) => r.json()),
      fetch("/api/admin/services").then((r) => r.json()),
    ]).then(([projData, svcData]) => {
      setProject(projData.project);
      setGallery((projData.media || []).map((m: { media_id: number | null; storage_path: string; thumb_path: string | null; alt_text: string | null; mime_type: string; }) => m));
      setServices(svcData.services || []);
      setLoading(false);
    });
  }, [id]);

  async function saveProject() {
    if (!project) return;
    setSaving(true);
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    const data = await res.json();
    if (data.success) showToast("Project saved.");
    else showToast(data.error || "Save failed.");
    setSaving(false);
  }

  async function changeStatus(action: "publish" | "unpublish" | "trash") {
    if (action === "trash" && !confirm("Move to trash?")) return;
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (action === "trash") router.push("/admin/projects");
    else showToast(action === "publish" ? "Published!" : "Unpublished.");
    if (project) setProject({ ...project, status: action === "publish" ? "published" : action === "unpublish" ? "draft" : "trashed" });
  }

  async function uploadImage(file: File) {
    setUploadingMedia(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingMedia(false);
    if (data.success) {
      // Add to gallery
      await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ media: [...gallery.map((m) => ({ media_id: (m as { media_id?: number }).media_id || m.id, type: "image" })), { media_id: data.media.id, type: "image" }] }),
      });
      showToast("Image uploaded and added to gallery.");
      // Refresh gallery
      const projRes = await fetch(`/api/admin/projects/${id}`);
      const projData = await projRes.json();
      setGallery(projData.media || []);
    } else {
      showToast(data.error || "Upload failed.");
    }
  }

  if (loading) return <div style={{ color: "var(--text-muted)" }}>Loading...</div>;
  if (!project) return <div style={{ color: "var(--danger)" }}>Project not found.</div>;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-xl)" }}>
        <div>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", marginBottom: 4, fontSize: "var(--text-sm)" }}>← Back</button>
          <h2 style={{ marginBottom: 4 }}>{project.title}</h2>
          <span className={`badge ${project.status === "published" ? "badge-success" : project.status === "draft" ? "badge-warning" : "badge-danger"}`}>
            {project.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <a href={`/portfolio/${project.slug}`} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">View ↗</a>
          {project.status === "draft" && (
            <button onClick={() => changeStatus("publish")} className="btn btn-outline btn-sm" style={{ color: "var(--success)", borderColor: "var(--success)" }}>Publish</button>
          )}
          {project.status === "published" && (
            <button onClick={() => changeStatus("unpublish")} className="btn btn-outline btn-sm" style={{ color: "var(--warning)", borderColor: "var(--warning)" }}>Unpublish</button>
          )}
          {project.status !== "trashed" && (
            <button onClick={() => changeStatus("trash")} className="btn btn-ghost btn-sm btn-danger">Trash</button>
          )}
          <button onClick={saveProject} disabled={saving} className="btn btn-primary btn-sm">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: "var(--space-xl)", borderBottom: "1px solid var(--bg-border)" }}>
        {(["details", "gallery", "seo"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "10px 20px", background: "none", border: "none",
            borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
            color: tab === t ? "var(--accent)" : "var(--text-secondary)",
            fontFamily: "Space Grotesk", fontWeight: 600, fontSize: "var(--text-sm)", cursor: "pointer", marginBottom: "-1px",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Details tab */}
      {tab === "details" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          {/* Cover Image Section */}
          <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-md)", padding: "var(--space-md)" }}>
            <label className="form-label" style={{ marginBottom: "var(--space-sm)" }}>Project Cover Image (Thumbnail / Card Banner)</label>
            <div style={{ display: "flex", gap: "var(--space-md)", alignItems: "center" }}>
              {project.cover_media_id ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/media/${project.cover_media_id}?size=thumb`}
                  alt="Project Cover"
                  style={{ width: 100, height: 70, objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1.5px solid var(--accent)" }}
                />
              ) : (
                <div style={{ width: 100, height: 70, background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 24, border: "1px dashed var(--bg-border)" }}>
                  🖼️
                </div>
              )}
              <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="file"
                  accept="image/*"
                  id="project-cover-upload"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await uploadCover(file);
                    e.target.value = "";
                  }}
                />
                <label htmlFor="project-cover-upload" className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
                  {uploadingCover ? "Uploading..." : project.cover_media_id ? "Change Cover Image" : "Upload Cover Image"}
                </label>
                {project.cover_media_id && (
                  <button
                    type="button"
                    onClick={() => setProject((p) => p ? { ...p, cover_media_id: null } : p)}
                    className="btn btn-ghost btn-sm btn-danger"
                  >
                    Remove Cover
                  </button>
                )}
                <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Or choose from Gallery tab</span>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Title</label>
              <input className="form-input" value={project.title} onChange={(e) => setProject((p) => p ? { ...p, title: e.target.value } : p)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Slug</label>
              <input className="form-input" value={project.slug} onChange={(e) => setProject((p) => p ? { ...p, slug: e.target.value } : p)} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Service Category</label>
              <select className="form-select" value={project.service_id || ""} onChange={(e) => setProject((p) => p ? { ...p, service_id: e.target.value ? parseInt(e.target.value) : null } : p)}>
                <option value="">— None —</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Client</label>
              <input className="form-input" value={project.client || ""} onChange={(e) => setProject((p) => p ? { ...p, client: e.target.value } : p)} placeholder="Client name" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Industry</label>
              <input className="form-input" value={project.industry || ""} onChange={(e) => setProject((p) => p ? { ...p, industry: e.target.value } : p)} placeholder="e.g. Food & Beverage" />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Short Description</label>
            <textarea className="form-textarea" rows={2} value={project.short_description || ""} onChange={(e) => setProject((p) => p ? { ...p, short_description: e.target.value } : p)} placeholder="Brief summary shown on cards" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-md)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">The Challenge</label>
              <textarea className="form-textarea" rows={4} value={project.challenge || ""} onChange={(e) => setProject((p) => p ? { ...p, challenge: e.target.value } : p)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">The Solution</label>
              <textarea className="form-textarea" rows={4} value={project.solution || ""} onChange={(e) => setProject((p) => p ? { ...p, solution: e.target.value } : p)} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">The Result</label>
              <textarea className="form-textarea" rows={4} value={project.result || ""} onChange={(e) => setProject((p) => p ? { ...p, result: e.target.value } : p)} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Services Provided</label>
              <input className="form-input" value={project.services_provided || ""} onChange={(e) => setProject((p) => p ? { ...p, services_provided: e.target.value } : p)} placeholder="Logo Design, Brand Guide, etc." />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Display Order</label>
              <input type="number" className="form-input" value={project.display_order} onChange={(e) => setProject((p) => p ? { ...p, display_order: parseInt(e.target.value) } : p)} />
            </div>
          </div>
          <label style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" checked={!!project.featured} onChange={(e) => setProject((p) => p ? { ...p, featured: e.target.checked ? 1 : 0 } : p)} />
            <span style={{ fontSize: "var(--text-sm)" }}>⭐ Featured on homepage</span>
          </label>
          <button onClick={saveProject} disabled={saving} className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
            {saving ? "Saving..." : "Save Details"}
          </button>
        </div>
      )}

      {/* Gallery tab */}
      {tab === "gallery" && (
        <div>
          <div style={{ marginBottom: "var(--space-lg)" }}>
            <h3 style={{ fontSize: "var(--text-base)", marginBottom: "var(--space-sm)" }}>Project Gallery</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Images appear in the project detail lightbox in display order.</p>
          </div>

          {/* Upload */}
          <div style={{ border: "2px dashed var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-xl)", textAlign: "center", marginBottom: "var(--space-xl)", position: "relative" }}
            onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
            onDragLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bg-border)"; }}
            onDrop={async (e) => {
              e.preventDefault();
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bg-border)";
              const file = e.dataTransfer.files[0];
              if (file) await uploadImage(file);
            }}>
            <div style={{ fontSize: 36, marginBottom: "var(--space-sm)", opacity: 0.4 }}>📸</div>
            <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-md)" }}>Drag & drop images here, or click to upload</p>
            <input type="file" accept="image/*" multiple style={{ display: "none" }} id="gallery-upload"
              onChange={async (e) => { for (const f of Array.from(e.target.files || [])) { await uploadImage(f); } (e.target as HTMLInputElement).value = ""; }} />
            <label htmlFor="gallery-upload" className="btn btn-outline btn-sm" style={{ cursor: "pointer" }}>
              {uploadingMedia ? "Uploading..." : "Choose Files"}
            </label>
          </div>

          {/* Gallery grid */}
          {gallery.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🖼️</div>
              <p className="empty-state-desc">No gallery images yet. Upload some above.</p>
            </div>
          ) : (
            <div className="media-grid">
              {gallery.map((item, i) => {
                const mediaId = (item as { media_id?: number }).media_id || item.id;
                const isCover = project.cover_media_id === mediaId;
                return (
                  <div key={i} className="media-item" style={{ position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/media/${mediaId}?size=thumb`} alt={item.alt_text || ""} />
                    <div style={{ position: "absolute", bottom: 6, left: 6, right: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {isCover ? (
                        <span style={{ fontSize: 10, background: "var(--accent)", color: "#000", fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                          ✓ Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAsCover(mediaId)}
                          style={{ fontSize: 10, background: "rgba(7,7,9,0.85)", color: "var(--accent)", border: "1px solid var(--accent)", padding: "2px 6px", borderRadius: 4, cursor: "pointer" }}
                        >
                          Set Cover
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SEO tab */}
      {tab === "seo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="seo-title">SEO Title</label>
            <input id="seo-title" className="form-input" value={project.seo_title || ""} onChange={(e) => setProject((p) => p ? { ...p, seo_title: e.target.value } : p)} placeholder={`${project.title} | Md Sakhawat Hossain`} />
            <span className="form-hint">Leave blank to use default template</span>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="seo-desc">Meta Description</label>
            <textarea id="seo-desc" className="form-textarea" rows={3} value={project.seo_description || ""} onChange={(e) => setProject((p) => p ? { ...p, seo_description: e.target.value } : p)} placeholder="150-160 characters" />
            <span className="form-hint">{(project.seo_description || "").length} / 160 characters</span>
          </div>
          <button onClick={saveProject} disabled={saving} className="btn btn-primary btn-sm" style={{ alignSelf: "flex-start" }}>
            {saving ? "Saving..." : "Save SEO"}
          </button>
        </div>
      )}

      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </div>
  );
}
