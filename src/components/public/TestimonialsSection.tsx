"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const fallbackTestimonials: Testimonial[] = [
    {
      id: 1,
      client_name: "Alex Morgan",
      designation: "Founder & CEO",
      company: "Aura Tech Solutions",
      text: "Sakhawat transformed our tech brand identity completely. The logo and guidelines elevated our product to look like a global market leader!",
      photo_media_id: null,
      rating: 5,
      display_order: 1,
      visible: 1,
      deleted_at: null,
      created_at: "",
      updated_at: "",
    } as unknown as Testimonial,
    {
      id: 2,
      client_name: "Sophie Laurent",
      designation: "Creative Director",
      company: "Maison Luxe Cosmetics",
      text: "His eye for luxury packaging typography and realistic 3D bottle mockups exceeded all our board's expectations.",
      photo_media_id: null,
      rating: 5,
      display_order: 2,
      visible: 1,
      deleted_at: null,
      created_at: "",
      updated_at: "",
    } as unknown as Testimonial,
    {
      id: 3,
      client_name: "Rahim Ahmed",
      designation: "Co-Founder",
      company: "QuickMart E-Commerce",
      text: "The social creatives Sakhawat designed gave us an immediate 45% bump in conversion rates. He is our trusted designer!",
      photo_media_id: null,
      rating: 5,
      display_order: 3,
      visible: 1,
      deleted_at: null,
      created_at: "",
      updated_at: "",
    } as unknown as Testimonial,
    {
      id: 4,
      client_name: "Marcus Vance",
      designation: "Lead Producer",
      company: "Pulse Media Global",
      text: "Mesmerizing AI video motion graphics with an elite international standard of rhythm, pacing, and visual storytelling.",
      photo_media_id: null,
      rating: 5,
      display_order: 4,
      visible: 1,
      deleted_at: null,
      created_at: "",
      updated_at: "",
    } as unknown as Testimonial,
    {
      id: 5,
      client_name: "Elena Rostova",
      designation: "Brand Strategist",
      company: "Zenith AI Labs",
      text: "Clean, mathematically balanced vector marks that look stunning in both micro-icons and billboard scale.",
      photo_media_id: null,
      rating: 5,
      display_order: 5,
      visible: 1,
      deleted_at: null,
      created_at: "",
      updated_at: "",
    } as unknown as Testimonial,
    {
      id: 6,
      client_name: "David Sterling",
      designation: "Managing Director",
      company: "Apex Global Capital",
      text: "Flawless investor pitch deck design and executive brand stationery. Delivers world-class results on tight timelines.",
      photo_media_id: null,
      rating: 5,
      display_order: 6,
      visible: 1,
      deleted_at: null,
      created_at: "",
      updated_at: "",
    } as unknown as Testimonial,
  ];

  const items = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  // Responsive visible items count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 680) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Continuous Auto-play motion every 4.5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section
      className="section"
      style={{
        background: "var(--bg-deep)",
        position: "relative",
        overflow: "hidden",
        paddingTop: "var(--space-2xl)",
        paddingBottom: "var(--space-3xl)",
      }}
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 350,
          background: "radial-gradient(circle, rgba(212, 255, 0, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="section-label">Client Endorsements</span>
            <h2 id="testimonials-heading" className="section-heading" style={{ marginBottom: 6 }}>
              Satisfied Founders Are My Best Ads
            </h2>
            <p className="section-subtext" style={{ margin: 0 }}>
              Direct feedback from business leaders and creative directors across the globe.
            </p>
          </div>

          {/* Interactive Arrow Motion Controls */}
          <div className="testi-controls">
            <button
              onClick={prevSlide}
              className="testi-arrow-btn"
              aria-label="Previous testimonials"
              title="Previous Slide"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="testi-arrow-btn"
              aria-label="Next testimonials"
              title="Next Slide"
            >
              →
            </button>
          </div>
        </div>

        {/* Dynamic Sliding Viewport */}
        <div className="testi-slider-viewport">
          <div
            className="testi-slider-track"
            style={{
              transform: `translateX(calc(-${currentIndex} * (${100 / visibleCount}% + ${24 / visibleCount}px)))`,
            }}
          >
            {items.map((item, index) => {
              const name = item.client_name || (item as unknown as { author_name?: string }).author_name || "Verified Client";
              const role = item.designation || (item as unknown as { author_role?: string }).author_role || "";
              const company = item.company || "";
              const quote = item.text || (item as unknown as { content?: string }).content || "";

              return (
                <div key={`${item.id}-${index}`} className="testi-slide-item">
                  <div className="testi-card-modern">
                    <div>
                      {/* Top Quote Icon & Verified Founder Badge */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div className="testi-quote-mark">“</div>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--accent)",
                            background: "rgba(212, 255, 0, 0.08)",
                            border: "1px solid rgba(212, 255, 0, 0.25)",
                            padding: "4px 10px",
                            borderRadius: "var(--radius-full)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <span>✓</span> Verified Founder
                        </span>
                      </div>

                      {/* Quote text */}
                      <p
                        style={{
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          color: "var(--text-secondary)",
                          marginBottom: 14,
                          fontStyle: "italic",
                        }}
                      >
                        &ldquo;{quote}&rdquo;
                      </p>
                    </div>

                    {/* Client Identity & Ratings Footer */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        paddingTop: 12,
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      {/* Monogram Avatar with Live Glow */}
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #1c1e28 0%, #101117 100%)",
                          border: "1.5px solid var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          color: "var(--accent)",
                          fontSize: "0.9375rem",
                          flexShrink: 0,
                          position: "relative",
                          boxShadow: "0 0 10px rgba(212, 255, 0, 0.2)",
                        }}
                      >
                        {name.charAt(0)}
                        <span
                          style={{
                            position: "absolute",
                            bottom: -1,
                            right: -1,
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: "#22c55e",
                            border: "2px solid #070709",
                          }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                            {name}
                          </h4>
                          <span style={{ color: "var(--accent)", fontSize: "0.8125rem", letterSpacing: 1 }}>★★★★★</span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {role}{role && company ? " · " : ""}{company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated Progress Indicators (Pills) */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
          {Array.from({ length: maxIndex + 1 }).map((_, pIdx) => (
            <button
              key={pIdx}
              onClick={() => setCurrentIndex(pIdx)}
              className={`testi-indicator-pill ${currentIndex === pIdx ? "active" : ""}`}
              aria-label={`Go to slide ${pIdx + 1}`}
              title={`Slide ${pIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
