"use client";

import { useState } from "react";
import type { Project, Service } from "@/types";
import CleanPortfolioLightbox, { LightboxItem } from "./CleanPortfolioLightbox";

interface PortfolioGridProps {
  projects: (Project & { service_name?: string; service_slug?: string })[];
  services: Service[];
}

export default function PortfolioGrid({ projects, services }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(null);

  const filtered = activeFilter
    ? projects.filter((p) => {
        const svc = p as Project & { service_slug?: string };
        return svc.service_slug === activeFilter;
      })
    : projects;

  const lightboxItems: LightboxItem[] = filtered.map((p) => {
    const isVid = (p as unknown as { service_name?: string }).service_name?.toLowerCase().includes("video") || Boolean((p as unknown as { video_url?: string }).video_url);
    const coverUrl = p.cover_media_id
      ? `/api/media/${p.cover_media_id}?size=large`
      : `/images/projects/project-${((p.id || 1) % 8) + 1}.webp`;
    return {
      id: p.id,
      image: coverUrl,
      videoUrl: (p as unknown as { video_url?: string }).video_url || (isVid ? "https://www.youtube.com/watch?v=EngW7tLk6R8" : null),
      isVideo: isVid,
    };
  });

  return (
    <div>
      {/* Filter tabs */}
      {services.length > 1 && (
        <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-xl)", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveFilter(null)}
            className={`btn btn-sm ${!activeFilter ? "btn-primary" : "btn-outline"}`}
          >
            All Work
          </button>
          {services.map((svc) => (
            <button
              key={svc.id}
              onClick={() => setActiveFilter(svc.slug)}
              className={`btn btn-sm ${activeFilter === svc.slug ? "btn-primary" : "btn-outline"}`}
            >
              {svc.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎨</div>
          <h2 className="empty-state-title">No Projects Yet</h2>
          <p className="empty-state-desc">Check back soon — new work is always in progress.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((project, idx) => {
            const svc = project as Project & { service_name?: string };
            const coverUrl = project.cover_media_id
              ? `/api/media/${project.cover_media_id}?size=medium`
              : null;
            return (
              <button
                type="button"
                key={project.id}
                onClick={() => setActiveItemIdx(idx)}
                className="project-card"
                aria-label={`Open ${project.title}`}
                style={{ textAlign: "left", cursor: "pointer", border: "none", background: "none", padding: 0 }}
              >
                <div className="project-card-image">
                  {coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverUrl} alt={project.title} loading="lazy" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--bg-elevated), var(--bg-hover))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 40, opacity: 0.3 }}>◈</span>
                    </div>
                  )}
                  <div className="project-card-overlay" />
                  {svc.service_name && (
                    <div className="project-card-category">
                      <span className="badge badge-accent">{svc.service_name}</span>
                    </div>
                  )}
                </div>
                <div className="project-card-body">
                  <h3 className="project-card-title">{project.title}</h3>
                  {project.short_description && (
                    <p className="project-card-desc" style={{ WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {project.short_description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Clean Lightbox Modal */}
      <CleanPortfolioLightbox
        items={lightboxItems}
        currentIndex={activeItemIdx}
        onClose={() => setActiveItemIdx(null)}
        onNavigate={(idx) => setActiveItemIdx(idx)}
      />
    </div>
  );
}
