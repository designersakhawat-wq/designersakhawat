import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ContactCTA from "@/components/public/ContactCTA";
import { query } from "@/lib/db";
import { getSettings } from "@/lib/db/settings";
import Link from "next/link";
import Image from "next/image";
import type { Service } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services | Md Sakhawat Hossain — Creative Graphic Designer",
  description:
    "Professional graphic design services — logo & branding, packaging & label design, social media creatives, and AI video editing.",
};

export default async function ServicesPage() {
  const settings = await getSettings(["contact_whatsapp_url", "contact_email", "site_name"]);
  let services: Service[] = [];

  try {
    services = await query<Service>(`
      SELECT s.*, m.storage_path, m.thumb_path, m.medium_path, m.alt_text
      FROM services s
      LEFT JOIN media m ON s.cover_media_id = m.id
      WHERE s.deleted_at IS NULL AND s.visible = 1
      ORDER BY s.display_order ASC
    `);
  } catch {
    // Graceful fallback
  }

  // Curated showcase defaults
  const defaultServices = [
    {
      id: 1,
      name: "Logo & Branding",
      slug: "logo-branding",
      description: "Timeless visual identities, vector monograms, and comprehensive brand guideline manuals.",
      default_image: "/images/projects/project-1.webp",
      badge: "Brand Systems",
      pricing_mode: "both",
      display_order: 1,
      visible: 1,
    },
    {
      id: 2,
      name: "Packaging & Label Design",
      slug: "packaging-label-design",
      description: "Shelf-ready dielines, luxury cosmetic packaging, bottle labels, and photorealistic 3D mockups.",
      default_image: "/images/projects/project-2.webp",
      badge: "Print & 3D",
      pricing_mode: "both",
      display_order: 2,
      visible: 1,
    },
    {
      id: 3,
      name: "Social Media Design",
      slug: "social-media-design",
      description: "High-converting paid ad creatives, viral carousel sets, and scalable visual design systems.",
      default_image: "/images/projects/project-3.webp",
      badge: "Direct Response",
      pricing_mode: "both",
      display_order: 3,
      visible: 1,
    },
    {
      id: 4,
      name: "AI Video Editing",
      slug: "ai-video-editing",
      description: "Cinematic commercial reels, kinetic motion typography, and sound-synced AI promo edits.",
      default_image: "/images/projects/project-4.webp",
      badge: "Motion & Video",
      pricing_mode: "both",
      display_order: 4,
      visible: 1,
    },
  ];

  // Merge DB services with default media and metadata
  const displayServices = defaultServices.map((def) => {
    const dbMatch = services.find((s) => s.slug === def.slug || s.id === def.id);
    if (!dbMatch) return def;
    return {
      ...def,
      ...dbMatch,
      default_image: dbMatch.cover_media_id
        ? `/api/media/${dbMatch.cover_media_id}?size=medium`
        : def.default_image,
    };
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Clean Header */}
        <section
          style={{
            paddingTop: "calc(var(--nav-height) + 56px)",
            paddingBottom: "32px",
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212, 255, 0, 0.08) 0%, transparent 70%), var(--bg-deep)",
            textAlign: "center",
          }}
        >
          <div className="container">
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                display: "inline-block",
                marginBottom: 12,
              }}
            >
              Services & Capabilities
            </span>
            <h1
              style={{
                fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                marginBottom: 12,
              }}
            >
              Design Services Engineered to Convert
            </h1>
            <p
              style={{
                fontSize: "clamp(0.9375rem, 1.5vw, 1.1rem)",
                color: "var(--text-secondary)",
                maxWidth: "60ch",
                margin: "0 auto",
                lineHeight: 1.65,
              }}
            >
              From custom vector trademarks to shelf-ready luxury packaging and AI-enhanced video reels.
            </p>
          </div>
        </section>

        {/* Clean Services 2x2 Grid */}
        <section style={{ padding: "40px 0 80px", background: "var(--bg-deep)" }}>
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 28,
              }}
            >
              {displayServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="editorial-card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--bg-border)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    textDecoration: "none",
                    transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  aria-label={`View ${service.name} details`}
                >
                  {/* Service Cover Image */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16 / 9",
                      background: "var(--bg-elevated)",
                      overflow: "hidden",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.default_image}
                      alt={service.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(13, 14, 18, 0.95) 0%, transparent 60%)",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        background: "rgba(7, 7, 9, 0.85)",
                        border: "1px solid rgba(212, 255, 0, 0.3)",
                        color: "var(--accent)",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {service.badge}
                    </span>
                  </div>

                  {/* Service Body */}
                  <div
                    style={{
                      padding: "24px 28px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          fontSize: "1.375rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          marginBottom: 8,
                          lineHeight: 1.25,
                        }}
                      >
                        {service.name}
                      </h2>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--text-secondary)",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {service.description}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: 18,
                        marginTop: 18,
                        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: "var(--accent)",
                        }}
                      >
                        Explore Service Gallery
                      </span>
                      <span
                        style={{
                          fontSize: "1.1rem",
                          color: "var(--accent)",
                          transition: "transform 0.2s ease",
                        }}
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <ContactCTA
          whatsappUrl={settings.contact_whatsapp_url || "https://wa.me/8801781955355"}
          email={settings.contact_email || "designersakhawat86@gmail.com"}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
