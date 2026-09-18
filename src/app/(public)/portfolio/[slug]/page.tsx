import { notFound } from "next/navigation";
import { queryOne, query } from "@/lib/db";
import { getSettings } from "@/lib/db/settings";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ContactCTA from "@/components/public/ContactCTA";
import GalleryLightbox from "@/components/public/GalleryLightbox";
import type { Project, ProjectMediaItem } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await queryOne<Project>(
    "SELECT title, seo_title, seo_description, short_description FROM projects WHERE slug = ? AND status = 'published'",
    [slug]
  );
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.seo_title || `${project.title} | Md Sakhawat Hossain`,
    description: project.seo_description || project.short_description || undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const [project, settings] = await Promise.all([
    queryOne<Project & { service_name?: string; service_slug?: string }>(`
      SELECT p.*,
        s.name as service_name, s.slug as service_slug,
        cover.storage_path as cover_path, cover.medium_path as cover_medium,
        cover.alt_text as cover_alt, cover.width as cover_width, cover.height as cover_height,
        og.storage_path as og_path
      FROM projects p
      LEFT JOIN services s ON p.service_id = s.id
      LEFT JOIN media cover ON p.cover_media_id = cover.id
      LEFT JOIN media og ON p.og_image_id = og.id
      WHERE p.slug = ? AND p.status = 'published'
    `, [slug]),
    getSettings(["contact_whatsapp_url", "contact_email"]),
  ]);

  if (!project) notFound();

  const galleryMedia = await query<ProjectMediaItem>(`
    SELECT pm.*,
      m.storage_path, m.thumb_path, m.medium_path, m.alt_text, m.mime_type, m.width, m.height,
      poster.medium_path as poster_path
    FROM project_media pm
    LEFT JOIN media m ON pm.media_id = m.id
    LEFT JOIN media poster ON pm.poster_id = poster.id
    WHERE pm.project_id = ?
    ORDER BY pm.display_order ASC
  `, [project.id]);

  const coverUrl = project.cover_media_id ? `/api/media/${project.cover_media_id}?size=medium` : null;

  return (
    <>
      <Navbar />
      <main>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{ paddingTop: "calc(var(--nav-height) + var(--space-lg))", paddingBottom: "var(--space-md)" }}
        >
          <div className="container">
            <ol style={{ display: "flex", gap: "var(--space-sm)", color: "var(--text-muted)", fontSize: "var(--text-sm)", listStyle: "none" }}>
              <li><a href="/portfolio" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Portfolio</a></li>
              <li aria-hidden="true">→</li>
              {project.service_name && (
                <>
                  <li><a href={`/services/${project.service_slug}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>{project.service_name}</a></li>
                  <li aria-hidden="true">→</li>
                </>
              )}
              <li aria-current="page" style={{ color: "var(--text-primary)" }}>{project.title}</li>
            </ol>
          </div>
        </nav>

        {/* Cover */}
        {coverUrl && (
          <div style={{ width: "100%", maxHeight: 500, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: 500 }}
            />
          </div>
        )}

        {/* Project header */}
        <section className="section-sm">
          <div className="container">
            <div style={{ maxWidth: 800 }}>
              {project.service_name && (
                <span className="badge badge-accent" style={{ marginBottom: "var(--space-md)", display: "inline-flex" }}>
                  {project.service_name}
                </span>
              )}
              <h1 style={{ marginBottom: "var(--space-md)" }}>{project.title}</h1>
              {project.short_description && (
                <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.8, marginBottom: "var(--space-xl)", maxWidth: "65ch" }}>
                  {project.short_description}
                </p>
              )}

              {/* Meta pills */}
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
                {project.client && (
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-full)", padding: "6px 16px", fontSize: "var(--text-xs)" }}>
                    <strong style={{ color: "var(--text-muted)" }}>Client:</strong> {project.client}
                  </div>
                )}
                {project.industry && (
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-full)", padding: "6px 16px", fontSize: "var(--text-xs)" }}>
                    <strong style={{ color: "var(--text-muted)" }}>Industry:</strong> {project.industry}
                  </div>
                )}
                {project.services_provided && (
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-full)", padding: "6px 16px", fontSize: "var(--text-xs)" }}>
                    <strong style={{ color: "var(--text-muted)" }}>Services:</strong> {project.services_provided}
                  </div>
                )}
              </div>
            </div>

            {/* Case study sections */}
            {(project.challenge || project.solution || project.result) && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-lg)", marginBottom: "var(--space-2xl)" }}>
                {project.challenge && (
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)" }}>
                    <h3 style={{ fontSize: "var(--text-sm)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-sm)" }}>The Challenge</h3>
                    <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.8, maxWidth: "100%" }}>{project.challenge}</p>
                  </div>
                )}
                {project.solution && (
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)" }}>
                    <h3 style={{ fontSize: "var(--text-sm)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-sm)" }}>The Solution</h3>
                    <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.8, maxWidth: "100%" }}>{project.solution}</p>
                  </div>
                )}
                {project.result && (
                  <div style={{ background: "var(--bg-surface)", border: "1px solid var(--bg-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)" }}>
                    <h3 style={{ fontSize: "var(--text-sm)", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "var(--space-sm)" }}>The Result</h3>
                    <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.8, maxWidth: "100%" }}>{project.result}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        {galleryMedia.length > 0 && (
          <section className="section-sm" style={{ background: "var(--bg-base)" }}>
            <div className="container">
              <span className="section-label">Gallery</span>
              <h2 className="section-heading" style={{ marginBottom: "var(--space-xl)" }}>Project Images</h2>
              <GalleryLightbox items={galleryMedia} projectTitle={project.title} />
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
