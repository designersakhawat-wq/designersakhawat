"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types";

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
  const fallbackProjects = [
    { id: 1, title: "Aura Tech — Brand Guidelines", slug: "aura-tech-brand-identity", cover: "/images/projects/project-1.webp", service: "Logo & Branding" },
    { id: 2, title: "Maison Luxe — Perfume Packaging", slug: "maison-luxe-packaging", cover: "/images/projects/project-2.webp", service: "Packaging Design" },
    { id: 3, title: "Apex Athletics — Social Campaign", slug: "apex-athletics-social-campaign", cover: "/images/projects/project-3.webp", service: "Social Media Design" },
    { id: 4, title: "Zenith AI — Dynamic Brand Video", slug: "zenith-ai-brand-video", cover: "/images/projects/project-4.webp", service: "AI Video Editing" },
    { id: 5, title: "Cyber Shield — Cyber Security Visual Identity", slug: "cyber-shield-identity", cover: "/images/projects/project-5.webp", service: "Brand Identity" },
    { id: 6, title: "Botany Organics — Luxury Bottle Label", slug: "botany-organics-label", cover: "/images/projects/project-6.webp", service: "Packaging Design" },
    { id: 7, title: "Velocity Gym — High-Energy Social Creative Kit", slug: "velocity-gym-social", cover: "/images/projects/project-7.webp", service: "Social Media Design" },
    { id: 8, title: "Nexus Studio — Kinetic Brand Motion", slug: "nexus-studio-motion", cover: "/images/projects/project-8.webp", service: "AI Video Editing" },
  ];

  // Map input projects or use fallbacks
  const mappedProjects = (projects && projects.length > 0 ? projects : []).map((p, i) => ({
    id: p.id || i + 1,
    title: p.title,
    slug: p.slug,
    cover: p.cover_media_id
      ? `/api/media/${p.cover_media_id}?size=medium`
      : `/images/projects/project-${(i % 8) + 1}.webp`,
    service: (p as unknown as { service_name?: string }).service_name || "Creative Design",
  }));

  const allItems = mappedProjects.length >= 6 ? mappedProjects : fallbackProjects;

  // Split into Road 1 and Road 2
  const road1 = allItems.slice(0, Math.ceil(allItems.length / 2));
  const road2 = allItems.slice(Math.ceil(allItems.length / 2));

  // Duplicate for seamless 360 infinite loop
  const road1Full = [...road1, ...road1, ...road1, ...road1];
  const road2Full = [...road2, ...road2, ...road2, ...road2];

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
        {/* Simple & Clean Header: No extra clutter */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span className="section-label">{label}</span>
            <h2 id="projects-heading" className="section-heading" style={{ margin: 0 }}>
              {title}
            </h2>
          </div>
          {showViewAll && (
            <Link href="/portfolio" className="btn btn-outline">
              Explore All Work →
            </Link>
          )}
        </div>
      </div>

      {/* 2 Continuous 360° Infinite Animated Roads of 1:1 Square Cards */}
      <div className="portfolio-roads-wrapper">
        {/* Road 1: Drifting Continuously Left */}
        <div className="portfolio-road-track">
          <div className="portfolio-road-content road-drift-left">
            {road1Full.map((item, idx) => (
              <Link
                key={`r1-${item.id}-${idx}`}
                href={`/portfolio/${item.slug}`}
                className="square-card-1x1"
                title={item.title}
                aria-label={item.title}
              >
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  sizes="280px"
                  style={{ objectFit: "cover" }}
                />
                {/* Subtle Hover Reveal (inside the card only, zero outside text) */}
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
              </Link>
            ))}
          </div>
        </div>

        {/* Road 2: Drifting Continuously Right */}
        <div className="portfolio-road-track">
          <div className="portfolio-road-content road-drift-right">
            {road2Full.map((item, idx) => (
              <Link
                key={`r2-${item.id}-${idx}`}
                href={`/portfolio/${item.slug}`}
                className="square-card-1x1"
                title={item.title}
                aria-label={item.title}
              >
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  sizes="280px"
                  style={{ objectFit: "cover" }}
                />
                {/* Subtle Hover Reveal (inside the card only, zero outside text) */}
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
