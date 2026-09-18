"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";
import CleanPortfolioLightbox, { LightboxItem } from "./CleanPortfolioLightbox";

interface ProjectsSectionProps {
  projects: Project[];
  title?: string;
  label?: string;
  showViewAll?: boolean;
}

export default function ProjectsSection({
  projects,
  title = "Featured Work",
  label = "Portfolio",
  showViewAll = true,
}: ProjectsSectionProps) {
  const [activeItemIdx, setActiveItemIdx] = useState<number | null>(null);

  const fallbackProjects = [
    { id: 1, title: "Aura Tech — Brand Guidelines", slug: "aura-tech-brand-identity", cover: "/images/projects/project-1.webp", service: "Logo & Branding", videoUrl: null, isVideo: false },
    { id: 2, title: "Maison Luxe — Perfume Packaging", slug: "maison-luxe-packaging", cover: "/images/projects/project-2.webp", service: "Packaging Design", videoUrl: null, isVideo: false },
    { id: 3, title: "Apex Athletics — Social Campaign", slug: "apex-athletics-social-campaign", cover: "/images/projects/project-3.webp", service: "Social Media Design", videoUrl: null, isVideo: false },
    { id: 4, title: "Zenith AI — Dynamic Brand Video", slug: "zenith-ai-brand-video", cover: "/images/projects/project-4.webp", service: "AI Video Editing", videoUrl: "https://www.youtube.com/watch?v=EngW7tLk6R8", isVideo: true },
    { id: 5, title: "Cyber Shield — Cyber Security Visual Identity", slug: "cyber-shield-identity", cover: "/images/projects/project-5.webp", service: "Brand Identity", videoUrl: null, isVideo: false },
    { id: 6, title: "Botany Organics — Luxury Bottle Label", slug: "botany-organics-label", cover: "/images/projects/project-6.webp", service: "Packaging Design", videoUrl: null, isVideo: false },
    { id: 7, title: "Velocity Gym — High-Energy Social Creative Kit", slug: "velocity-gym-social", cover: "/images/projects/project-7.webp", service: "Social Media Design", videoUrl: null, isVideo: false },
    { id: 8, title: "Nexus Studio — Kinetic Brand Motion", slug: "nexus-studio-motion", cover: "/images/projects/project-8.webp", service: "AI Video Editing", videoUrl: "https://www.youtube.com/watch?v=EngW7tLk6R8", isVideo: true },
  ];

  // Map input projects or use fallbacks
  const mappedProjects = (projects && projects.length > 0 ? projects : []).map((p, i) => {
    const isVid = (p as unknown as { service_name?: string }).service_name?.toLowerCase().includes("video") || Boolean((p as unknown as { video_url?: string }).video_url);
    return {
      id: p.id || i + 1,
      title: p.title,
      slug: p.slug,
      cover: p.cover_media_id
        ? `/api/media/${p.cover_media_id}?size=medium`
        : `/images/projects/project-${(i % 8) + 1}.webp`,
      service: (p as unknown as { service_name?: string }).service_name || "Creative Design",
      videoUrl: (p as unknown as { video_url?: string }).video_url || (isVid ? "https://www.youtube.com/watch?v=EngW7tLk6R8" : null),
      isVideo: isVid,
    };
  });

  const allItems = mappedProjects.length >= 6 ? mappedProjects : fallbackProjects;

  const lightboxItems: LightboxItem[] = allItems.map((item) => ({
    id: item.id,
    image: item.cover,
    videoUrl: item.videoUrl,
    isVideo: item.isVideo,
  }));

  const handleOpenLightbox = (item: (typeof allItems)[0]) => {
    const idx = allItems.findIndex((p) => p.id === item.id);
    setActiveItemIdx(idx >= 0 ? idx : 0);
  };

  // Split into Road 1 and Road 2
  const road1Raw = allItems.slice(0, Math.ceil(allItems.length / 2));
  const road2Raw = allItems.slice(Math.ceil(allItems.length / 2));

  // Build sets with at least 8 items each to guarantee screen coverage
  const buildLane = (arr: typeof allItems) => {
    const res: typeof allItems = [];
    while (res.length < 8) {
      for (const item of arr) {
        res.push(item);
        if (res.length >= 8) break;
      }
    }
    return res;
  };

  const road1Set = buildLane(road1Raw);
  const road2Set = buildLane(road2Raw);

  return (
    <section
      className="section"
      style={{
        background: "var(--bg-base)",
        position: "relative",
        paddingBottom: "var(--space-3xl)",
        overflow: "hidden",
      }}
      aria-labelledby="projects-heading"
    >
      <div className="container" style={{ marginBottom: 32 }}>
        {/* Simple & Clean Header */}
        <div
          className="reveal-on-scroll"
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
        >
          <div>
            <span className="section-label">{label}</span>
            <h2 id="projects-heading" className="section-heading" style={{ margin: 0 }}>
              {title}
            </h2>
          </div>
          {showViewAll && (
            <Link href="/portfolio" className="btn btn-outline soft-hover-lift">
              Explore All Work →
            </Link>
          )}
        </div>
      </div>

      {/* 2 Continuous 360° Infinite Animated Roads of 1:1 Square Cards */}
      <div className="portfolio-roads-wrapper reveal-soft-fade delay-1">
        {/* Road 1: Drifting Continuously Left */}
        <div className="portfolio-road-track">
          <div className="portfolio-road-content road-drift-left">
            {/* Group 1 */}
            <div style={{ display: "flex", gap: "var(--space-md)", flexShrink: 0, paddingRight: "var(--space-md)" }}>
              {road1Set.map((item, idx) => (
                <button
                  type="button"
                  key={`r1-g1-${item.id}-${idx}`}
                  onClick={() => handleOpenLightbox(item)}
                  className="square-card-1x1"
                  title={item.title}
                  aria-label={`Open ${item.title}`}
                  style={{ border: "none", background: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="280px"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="square-card-hover-overlay">
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--accent)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {item.service}
                    </span>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        margin: 0,
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Group 2 (Identical duplicate for seamless 360 infinite loop) */}
            <div style={{ display: "flex", gap: "var(--space-md)", flexShrink: 0, paddingRight: "var(--space-md)" }} aria-hidden="true">
              {road1Set.map((item, idx) => (
                <button
                  type="button"
                  key={`r1-g2-${item.id}-${idx}`}
                  onClick={() => handleOpenLightbox(item)}
                  className="square-card-1x1"
                  tabIndex={-1}
                  title={item.title}
                  aria-label={`Open ${item.title}`}
                  style={{ border: "none", background: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="280px"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="square-card-hover-overlay">
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--accent)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {item.service}
                    </span>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        margin: 0,
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Road 2: Drifting Continuously Right */}
        <div className="portfolio-road-track">
          <div className="portfolio-road-content road-drift-right">
            {/* Group 1 */}
            <div style={{ display: "flex", gap: "var(--space-md)", flexShrink: 0, paddingRight: "var(--space-md)" }}>
              {road2Set.map((item, idx) => (
                <button
                  type="button"
                  key={`r2-g1-${item.id}-${idx}`}
                  onClick={() => handleOpenLightbox(item)}
                  className="square-card-1x1"
                  title={item.title}
                  aria-label={`Open ${item.title}`}
                  style={{ border: "none", background: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="280px"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="square-card-hover-overlay">
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--accent)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {item.service}
                    </span>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        margin: 0,
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Group 2 (Identical duplicate for seamless 360 infinite loop) */}
            <div style={{ display: "flex", gap: "var(--space-md)", flexShrink: 0, paddingRight: "var(--space-md)" }} aria-hidden="true">
              {road2Set.map((item, idx) => (
                <button
                  type="button"
                  key={`r2-g2-${item.id}-${idx}`}
                  onClick={() => handleOpenLightbox(item)}
                  className="square-card-1x1"
                  tabIndex={-1}
                  title={item.title}
                  aria-label={`Open ${item.title}`}
                  style={{ border: "none", background: "none", padding: 0, textAlign: "left", cursor: "pointer" }}
                >
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="280px"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="square-card-hover-overlay">
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        color: "var(--accent)",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {item.service}
                    </span>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#ffffff",
                        margin: 0,
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clean Full-Screen Lightbox Modal for Projects (Zero Text Clutter, Minimal Arrows, YouTube Player) */}
      <CleanPortfolioLightbox
        items={lightboxItems}
        currentIndex={activeItemIdx}
        onClose={() => setActiveItemIdx(null)}
        onNavigate={(idx) => setActiveItemIdx(idx)}
      />
    </section>
  );
}
