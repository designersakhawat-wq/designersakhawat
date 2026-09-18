"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/types";

interface AboutInteractiveExperienceProps {
  settings: Record<string, string>;
}

export default function AboutInteractiveExperience({ settings }: AboutInteractiveExperienceProps) {
  const [activeSkillCategory, setActiveSkillCategory] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [visibleTimelineCards, setVisibleTimelineCards] = useState<number[]>([]);
  const timelineItemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setVisibleTimelineCards((prev) =>
                prev.includes(index) ? prev : [...prev, index].sort((a, b) => a - b)
              );
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    timelineItemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const skillCategories = [
    {
      title: "Brand Architecture & Identity",
      tag: "Core Discipline",
      skills: [
        { name: "Brand Guidelines & Visual Identity Systems", level: 98, desc: "Comprehensive brand books, color psychology, and tone rules." },
        { name: "Custom Logomarks & Vector Monograms", level: 96, desc: "Mathematically balanced, timeless vector trademarks." },
        { name: "Typography Hierarchy & Editorial Pairing", level: 95, desc: "Multi-weight font stacks for print, web, and product." },
        { name: "Corporate Stationery & Pitch Decks", level: 92, desc: "Investor decks, luxury business cards, and vector collateral." },
      ],
    },
    {
      title: "Packaging & 3D Print Production",
      tag: "Industrial Design",
      skills: [
        { name: "Structural Dielines & Box Architecture", level: 94, desc: "100% manufacturer-accurate folding carton & corrugated dielines." },
        { name: "Luxury Hot-Foil, Spot UV & Emboss Specs", level: 92, desc: "Specialty finish plates for premium cosmetic and retail boxes." },
        { name: "Cosmetic, Bottle & Pouch Label Design", level: 95, desc: "Shelf-dominating label graphics calibrated for FDA / retail standards." },
        { name: "Photorealistic 3D Product Mockups", level: 90, desc: "Studio-lit 3D renders for e-commerce and retail pitch." },
      ],
    },
    {
      title: "Social Growth & UI/UX Systems",
      tag: "Digital Conversion",
      skills: [
        { name: "High-Converting Instagram Carousel Kits", level: 96, desc: "Educational infographics engineered for maximum saves & shares." },
        { name: "Paid Meta & TikTok Ad Creative Systems", level: 94, desc: "Scroll-stopping direct response creative assets boosting CTR." },
        { name: "UI/UX Landing Page Prototyping", level: 90, desc: "Conversion-optimized web wireframes and UI components in Figma." },
        { name: "Visual CRO & Cognitive Triggers", level: 92, desc: "Frictionless visual hierarchy designed to trigger buyer action." },
      ],
    },
    {
      title: "AI Motion & Cinematic Direction",
      tag: "Modern Media",
      skills: [
        { name: "Cinematic Reel & Short Video Pacing", level: 88, desc: "Dynamic pacing, sound synchronization, and title animations." },
        { name: "AI Visual Ideation & Rapid Concepting", level: 92, desc: "Generative AI pipelines for rapid moodboarding and asset creation." },
        { name: "Kinetic Typography & Logo Reveals", level: 86, desc: "Smooth vector motion for brand intros and social splash screens." },
      ],
    },
  ];

  const tools = [
    { name: "Adobe Illustrator", level: "Master", icon: "Ai", focus: "Vector & Logos" },
    { name: "Adobe Photoshop", level: "Master", icon: "Ps", focus: "Photo & 3D Mockup" },
    { name: "Figma", level: "Advanced", icon: "Fg", focus: "UI/UX & Prototyping" },
    { name: "Adobe After Effects", level: "Professional", icon: "Ae", focus: "Kinetic Motion" },
    { name: "Midjourney & Runway", level: "Expert", icon: "AI", focus: "Generative Concepting" },
    { name: "Adobe InDesign", level: "Advanced", icon: "Id", focus: "Editorial Layout" },
  ];

  const careerTimeline = [
    {
      period: "2023 — Present",
      role: "Lead Brand & UI/UX Designer",
      agency: "Independent Studio · Global Engagements",
      description: "Partnering directly with founders across the US, UK, Europe, and Middle East. Architected 350+ brand systems, cosmetic packaging lines, and high-converting creative suites with a 99.4% 5-star rating.",
      highlights: ["590+ Total Projects Delivered", "Zero Print Manufacturer Errors", "Top Rated Client Feedback"],
    },
    {
      period: "2022 — 2023",
      role: "Senior Visual Designer & Creative Strategist",
      agency: "Digital Growth Agency",
      description: "Engineered scalable social media design systems and paid ad creatives for multi-million dollar direct-to-consumer e-commerce brands, driving an average +42% CTR lift.",
      highlights: ["Led Creative Production for 20+ Brands", "CMYK Pre-Press Specialist"],
    },
    {
      period: "2021 — 2022",
      role: "Brand Identity Specialist",
      agency: "Creative Design Consultant",
      description: "Executed foundational visual identities, vector illustration packs, and corporate presentation decks for early-stage ventures and regional enterprises.",
      highlights: ["120+ Logomarks Created", "End-to-End Asset Packaging"],
    },
  ];

  const philosophies = [
    {
      num: "01",
      title: "Strategic Simplicity",
      desc: "True luxury and clarity come from subtraction. I strip away superfluous noise so your brand's core value proposition commands immediate attention.",
    },
    {
      num: "02",
      title: "Pixel & Vector Precision",
      desc: "Every curve is mathematically balanced. All assets are engineered to scale flawlessly from a 16px favicon to high-rise billboard vinyls.",
    },
    {
      num: "03",
      title: "Cognitive Color & Type",
      desc: "Design is silent psychology. I choose typographic pairings and color palettes that trigger subconscious authority, trustworthiness, and buying intent.",
    },
    {
      num: "04",
      title: "Production Readiness",
      desc: "Zero technical friction. Dielines are manufacturer-ready with bleed, safety margins, and Pantone callouts. Digital assets are organized in Figma and vector formats.",
    },
  ];

  const faqs = [
    {
      q: "What is your typical turnaround time for a project?",
      a: "For Brand Identity and Packaging projects, initial strategic concepts are presented within 48 to 72 hours. Fast-track revisions and social ad packages can often be delivered within 24 to 48 hours.",
    },
    {
      q: "What files and commercial licenses do I receive?",
      a: "You receive complete 100% exclusive commercial intellectual property ownership. Files include editable vector source formats (AI, EPS, SVG, PDF), high-res raster files (PNG, JPG, WebP), print-ready CMYK dielines, and Figma files.",
    },
    {
      q: "How does your revision process work?",
      a: "I work with an iterative, collaborative revision workflow until you are 100% thrilled with the outcome. Because every design starts with a clear strategic brief, we almost always hit the target in round 1 or 2.",
    },
    {
      q: "Can you collaborate directly with our packaging manufacturer?",
      a: "Yes! I routinely liaise directly with box printers, bottle manufacturers, and printing presses in the US, Europe, and China to verify dielines, foil coatings, and color separations before production runs.",
    },
  ];

  const whatsappUrl = settings.contact_whatsapp_url || "https://wa.me/8801781955355";
  const email = settings.contact_email || "designersakhawat86@gmail.com";

  return (
    <div style={{ position: "relative" }}>
      {/* ── 1. Hero Section with Authentic Studio Portrait ── */}
      <section
        style={{
          paddingTop: "calc(var(--nav-height) + 48px)",
          paddingBottom: "64px",
          background: "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(212,255,0,0.06) 0%, transparent 70%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "400px 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            {/* Left: Authentic Studio Portrait Frame */}
            <div style={{ position: "relative" }}>
              <div className="about-portrait-ambient-glow" />

              <div className="about-hero-portrait-frame">
                <div style={{ position: "relative", width: "100%", height: 480, background: "#070709" }}>
                  <Image
                    src="/images/profile-square.jpg"
                    alt="Md Sakhawat Hossain — Senior Creative Graphic Designer"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                    priority
                    quality={95}
                  />

                  {/* Gradient bottom overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, transparent 65%, rgba(7,7,9,0.92) 100%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Floating Availability Pill */}
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      background: "rgba(13, 14, 18, 0.9)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(212, 255, 0, 0.35)",
                      padding: "6px 14px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        boxShadow: "0 0 10px var(--accent)",
                        animation: "pulseGlow 2s infinite",
                      }}
                    />
                    Available for Q3/Q4 Projects
                  </div>

                  {/* Floating Bottom Metric Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 16,
                      right: 16,
                      background: "rgba(13, 14, 18, 0.9)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "var(--radius-lg)",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 700 }}>
                        Track Record
                      </span>
                      <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "var(--accent)" }}>
                        590+ Projects Delivered
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.1em", fontWeight: 700 }}>
                        Satisfaction
                      </span>
                      <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#ffffff" }}>
                        99.4% Positive
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Bio & Profile Narrative */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span className="skill-category-badge">
                  ★ SENIOR BRAND ARCHITECT & UI/UX DESIGNER
                </span>
              </div>

              <h1 style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
                Crafting High-Converting Visual Identities & Systems.
              </h1>

              <p style={{ fontSize: "1.125rem", color: "var(--accent)", fontWeight: 600, marginBottom: 18 }}>
                Md Sakhawat Hossain — 3+ Years of Commercial Mastery
              </p>

              <div style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <p>
                  I specialize in turning high-growth businesses into memorable market leaders. My design philosophy bridges the gap between aesthetic sophistication and commercial results—ensuring every visual touchpoint turns casual visitors into loyal brand advocates.
                </p>
                <p>
                  From Fortune-caliber logo guidelines and luxury cosmetic packaging dielines to conversion-tuned social ads and AI-assisted motion reels, every asset is created with mathematical precision and uncompromising standard.
                </p>
              </div>

              {/* Quick Profile Meta */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 12,
                  marginBottom: 28,
                  padding: "16px 20px",
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--bg-border)",
                }}
              >
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Based in</span>
                  <p style={{ margin: "2px 0 0", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>
                    📍 Sirajganj, Bangladesh (Global Remote)
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Deliverables</span>
                  <p style={{ margin: "2px 0 0", fontSize: "0.875rem", fontWeight: 600, color: "var(--accent)" }}>
                    100% Vector · Commercial License
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  <span>Chat on WhatsApp</span> →
                </a>
                <a href={`mailto:${email}`} className="btn btn-outline">
                  Email Inquiry
                </a>
                <Link href="/portfolio" className="btn btn-ghost">
                  View Case Studies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. High-Contrast Stats Ribbon (Camplify Pinterest Reference) ── */}
      <section className="stats-ribbon">
        <div className="container">
          <div className="stats-ribbon-grid">
            <div className="stats-ribbon-item">
              <span className="stats-ribbon-num">3+</span>
              <span className="stats-ribbon-label">Years of Mastery</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Commercial Design Practice</span>
            </div>
            <div className="stats-ribbon-item">
              <span className="stats-ribbon-num">590+</span>
              <span className="stats-ribbon-label">Projects Completed</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>100% On-Time Delivery</span>
            </div>
            <div className="stats-ribbon-item">
              <span className="stats-ribbon-num">37+</span>
              <span className="stats-ribbon-label">Global Brands</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>US, UK, UAE & Beyond</span>
            </div>
            <div className="stats-ribbon-item">
              <span className="stats-ribbon-num">99.4%</span>
              <span className="stats-ribbon-label">5-Star Reviews</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>Verified Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Skills & Capability Matrix ── */}
      <section className="section" style={{ background: "var(--bg-base)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-label" style={{ justifyContent: "center" }}>Senior Technical Mastery</span>
            <h2 className="section-heading">Skills & Capabilities Matrix</h2>
            <p className="section-subtext" style={{ margin: "0 auto", maxWidth: 640 }}>
              Specialized expertise designed to solve high-stakes visual communication and conversion challenges.
            </p>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 36,
            }}
          >
            {skillCategories.map((cat, idx) => {
              const isActive = activeSkillCategory === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSkillCategory(idx)}
                  style={{
                    padding: "10px 22px",
                    borderRadius: "var(--radius-full)",
                    background: isActive ? "var(--accent)" : "var(--bg-surface)",
                    color: isActive ? "var(--text-on-accent)" : "var(--text-secondary)",
                    border: `1px solid ${isActive ? "var(--accent)" : "var(--bg-border)"}`,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Skills List with Visual Mastery Indicators */}
          <div
            className="grid-2"
            style={{
              gap: 20,
              maxWidth: 960,
              margin: "0 auto 48px",
            }}
          >
            {skillCategories[activeSkillCategory].skills.map((skill, sIdx) => (
              <div
                key={sIdx}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px 28px",
                  transition: "all 0.25s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    {skill.name}
                  </h3>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-heading)" }}>
                    {skill.level}%
                  </span>
                </div>

                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.5 }}>
                  {skill.desc}
                </p>

                {/* Precision Progress Indicator */}
                <div
                  style={{
                    height: 6,
                    background: "rgba(255, 255, 255, 0.06)",
                    borderRadius: "var(--radius-full)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${skill.level}%`,
                      background: "linear-gradient(90deg, var(--accent-dim) 0%, var(--accent) 100%)",
                      borderRadius: "var(--radius-full)",
                      boxShadow: "0 0 10px rgba(212, 255, 0, 0.4)",
                      transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Industry Tools Grid */}
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "var(--text-muted)" }}>
                PRODUCTION SUITE & SOFTWARE MASTERY
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--bg-border)" }} />
            </div>

            <div className="grid-3" style={{ gap: 16 }}>
              {tools.map((t, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "var(--radius-md)",
                      background: "linear-gradient(135deg, rgba(212, 255, 0, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%)",
                      border: "1px solid rgba(212, 255, 0, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9375rem",
                      fontWeight: 800,
                      color: "var(--accent)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, margin: "0 0 2px" }}>
                      {t.name}
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {t.level} · {t.focus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Career Journey & Experience Timeline ── */}
      <section className="section" style={{ background: "var(--bg-deep)" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div style={{ marginBottom: 40 }}>
            <span className="section-label">Proven Track Record</span>
            <h2 className="section-heading" style={{ marginBottom: 8 }}>
              Experience & Career Journey
            </h2>
            <p className="section-subtext" style={{ margin: 0 }}>
              Over 3 years of delivering mission-critical creative assets for commercial enterprises.
            </p>
          </div>

          <div className="experience-timeline">
            {/* Background static line */}
            <div className="experience-timeline-track" />

            {/* Dynamic glowing animated progress line */}
            <div
              className="experience-timeline-progress"
              style={{
                height:
                  visibleTimelineCards.length === 0
                    ? "0%"
                    : visibleTimelineCards.includes(2)
                    ? "100%"
                    : visibleTimelineCards.includes(1)
                    ? "55%"
                    : "15%",
              }}
            />

            {careerTimeline.map((item, idx) => {
              const isRevealed = visibleTimelineCards.includes(idx);
              const isLatest =
                visibleTimelineCards.length > 0 &&
                Math.max(...visibleTimelineCards) === idx;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    timelineItemRefs.current[idx] = el;
                  }}
                  data-index={idx}
                  className="experience-item"
                  style={{
                    opacity: isRevealed ? 1 : 0,
                    transform: isRevealed
                      ? "translateY(0) scale(1)"
                      : "translateY(75px) scale(0.96)",
                    filter: isRevealed ? "blur(0px)" : "blur(4px)",
                    transition:
                      "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
                    willChange: "transform, opacity, filter",
                  }}
                >
                  <div className={`experience-dot ${isRevealed ? "active" : ""}`}>
                    {isLatest && (
                      <span
                        style={{
                          position: "absolute",
                          inset: -6,
                          borderRadius: "50%",
                          border: "2px solid var(--accent)",
                          animation: "pulseRing 2.4s cubic-bezier(0.25, 1, 0.5, 1) infinite",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </div>

                  <div
                    style={{
                      background: isLatest ? "rgba(18, 20, 26, 0.95)" : "var(--bg-surface)",
                      border: isLatest
                        ? "1px solid rgba(212, 255, 0, 0.35)"
                        : "1px solid var(--bg-border)",
                      borderRadius: "var(--radius-xl)",
                      padding: "28px 32px",
                      transition: "all 0.35s ease",
                      boxShadow: isLatest
                        ? "0 20px 48px rgba(0, 0, 0, 0.5), 0 0 24px rgba(212, 255, 0, 0.12)"
                        : "0 6px 20px rgba(0, 0, 0, 0.3)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow =
                        "0 24px 56px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 255, 0, 0.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isLatest
                        ? "rgba(212, 255, 0, 0.35)"
                        : "var(--bg-border)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isLatest
                        ? "0 20px 48px rgba(0, 0, 0, 0.5), 0 0 24px rgba(212, 255, 0, 0.12)"
                        : "0 6px 20px rgba(0, 0, 0, 0.3)";
                    }}
                  >
                    {/* Top ambient accent highlight for active card */}
                    {isLatest && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "8%",
                          right: "8%",
                          height: 1,
                          background:
                            "linear-gradient(90deg, transparent, var(--accent), transparent)",
                          opacity: 0.9,
                        }}
                      />
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                        gap: 8,
                        marginBottom: 8,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          margin: 0,
                        }}
                      >
                        {item.role}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 700,
                          color: "var(--accent)",
                          background: "rgba(212, 255, 0, 0.08)",
                          border: "1px solid rgba(212, 255, 0, 0.2)",
                          padding: "3px 12px",
                          borderRadius: "var(--radius-full)",
                        }}
                      >
                        {item.period}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--accent)",
                        fontWeight: 600,
                        marginBottom: 12,
                      }}
                    >
                      {item.agency}
                    </p>

                    <p
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.65,
                        marginBottom: 16,
                      }}
                    >
                      {item.description}
                    </p>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {item.highlights.map((hl, hIdx) => (
                        <span
                          key={hIdx}
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            padding: "4px 12px",
                            borderRadius: "var(--radius-full)",
                          }}
                        >
                          ✓ {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Design Philosophy Bento Grid ── */}
      <section className="section" style={{ background: "var(--bg-base)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-label" style={{ justifyContent: "center" }}>Core Standards</span>
            <h2 className="section-heading">How I Approach Every Design</h2>
            <p className="section-subtext" style={{ margin: "0 auto", maxWidth: 600 }}>
              The foundational principles that guarantee visual authority and commercial conversion.
            </p>
          </div>

          <div className="grid-2" style={{ gap: 24, maxWidth: 1000, margin: "0 auto" }}>
            {philosophies.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: "var(--radius-xl)",
                  padding: "32px",
                  position: "relative",
                  transition: "all 0.25s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "2.5rem",
                    fontWeight: 800,
                    color: "var(--accent)",
                    opacity: 0.3,
                    lineHeight: 1,
                    display: "block",
                    marginBottom: 12,
                  }}
                >
                  {p.num}
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 10 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ Section (Camplify Pinterest Reference Style) ── */}
      <section className="section" style={{ background: "var(--bg-deep)" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* Left Column */}
            <div>
              <span className="section-label">Questions & Answers</span>
              <h2 className="section-heading" style={{ marginBottom: 16 }}>
                Got a Question Before Getting Started?
              </h2>
              <p className="section-subtext" style={{ margin: "0 0 24px" }}>
                Everything you need to know about working with me, deliverables, timelines, and commercial licensing.
              </p>

              <div
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--bg-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                }}
              >
                <h4 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 8 }}>
                  Need a custom quote or complex package?
                </h4>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>
                  Drop me a direct message on WhatsApp for instant project scoping and pricing estimates.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Direct WhatsApp Chat →
                </a>
              </div>
            </div>

            {/* Right Column: Accordion */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {faqs.map((faq, fIdx) => {
                const isOpen = activeFaq === fIdx;
                return (
                  <div
                    key={fIdx}
                    style={{
                      background: "var(--bg-surface)",
                      border: `1px solid ${isOpen ? "var(--accent)" : "var(--bg-border)"}`,
                      borderRadius: "var(--radius-lg)",
                      overflow: "hidden",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : fIdx)}
                      style={{
                        width: "100%",
                        padding: "20px 24px",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        color: isOpen ? "var(--accent)" : "var(--text-primary)",
                        fontWeight: 700,
                        fontSize: "1rem",
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ fontSize: "1.25rem", marginLeft: 16 }}>{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: "0 24px 20px",
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.65,
                          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
                          paddingTop: 16,
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
