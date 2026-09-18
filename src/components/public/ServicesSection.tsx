"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/types";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!services || services.length === 0) return null;

  const defaultServiceCovers: Record<string, string> = {
    "logo-branding": "/images/services/service-1.webp",
    "social-media-design": "/images/services/service-2.webp",
    "packaging-label-design": "/images/services/service-3.webp",
    "ai-video-editing": "/images/services/service-4.webp",
  };

  const serviceDetails: Record<string, { tag: string; blurb: string; deliverables: string[]; highlight: string }> = {
    "logo-branding": {
      tag: "Identity & Architecture",
      blurb: "End-to-end brand systems built to position your business as an established category leader.",
      deliverables: ["Primary & Secondary Logomarks", "Typography & Color Hierarchy", "Brand Style Guide PDF", "Vector Source Files (AI, SVG, EPS)"],
      highlight: "Strategic visual foundations designed for international trademarks.",
    },
    "social-media-design": {
      tag: "Conversion & Reach",
      blurb: "Scroll-stopping social media creatives engineered to boost engagement and ad ROI.",
      deliverables: ["High-Converting Carousel Kits", "Meta & TikTok Ad Templates", "Story & Feed Visual Systems", "Photoshop & Figma Editable Files"],
      highlight: "Battle-tested ad layouts that increase CTR by an average of 35-45%.",
    },
    "packaging-label-design": {
      tag: "Print & Industrial 3D",
      blurb: "Shelf-ready structural packaging and luxury label designs calibrated for commercial manufacturing.",
      deliverables: ["100% Accurate Print Dielines", "Gold Foil, Spot UV & Emboss Specs", "Photorealistic 3D Bottle Mockups", "Print-Ready CMYK Press Files"],
      highlight: "Zero print errors guarantee with rigorous pre-flight manufacturer checks.",
    },
    "ai-video-editing": {
      tag: "Dynamic Motion & AI",
      blurb: "High-energy promotional video edits and AI-assisted pacing for product launches and campaigns.",
      deliverables: ["Cinematic Promo Reels & Shorts", "Kinetic Typography & Sound Design", "AI Visual Synthesis & Upscaling", "Multi-Platform Aspect Ratios (9:16, 16:9)"],
      highlight: "Fast-paced storytelling that hooks viewer attention in the first 3 seconds.",
    },
  };

  const activeService = services[activeIndex] || services[0];
  const activeMeta = serviceDetails[activeService.slug] || {
    tag: "Design Discipline",
    blurb: activeService.description || "High-end design services.",
    deliverables: ["Custom Creative Concepts", "High-Resolution Assets", "Commercial Rights"],
    highlight: "Tailored visual assets engineered for business growth.",
  };

  const activeCover = activeService.cover_media_id
    ? `/api/media/${activeService.cover_media_id}?size=medium`
    : defaultServiceCovers[activeService.slug] || "/images/services/service-1.webp";

  return (
    <section
      className="section"
      id="services"
      aria-labelledby="services-heading"
      style={{ background: "var(--bg-deep)", position: "relative" }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="section-label">Core Capabilities</span>
            <h2 id="services-heading" className="section-heading" style={{ marginBottom: 8 }}>
              Design Services Built to Scale
            </h2>
            <p className="section-subtext" style={{ margin: 0, maxWidth: 640 }}>
              Tailored visual solutions that eliminate generic clutter and establish authoritative market presence.
            </p>
          </div>
          <Link href="/services" className="btn btn-outline">
            All Services & Pricing →
          </Link>
        </div>

        {/* Interactive Capability Showcase */}
        <div className="services-interactive-wrapper">
          {/* Left Column: Interactive Selector */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {services.map((service, idx) => {
              const isActive = activeIndex === idx;
              const meta = serviceDetails[service.slug] || {
                tag: "Creative",
                blurb: service.description,
                deliverables: [],
                highlight: "",
              };

              return (
                <div
                  key={service.id}
                  className={`service-tab-btn ${isActive ? "active" : ""}`}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  role="button"
                  tabIndex={0}
                  aria-selected={isActive}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: isActive ? "var(--accent)" : "var(--text-muted)",
                      }}
                    >
                      0{idx + 1} // {meta.tag}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--accent)",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        Active Focus ●
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      marginBottom: 8,
                      color: isActive ? "#ffffff" : "var(--text-primary)",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {service.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: isActive ? "var(--text-secondary)" : "var(--text-muted)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {meta.blurb}
                  </p>

                  {/* Expandable deliverables list when active */}
                  {isActive && (
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {meta.deliverables.map((item, dIdx) => (
                        <span
                          key={dIdx}
                          style={{
                            fontSize: "0.75rem",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            padding: "3px 10px",
                            borderRadius: "var(--radius-full)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Visual Stage (Matches Full Height of Service Tabs) */}
          <div style={{ position: "relative", height: "100%", minHeight: 520, display: "flex", flexDirection: "column" }}>
            <div className="service-preview-stage">
              <Image
                src={activeCover}
                alt={activeService.name}
                fill
                sizes="(max-width: 992px) 100vw, 800px"
                style={{ objectFit: "cover", objectPosition: "center center" }}
                priority
              />

              {/* Gradient Vignette & Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 40%, rgba(7, 7, 9, 0.9) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Floating Bottom Card on the Preview */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  background: "rgba(13, 14, 18, 0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(212, 255, 0, 0.3)",
                  borderRadius: "var(--radius-lg)",
                  padding: "16px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div>
                  <span style={{ fontSize: "0.6875rem", color: "var(--accent)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Specialized Delivery
                  </span>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "4px 0 0", lineHeight: 1.4 }}>
                    {activeMeta.highlight}
                  </p>
                </div>
                <Link
                  href={`/services/${activeService.slug}`}
                  className="btn btn-primary"
                  style={{ whiteSpace: "nowrap", padding: "8px 16px", fontSize: "0.8125rem" }}
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
