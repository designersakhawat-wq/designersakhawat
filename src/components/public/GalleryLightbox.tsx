"use client";

import { useState, useCallback, useEffect } from "react";
import type { ProjectMediaItem } from "@/types";

interface GalleryLightboxProps {
  items: (ProjectMediaItem & { storage_path?: string; thumb_path?: string; medium_path?: string; alt_text?: string; mime_type?: string; })[];
  projectTitle: string;
}

export default function GalleryLightbox({ items, projectTitle }: GalleryLightboxProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const open = useCallback((i: number) => setLightboxIndex(i), []);
  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, close, prev, next]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;
  const currentImageUrl = currentItem?.media_id
    ? `/api/media/${currentItem.media_id}?size=original`
    : null;
  const currentVideoUrl = currentItem?.video_url;

  return (
    <>
      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "var(--space-sm)",
      }}>
        {items.map((item, i) => {
          const thumbUrl = item.media_id ? `/api/media/${item.media_id}?size=thumb` : null;
          const isVideo = item.type === "video";

          return (
            <button
              key={i}
              onClick={() => open(i)}
              aria-label={`View ${item.alt_text || projectTitle} — image ${i + 1}`}
              style={{
                border: "none",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                aspectRatio: "4/3",
                cursor: "pointer",
                position: "relative",
                padding: 0,
                display: "block",
              }}
            >
              {thumbUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbUrl}
                  alt={item.alt_text || `${projectTitle} — image ${i + 1}`}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 32 }}>
                  {isVideo ? "▶" : "🖼"}
                </div>
              )}

              {/* Video overlay */}
              {isVideo && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.4)",
                }}>
                  <div style={{
                    width: 48, height: 48,
                    background: "rgba(255,255,255,0.9)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--bg-deep)", fontSize: 18,
                  }}>▶</div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={close}
          role="dialog"
          aria-label={`Lightbox — ${projectTitle}`}
          aria-modal="true"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button className="lightbox-close" onClick={close} aria-label="Close lightbox">✕</button>

            {/* Image */}
            {currentImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentImageUrl}
                alt={currentItem?.alt_text || projectTitle}
                className="lightbox-img"
              />
            )}

            {/* Video */}
            {currentVideoUrl && currentItem?.video_type === "youtube" && (
              <div style={{ width: "80vw", maxWidth: 960, aspectRatio: "16/9" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(currentVideoUrl)}?autoplay=1`}
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "var(--radius-md)" }}
                  allow="autoplay; fullscreen"
                  title={projectTitle}
                />
              </div>
            )}

            {currentVideoUrl && currentItem?.video_type === "vimeo" && (
              <div style={{ width: "80vw", maxWidth: 960, aspectRatio: "16/9" }}>
                <iframe
                  src={`https://player.vimeo.com/video/${extractVimeoId(currentVideoUrl)}?autoplay=1`}
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "var(--radius-md)" }}
                  allow="autoplay; fullscreen"
                  title={projectTitle}
                />
              </div>
            )}

            {/* Prev/Next */}
            {items.length > 1 && (
              <>
                <button className="lightbox-btn lightbox-prev" onClick={prev} aria-label="Previous image">‹</button>
                <button className="lightbox-btn lightbox-next" onClick={next} aria-label="Next image">›</button>
              </>
            )}
          </div>

          {/* Counter */}
          {items.length > 1 && (
            <div className="lightbox-counter" aria-live="polite">
              {(lightboxIndex || 0) + 1} / {items.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match?.[1] || url;
}

function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] || url;
}
