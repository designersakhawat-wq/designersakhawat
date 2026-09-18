import { notFound } from "next/navigation";
import { queryOne, query } from "@/lib/db";
import { getSettings } from "@/lib/db/settings";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ProjectsSection from "@/components/public/ProjectsSection";
import ContactCTA from "@/components/public/ContactCTA";
import PricingSection from "@/components/public/PricingSection";
import type { Service, ServicePackage, Project } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await queryOne<Service>(
    "SELECT * FROM services WHERE slug = ? AND deleted_at IS NULL AND visible = 1",
    [slug]
  );
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} | Md Sakhawat Hossain`,
    description: service.description || `Professional ${service.name} services by Md Sakhawat Hossain.`,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  const [service, settings] = await Promise.all([
    queryOne<Service>(`
      SELECT s.*, m.storage_path, m.thumb_path, m.medium_path, m.alt_text
      FROM services s
      LEFT JOIN media m ON s.cover_media_id = m.id
      WHERE s.slug = ? AND s.deleted_at IS NULL AND s.visible = 1
    `, [slug]),
    getSettings(["contact_whatsapp_url", "contact_email", "contact_whatsapp"]),
  ]);

  if (!service) notFound();

  const [packages, projects] = await Promise.all([
    query<ServicePackage>(
      "SELECT * FROM service_packages WHERE service_id = ? AND visible = 1 ORDER BY display_order ASC",
      [service.id]
    ),
    query<Project>(`
      SELECT p.*,
        m.storage_path as cover_path, m.thumb_path as cover_thumb, m.alt_text as cover_alt
      FROM projects p
      LEFT JOIN media m ON p.cover_media_id = m.id
      WHERE p.service_id = ? AND p.status = 'published'
      ORDER BY p.display_order ASC, p.published_at DESC
    `, [service.id]),
  ]);

  const whatsappBase = "https://wa.me/8801781955355";
  const whatsappMsg = encodeURIComponent(`Hi Sakhawat, I'm interested in your ${service.name} service.`);
  const whatsappUrl = `${whatsappBase}?text=${whatsappMsg}`;
  const coverUrl = service.cover_media_id ? `/api/media/${service.cover_media_id}?size=medium` : null;

  const showPricing = service.pricing_mode === "pricing" || service.pricing_mode === "both";
  const showQuote = service.pricing_mode === "quote_only" || service.pricing_mode === "both";

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section style={{ paddingTop: "calc(var(--nav-height) + var(--space-3xl))", paddingBottom: "var(--space-2xl)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: coverUrl ? "1fr 1fr" : "1fr", gap: "var(--space-3xl)", alignItems: "center" }}>
              <div>
                <a href="/services" style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-md)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  ← Back to Services
                </a>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "var(--space-md)" }}>
                  {service.name}
                </h1>
                {service.description && (
                  <p style={{ fontSize: "var(--text-lg)", color: "var(--text-secondary)", marginBottom: "var(--space-xl)", lineHeight: 1.8, maxWidth: "60ch" }}>
                    {service.description}
                  </p>
                )}
                <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    💬 Get a Quote on WhatsApp
                  </a>
                  <a href={`mailto:${settings.contact_email || "designersakhawat86@gmail.com"}?subject=${encodeURIComponent(service.name + " Inquiry")}`} className="btn btn-outline">
                    ✉️ Email Me
                  </a>
                </div>
              </div>

              {coverUrl && (
                <div style={{ borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "16/9" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverUrl} alt={service.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing */}
        {(showPricing || showQuote) && (
          <PricingSection
            packages={showPricing ? packages : []}
            showQuote={showQuote}
            serviceName={service.name}
            whatsappBase={whatsappBase}
            email={settings.contact_email || "designersakhawat86@gmail.com"}
          />
        )}

        {/* Projects gallery */}
        {projects.length > 0 && (
          <ProjectsSection
            projects={projects}
            title={`${service.name} Projects`}
            label="Gallery"
          />
        )}

        {projects.length === 0 && (
          <section className="section-sm">
            <div className="container">
              <div className="empty-state">
                <div className="empty-state-icon">🎨</div>
                <h2 className="empty-state-title">Projects Coming Soon</h2>
                <p className="empty-state-desc">Portfolio pieces for this service will be added soon.</p>
              </div>
            </div>
          </section>
        )}

        <ContactCTA
          whatsappUrl={settings.contact_whatsapp_url || "https://wa.me/8801781955355"}
          email={settings.contact_email || "designersakhawat86@gmail.com"}
        />
      </main>
      <Footer settings={settings} />
    </>
  );
}
