"use client";

import { useState, useEffect, useRef } from "react";

interface MediaItem {
  id: number; filename: string; original_name: string; mime_type: string;
  size: number; width: number | null; height: number | null;
  alt_text: string | null; created_at: string;
  usage_count: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [typeFilter, setTypeFilter] = useState<"" | "image" | "video">("");
  const [editAlt, setEditAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const LIMIT = 48;
  const totalPages = Math.ceil(total / LIMIT);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function fetchMedia(pg = 1, type = typeFilter) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), limit: String(LIMIT) });
    if (type) params.set("type", type);
    const res = await fetch(`/api/admin/media?${params}`);
    const data = await res.json();
    setMedia(data.media || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  useEffect(() => { fetchMedia(page, typeFilter); }, [page, typeFilter]);

  const selectedItem = selected !== null ? media.find((m) => m.id === selected) : null;

  useEffect(() => {
    if (selectedItem) setEditAlt(selectedItem.alt_text || "");
  }, [selected, selectedItem]);

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    setUploading(true);
    let done = 0;
    for (const file of arr) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.success) showToast(data.error || "Upload failed.");
      done++;
      setUploadProgress(Math.round((done / arr.length) * 100));
    }
    setUploading(false);
    setUploadProgress(0);
    fetchMedia(1, typeFilter);
    setPage(1);
    showToast(`${arr.length} file${arr.length > 1 ? "s" : ""} uploaded.`);
  }

  async function saveAlt() {
    if (!selected) return;
    await fetch(`/api/admin/media/${selected}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt_text: editAlt }),
    });
    setMedia((prev) => prev.map((m) => m.id === selected ? { ...m, alt_text: editAlt } : m));
    showToast("Alt text saved.");
  }

  async function deleteMedia(id: number) {
    const item = media.find((m) => m.id === id);
    if (!item) return;
    if (item.usage_count > 0) {
      showToast(`Cannot delete — used in ${item.usage_count} place(s).`);
      return;
    }
    if (!confirm("Permanently delete this file? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setSelected(null);
      fetchMedia(page, typeFilter);
      showToast("File deleted.");
    } else {
      showToast(data.error || "Delete failed.");
    }
  }

  function copyUrl(id: number) {
    navigator.clipboard.writeText(`${window.location.origin}/api/media/${id}`);
    showToast("URL copied to clipboard.");
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected !== null ? "1fr 280px" : "1fr", gap: "var(--space-xl)", alignItems: "start" }}>
      {/* Left: media grid */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Media Library</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>{total} files</p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            {/* Type filter */}
            {(["", "image", "video"] as const).map((t) => (
              <button key={t} onClick={() => { setTypeFilter(t); setPage(1); }}
                className={`btn btn-sm ${typeFilter === t ? "btn-primary" : "btn-outline"}`}>
                {t === "" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary btn-sm">
              {uploading ? `Uploading ${uploadProgress}%` : "+ Upload"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }}
              onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); (e.target as HTMLInputElement).value = ""; }} />
          </div>
        </div>

        {/* Drop zone */}
        <div
          ref={dropZoneRef}
          style={{ border: "2px dashed var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", textAlign: "center", marginBottom: "var(--space-lg)", background: "var(--bg-surface)", cursor: "pointer" }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)"; }}
          onDragLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bg-border)"; }}
          onDrop={(e) => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bg-border)"; if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files); }}
        >
          {uploading ? (
            <div>
              <div style={{ marginBottom: "var(--space-sm)", color: "var(--accent)" }}>Uploading... {uploadProgress}%</div>
              <div className="progress-bar" style={{ maxWidth: 200, margin: "0 auto" }}>
                <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)" }}>Drop images here or click to upload</p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ color: "var(--text-muted)" }}>Loading...</div>
        ) : media.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🖼️</div>
            <h3 className="empty-state-title">No Media Yet</h3>
            <p className="empty-state-desc">Upload your first image or video.</p>
          </div>
        ) : (
          <>
            <div className="media-grid">
              {media.map((item) => (
                <div
                  key={item.id}
                  className={`media-item ${selected === item.id ? "selected" : ""}`}
                  onClick={() => setSelected(selected === item.id ? null : item.id)}
                >
                  {item.mime_type.startsWith("image/") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/media/${item.id}?size=thumb`} alt={item.alt_text || ""} loading="lazy" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, background: "var(--bg-elevated)", color: "var(--text-muted)" }}>▶</div>
                  )}
                  <div className="media-item-check">✓</div>
                  {item.usage_count === 0 && (
                    <div style={{ position: "absolute", bottom: 4, right: 4, background: "rgba(239,68,68,0.8)", color: "white", fontSize: 9, padding: "1px 4px", borderRadius: 3 }}>unused</div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", marginTop: "var(--space-xl)" }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline btn-sm">← Prev</button>
                <span style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", display: "flex", alignItems: "center" }}>{page} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-outline btn-sm">Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right: media detail panel */}
      {selected !== null && selectedItem && (
        <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)", position: "sticky", top: 80 }}>
          {/* Preview */}
          <div style={{ width: "100%", aspectRatio: "4/3", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "var(--space-md)" }}>
            {selectedItem.mime_type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/media/${selectedItem.id}?size=medium`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 48, color: "var(--text-muted)" }}>▶</div>
            )}
          </div>

          {/* Info */}
          <div style={{ marginBottom: "var(--space-md)" }}>
            <div style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: "var(--text-sm)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedItem.original_name}</div>
            <div style={{ color: "var(--text-muted)", fontSize: "var(--text-xs)" }}>
              {formatBytes(selectedItem.size)}
              {selectedItem.width && ` · ${selectedItem.width}×${selectedItem.height}`}
              {` · ${selectedItem.mime_type}`}
            </div>
            <div style={{ color: selectedItem.usage_count > 0 ? "var(--success)" : "var(--text-muted)", fontSize: "var(--text-xs)", marginTop: 4 }}>
              {selectedItem.usage_count} usage{selectedItem.usage_count !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Alt text */}
          <div className="form-group" style={{ marginBottom: "var(--space-md)" }}>
            <label className="form-label" htmlFor="media-alt">Alt Text</label>
            <input id="media-alt" className="form-input" value={editAlt} onChange={(e) => setEditAlt(e.target.value)} placeholder="Describe this image..." onBlur={saveAlt} />
            <span className="form-hint">Press Tab or click outside to save</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
            <button onClick={() => copyUrl(selectedItem.id)} className="btn btn-outline btn-sm" style={{ justifyContent: "center" }}>📋 Copy URL</button>
            <button onClick={() => deleteMedia(selectedItem.id)} className="btn btn-danger btn-sm" style={{ justifyContent: "center" }}>🗑 Delete File</button>
            <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }}>✕ Close</button>
          </div>
        </div>
      )}

      {toast && <div className="toast-container"><div className="toast toast-success">{toast}</div></div>}
    </div>
  );
}
