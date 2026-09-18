"use client";

import React from "react";
import type { ClientLogo } from "@/types";

interface ClientLogosSectionProps {
  logos?: ClientLogo[];
}

export default function ClientLogosSection({ logos }: ClientLogosSectionProps) {
  // Curated brands with bespoke minimalist SVG emblems
  const brandList = [
    {
      id: "aura",
      name: "AURA TECHNOLOGIES",
      tag: "Cloud & SaaS",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" opacity="0.4" />
          <circle cx="12" cy="12" r="5" stroke="var(--accent)" />
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" stroke="var(--accent)" opacity="0.7" />
        </svg>
      ),
    },
    {
      id: "maison",
      name: "MAISON LUXE",
      tag: "Luxury Goods",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" stroke="var(--accent)" />
          <line x1="12" y1="22" x2="12" y2="12" opacity="0.6" />
          <line x1="22" y1="8.5" x2="12" y2="12" opacity="0.6" />
          <line x1="2" y1="8.5" x2="12" y2="12" opacity="0.6" />
        </svg>
      ),
    },
    {
      id: "apex",
      name: "APEX ATHLETICS",
      tag: "Performance Wear",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke="var(--accent)" />
        </svg>
      ),
    },
    {
      id: "zenith",
      name: "ZENITH AI LABS",
      tag: "Artificial Intelligence",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="var(--accent)" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" opacity="0.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="var(--accent)" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" opacity="0.5" />
        </svg>
      ),
    },
    {
      id: "pulse",
      name: "PULSE MEDIA GLOBAL",
      tag: "Digital Agency",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="var(--accent)" />
        </svg>
      ),
    },
    {
      id: "nordic",
      name: "NORDIC WOOD CRAFT",
      tag: "Sustainable Living",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L4 12h5l-3 7h12l-3-7h5z" stroke="var(--accent)" />
        </svg>
      ),
    },
  ];

  // Repeat for continuous seamless infinite drift
  const marqueeItems = [...brandList, ...brandList, ...brandList];

  return (
    <section
      aria-label="Trusted Brands"
      style={{
        padding: "32px 0 36px",
        background: "rgba(10, 11, 15, 0.65)",
        borderTop: "1px solid rgba(255, 255, 255, 0.04)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Subtle Micro-Label */}
      <div className="container" style={{ textAlign: "center", marginBottom: 20 }}>
        <p
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: "var(--text-muted)",
            opacity: 0.75,
            margin: 0,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          TRUSTED BY FORWARD-THINKING BRANDS & STARTUPS WORLDWIDE
        </p>
      </div>

      {/* Dynamic Smooth Infinite Marquee with Vignette Fades */}
      <div
        style={{
          display: "flex",
          overflow: "hidden",
          userSelect: "none",
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div
          className="brand-marquee-track"
          style={{
            display: "flex",
            gap: 48,
            whiteSpace: "nowrap",
            alignItems: "center",
            animation: "marquee 32s linear infinite",
          }}
        >
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="brand-item"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "8px 18px",
                borderRadius: "var(--radius-md)",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.45)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(212, 255, 0, 0.05)";
                el.style.borderColor = "rgba(212, 255, 0, 0.35)";
                el.style.color = "#ffffff";
                el.style.transform = "translateY(-2px)";
                el.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.4), 0 0 16px rgba(212, 255, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "rgba(255, 255, 255, 0.02)";
                el.style.borderColor = "rgba(255, 255, 255, 0.05)";
                el.style.color = "rgba(255, 255, 255, 0.45)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {brand.icon}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 800,
                    letterSpacing: "0.1em",
                    fontFamily: "var(--font-heading)",
                    lineHeight: 1.2,
                  }}
                >
                  {brand.name}
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    letterSpacing: "0.04em",
                    color: "rgba(255, 255, 255, 0.3)",
                    fontWeight: 500,
                  }}
                >
                  {brand.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
