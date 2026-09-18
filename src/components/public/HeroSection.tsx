import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  settings: Record<string, string>;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const whatsappMsg = encodeURIComponent("Hi Sakhawat, I'd like to discuss a design project.");
  const whatsappUrl = `https://wa.me/8801781955355?text=${whatsappMsg}`;

  const showcaseCards = [
    {
      badge: "Brand Identity",
      title: "Aura Tech Guidelines",
      image: "/images/projects/project-1.webp",
      href: "/portfolio/aura-tech-brand-identity",
    },
    {
      badge: "Luxury Packaging",
      title: "Maison Luxe 3D Mockup",
      image: "/images/projects/project-2.webp",
      href: "/portfolio/maison-luxe-packaging",
    },
    {
      badge: "Social Media Ads",
      title: "Apex Athletics Campaign",
      image: "/images/projects/project-3.webp",
      href: "/portfolio/apex-athletics-social-campaign",
    },
    {
      badge: "AI Motion & Video",
      title: "Zenith AI Launch Video",
      image: "/images/projects/project-4.webp",
      href: "/portfolio/zenith-ai-brand-video",
    },
  ];

  return (
    <section
      className="hero"
      id="hero"
      aria-label="Hero section"
      style={{
        paddingTop: "120px",
        paddingBottom: "40px",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212, 255, 0, 0.12) 0%, rgba(7, 7, 9, 0) 70%), var(--bg-deep)",
      }}
    >
      <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Reference 1: Eyebrow Pill */}
        <div
          className="reveal-on-scroll is-visible delay-1 animate-soft-float"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", background: "rgba(18, 20, 26, 0.8)", border: "1px solid var(--accent-border)", borderRadius: "var(--radius-full)", marginBottom: 20 }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 10px var(--accent)" }} />
          <span style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "11px" }}>
            Creative Graphic Designer • Available for Projects
          </span>
        </div>

        {/* Reference 1 & 2: Large High-Impact Typography */}
        <h1
          className="reveal-on-scroll is-visible delay-2"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#ffffff",
            maxWidth: "20ch",
            margin: "0 auto 16px",
          }}
        >
          Crafting Visual Identities That{" "}
          <span
            style={{
              color: "var(--accent)",
              textShadow: "0 0 35px rgba(212, 255, 0, 0.4)",
            }}
          >
            Demand Attention
          </span>
        </h1>

        {/* Concise value proposition without cluttered text walls */}
        <p
          className="reveal-on-scroll is-visible delay-3"
          style={{
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
            color: "var(--text-secondary)",
            maxWidth: "58ch",
            margin: "0 auto 32px",
            lineHeight: 1.65,
          }}
        >
          {settings.hero_subline ||
            "Helping brands stand out and convert with bespoke brand identities, shelf-ready packaging, high-converting social media creatives, and AI video motion."}
        </p>

        {/* Dual Actions */}
        <div
          className="reveal-on-scroll is-visible delay-4"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}
        >
          <Link
            href="/portfolio"
            className="soft-hover-lift"
            style={{
              background: "var(--accent)",
              color: "#070709",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "14px",
              padding: "14px 28px",
              borderRadius: "var(--radius-full)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              boxShadow: "0 0 24px rgba(212, 255, 0, 0.35)",
            }}
          >
            <span>Explore Portfolio</span>
            <span>↓</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="soft-hover-lift"
            style={{
              background: "transparent",
              color: "#ffffff",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "14px",
              padding: "14px 24px",
              borderRadius: "var(--radius-full)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <span>💬 Chat on WhatsApp</span>
          </a>
        </div>

        {/* Reference 1: Interactive Fan-Out Card Deck */}
        <div className="hero-deck-container reveal-soft-scale is-visible delay-5">
          <div className="hero-deck">
            {showcaseCards.map((card, idx) => (
              <Link key={idx} href={card.href} className="deck-card soft-hover-lift" aria-label={`View ${card.title}`}>
                <div className="deck-card-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.image} alt={card.title} loading="eager" />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(10,10,12,0.9) 0%, transparent 60%)",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "rgba(7, 7, 9, 0.85)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--accent)",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "var(--radius-full)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {card.badge}
                  </span>
                </div>
                <div className="deck-card-info">
                  <div className="deck-card-title">{card.title}</div>
                  <div className="deck-card-action">
                    <span>View Project</span>
                    <span>↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
