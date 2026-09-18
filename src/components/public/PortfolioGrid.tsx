"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project, Service } from "@/types";

interface PortfolioGridProps {
  projects: (Project & { service_name?: string; service_slug?: string })[];
  services: Service[];
}

export default function PortfolioGrid({ projects, services }: PortfolioGridProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = activeFilter
    ? projects.filter((p) => {
        const svc = p as Project & { service_slug?: string };
        return svc.service_slug === activeFilter;
      })
    : projects;

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
          {filtered.map((project) => {
            const svc = project as Project & { service_name?: string };
            const coverUrl = project.cover_media_id
              ? `/api/media/${project.cover_media_id}?size=medium`
              : null;
            return (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="project-card"
                aria-label={`View ${project.title}`}
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
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
