"use client";

import React from "react";
import Link from "next/link";

interface ServiceGroup {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  projects: Array<{
    id: number | string;
    title: string;
    slug: string;
    image: string;
    badge: string;
  }>;
}

interface PortfolioPerServiceShowcaseProps {
  groups: ServiceGroup[];
  whatsappUrl?: string;
}

// Helper to guarantee a minimum length for seamless screen coverage
function buildInfiniteLaneSet<T>(items: T[], targetMin: number = 8): T[] {
  if (!items || items.length === 0) return [];
  const result: T[] = [];
  while (result.length < targetMin) {
    for (const item of items) {
      result.push(item);
      if (result.length >= targetMin) break;
    }
  }
  return result;
}

export default function PortfolioPerServiceShowcase({
  groups,
  whatsappUrl = "https://wa.me/8801781955355",
}: PortfolioPerServiceShowcaseProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      {groups.map((group, groupIdx) => {
        // Split projects into two distinct sets
        const half = Math.ceil(group.projects.length / 2);
        const lane1Raw = group.projects.slice(0, half);
        const lane2Raw = group.projects.slice(half);

        // Fallbacks if one half is empty
        const l1Source = lane1Raw.length > 0 ? lane1Raw : group.projects;
        const l2Source = lane2Raw.length > 0 ? lane2Raw : group.projects;

        // Guarantee at least 8 items per group so width exceeds 2,200px (fills all screens)
        const lane1Set = buildInfiniteLaneSet(l1Source, 8);
        const lane2Set = buildInfiniteLaneSet(l2Source, 8);

        // Pre-filled WhatsApp direct message for this specific service
        const whatsappMsg = encodeURIComponent(
          `Hi Sakhawat, I saw your "${group.name}" portfolio on your website and I'd like to discuss a project with you.`
        );
        const serviceWhatsappUrl = `${whatsappUrl}?text=${whatsappMsg}`;

        return (
          <section
            key={group.id || groupIdx}
            className="service-pavilion-card reveal-on-scroll"
          >
            {/* Service Section Header */}
            <div className="container" style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "4px 12px",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(212, 255, 0, 0.08)",
                      border: "1px solid rgba(212, 255, 0, 0.2)",
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        boxShadow: "0 0 8px var(--accent)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 800,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                      }}
                    >
                      {`SERVICE 0${groupIdx + 1} / 04`}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontSize: "clamp(1.6rem, 3.4vw, 2.35rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: "#ffffff",
                      margin: "0 0 6px",
                    }}
                  >
                    {group.name}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      margin: 0,
                      maxWidth: "60ch",
                      lineHeight: 1.5,
                    }}
                  >
                    {group.tagline}
                  </p>
                </div>

                {/* WhatsApp Direct Action Button */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Link
                    href={`/services/${group.slug}`}
                    className="service-info-subtle-btn"
                  >
                    <span>Service Info</span>
                    <span>↗</span>
                  </Link>

                  <a
                    href={serviceWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-whatsapp-hero-btn"
                    aria-label={`Order ${group.name} on WhatsApp`}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.587 1.961.883 3.03.884h.005c3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.586-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.07-1.119-.071-.252-.084-.576-.198-1.002-.385-1.782-.782-2.936-2.586-3.024-2.705-.089-.119-.724-.962-.724-1.834 0-.872.457-1.3.62-1.477.164-.177.359-.221.478-.221.119 0 .239.001.343.006.109.005.257-.041.402.308.149.359.508 1.238.552 1.328.045.09.075.194.015.313-.059.119-.089.194-.179.299-.089.104-.188.233-.269.313-.089.09-.182.188-.078.368.104.179.465.768.998 1.243.687.612 1.267.802 1.446.892.179.089.284.075.388-.045.104-.119.448-.523.567-.702.119-.179.239-.149.398-.09.159.06 1.005.474 1.179.562.174.089.289.134.333.208.045.075.045.434-.099.839z" />
                    </svg>
                    <span>Order on WhatsApp</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Sliding Lanes Container: True 360 Infinite Gapless Marquee */}
            <div
              style={{
                position: "relative",
                width: "100%",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Lane 1: Continuously Drifting Left */}
              <div className="portfolio-marquee-viewport">
                <div className="portfolio-marquee-track marquee-drift-left">
                  {/* First Group */}
                  <div className="portfolio-marquee-group">
                    {lane1Set.map((item, idx) => (
                      <Link
                        key={`l1-g1-${item.id}-${idx}`}
                        href={`/portfolio/${item.slug}`}
                        className="portfolio-square-card"
                        aria-label={`View ${item.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="portfolio-square-img"
                        />
                        <div className="card-hover-overlay">
                          <span className="card-hover-badge">{item.badge}</span>
                          <h3 className="card-hover-title">{item.title}</h3>
                          <div className="card-hover-action">
                            <span>View Case Study</span>
                            <span>↗</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Second Identical Group (Ensures Seamless 360 Infinite Loop Without Any Gap) */}
                  <div className="portfolio-marquee-group" aria-hidden="true">
                    {lane1Set.map((item, idx) => (
                      <Link
                        key={`l1-g2-${item.id}-${idx}`}
                        href={`/portfolio/${item.slug}`}
                        className="portfolio-square-card"
                        tabIndex={-1}
                        aria-label={`View ${item.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="portfolio-square-img"
                        />
                        <div className="card-hover-overlay">
                          <span className="card-hover-badge">{item.badge}</span>
                          <h3 className="card-hover-title">{item.title}</h3>
                          <div className="card-hover-action">
                            <span>View Case Study</span>
                            <span>↗</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lane 2: Continuously Drifting Right */}
              <div className="portfolio-marquee-viewport">
                <div className="portfolio-marquee-track marquee-drift-right">
                  {/* First Group */}
                  <div className="portfolio-marquee-group">
                    {lane2Set.map((item, idx) => (
                      <Link
                        key={`l2-g1-${item.id}-${idx}`}
                        href={`/portfolio/${item.slug}`}
                        className="portfolio-square-card"
                        aria-label={`View ${item.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="portfolio-square-img"
                        />
                        <div className="card-hover-overlay">
                          <span className="card-hover-badge">{item.badge}</span>
                          <h3 className="card-hover-title">{item.title}</h3>
                          <div className="card-hover-action">
                            <span>View Case Study</span>
                            <span>↗</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Second Identical Group (Ensures Seamless 360 Infinite Loop Without Any Gap) */}
                  <div className="portfolio-marquee-group" aria-hidden="true">
                    {lane2Set.map((item, idx) => (
                      <Link
                        key={`l2-g2-${item.id}-${idx}`}
                        href={`/portfolio/${item.slug}`}
                        className="portfolio-square-card"
                        tabIndex={-1}
                        aria-label={`View ${item.title}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="portfolio-square-img"
                        />
                        <div className="card-hover-overlay">
                          <span className="card-hover-badge">{item.badge}</span>
                          <h3 className="card-hover-title">{item.title}</h3>
                          <div className="card-hover-action">
                            <span>View Case Study</span>
                            <span>↗</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <style jsx global>{`
        /* Service Pavilion Card Wrapper: Clearly separates each service into its own room */
        .service-pavilion-card {
          position: relative;
          background: linear-gradient(180deg, rgba(16, 18, 26, 0.85) 0%, rgba(9, 10, 15, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 36px 0 36px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .service-pavilion-card:hover {
          border-color: rgba(212, 255, 0, 0.2);
        }

        /* Hero WhatsApp Button */
        .service-whatsapp-hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #ffffff;
          font-size: 0.8125rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .service-whatsapp-hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
          filter: brightness(1.08);
        }

        /* Subtle Service Info Link */
        .service-info-subtle-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }
        .service-info-subtle-btn:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.06);
        }

        /* 360 Infinite Marquee Structure */
        .portfolio-marquee-viewport {
          width: 100%;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
        }
        .portfolio-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .portfolio-marquee-track:hover {
          animation-play-state: paused !important;
        }
        .portfolio-marquee-group {
          display: flex;
          gap: 18px;
          padding-right: 18px;
          flex-shrink: 0;
        }

        /* Keyframes: 360 Endless Gapless Drift */
        .marquee-drift-left {
          animation: infiniteDriftLeft 45s linear infinite;
        }
        .marquee-drift-right {
          animation: infiniteDriftRight 45s linear infinite;
        }

        @keyframes infiniteDriftLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes infiniteDriftRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        /* 1:1 Square Card Styling */
        .portfolio-square-card {
          width: 255px;
          height: 255px;
          border-radius: var(--radius-lg);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
          display: block;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: var(--bg-surface);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .portfolio-square-card:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: var(--accent) !important;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(212, 255, 0, 0.2) !important;
          z-index: 10;
        }
        .portfolio-square-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .portfolio-square-card:hover .portfolio-square-img {
          transform: scale(1.05);
        }

        /* Hover Overlay */
        .card-hover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7, 7, 9, 0.95) 0%, rgba(7, 7, 9, 0.4) 60%, transparent 100%);
          padding: 16px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portfolio-square-card:hover .card-hover-overlay {
          opacity: 1;
        }
        .card-hover-badge {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .card-hover-title {
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px;
          line-height: 1.25;
        }
        .card-hover-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}
