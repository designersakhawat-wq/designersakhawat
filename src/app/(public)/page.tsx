import { query } from "@/lib/db";
import { getSettings } from "@/lib/db/settings";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import ProjectsSection from "@/components/public/ProjectsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import ContactCTA from "@/components/public/ContactCTA";
import ClientLogosSection from "@/components/public/ClientLogosSection";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import type { Service, Project, Testimonial, ClientLogo, Industry } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60; // ISR

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings([
    "site_name", "site_tagline", "seo_default_description",
  ]);
  return {
    title: `${settings.site_name || "Md Sakhawat Hossain"} — ${settings.site_tagline || "Creative Graphic Designer"}`,
    description: settings.seo_default_description,
  };
}

export default async function HomePage() {
  const settings = await getSettings([
    "site_name", "site_tagline",
    "hero_headline", "hero_subline",
    "hero_cta_primary_label", "hero_cta_primary_href",
    "hero_cta_secondary_label", "hero_cta_secondary_href",
    "about_bio",
    "contact_whatsapp_url", "contact_email",
    "hero_portrait_media_id",
  ]);

  let services: Service[] = [];
  let featuredProjects: Project[] = [];
  let testimonials: Testimonial[] = [];
  let clientLogos: ClientLogo[] = [];

  try {
    [services, featuredProjects, testimonials, clientLogos] = await Promise.all([
      query<Service>(`
        SELECT s.*, m.storage_path, m.thumb_path, m.medium_path, m.alt_text
        FROM services s
        LEFT JOIN media m ON s.cover_media_id = m.id
        WHERE s.deleted_at IS NULL AND s.visible = 1
        ORDER BY s.display_order ASC
        LIMIT 8
      `),
      query<Project>(`
        SELECT p.id, p.title, p.slug, p.cover_media_id, p.service_id, 
          p.client, p.short_description, p.featured, p.display_order, p.status,
          m.storage_path as cover_path, m.thumb_path as cover_thumb, m.medium_path as cover_medium, m.alt_text as cover_alt,
          s.name as service_name, s.slug as service_slug
        FROM projects p
        LEFT JOIN media m ON p.cover_media_id = m.id
        LEFT JOIN services s ON p.service_id = s.id
        WHERE p.status = 'published' AND p.featured = 1
        ORDER BY p.display_order ASC
        LIMIT 6
      `),
      query<Testimonial>(`
        SELECT t.id, 
          COALESCE(t.author_name, t.client_name) as client_name,
          COALESCE(t.author_role, t.designation) as designation,
          t.company,
          COALESCE(t.content, t.text) as text,
          t.rating,
          t.photo_media_id,
          m.storage_path, m.thumb_path, m.alt_text
        FROM testimonials t
        LEFT JOIN media m ON t.photo_media_id = m.id
        WHERE t.deleted_at IS NULL AND t.visible = 1
        ORDER BY t.display_order ASC
      `),
      query<ClientLogo>(`
        SELECT cl.*, m.storage_path, m.thumb_path, m.alt_text
        FROM client_logos cl
        LEFT JOIN media m ON cl.media_id = m.id
        WHERE cl.deleted_at IS NULL AND cl.visible = 1
        ORDER BY cl.display_order ASC
      `),
    ]);
  } catch {
    // Graceful fallback
  }

  // Fallbacks
  if (services.length === 0) {
    services = [
      { id: 1, name: "Logo & Branding", slug: "logo-branding", description: "Timeless brand identities and guidelines that command attention.", cover_media_id: null, pricing_mode: "both", display_order: 1, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 2, name: "Social Media Design", slug: "social-media-design", description: "High-converting Instagram carousels and ads engineered for engagement.", cover_media_id: null, pricing_mode: "both", display_order: 2, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 3, name: "Packaging & Label Design", slug: "packaging-label-design", description: "Shelf-ready dielines, bottle labels, and 3D product mockups.", cover_media_id: null, pricing_mode: "both", display_order: 3, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 4, name: "AI Video Editing", slug: "ai-video-editing", description: "Cinematic reels, motion graphics, and video edits for modern marketing.", cover_media_id: null, pricing_mode: "both", display_order: 4, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
    ];
  }

  if (featuredProjects.length === 0) {
    featuredProjects = [
      { id: 1, title: "Aura Tech — Minimalist Brand Identity & Guidelines", slug: "aura-tech-brand-identity", cover_media_id: null, service_id: 1, client: "Aura Technologies", short_description: "Complete visual identity system with logo guidelines and stationery design for a modern cloud platform.", featured: 1, display_order: 1, status: "published", deleted_at: null, created_at: "", updated_at: "", service_name: "Logo & Branding" } as unknown as Project,
      { id: 2, title: "Maison Luxe — Premium Perfume Packaging & 3D Mockup", slug: "maison-luxe-packaging", cover_media_id: null, service_id: 3, client: "Maison Luxe Cosmetics", short_description: "Luxury packaging and bottle label design featuring gold foil typography and 3D mockups.", featured: 1, display_order: 2, status: "published", deleted_at: null, created_at: "", updated_at: "", service_name: "Packaging Design" } as unknown as Project,
      { id: 3, title: "Apex Athletics — High-Conversion Social Media Ad Campaign", slug: "apex-athletics-social-campaign", cover_media_id: null, service_id: 2, client: "Apex Athletics", short_description: "Set of 30+ high-energy Instagram and Facebook promo creatives and carousel ads.", featured: 1, display_order: 3, status: "published", deleted_at: null, created_at: "", updated_at: "", service_name: "Social Media Design" } as unknown as Project,
      { id: 4, title: "Zenith AI — Dynamic Brand Video & AI Motion Graphics", slug: "zenith-ai-brand-video", cover_media_id: null, service_id: 4, client: "Zenith AI Labs", short_description: "Cinematic promo video editing with animated typography and sound design for a product launch.", featured: 1, display_order: 4, status: "published", deleted_at: null, created_at: "", updated_at: "", service_name: "AI Video Editing" } as unknown as Project,
    ];
  }

  if (testimonials.length === 0) {
    testimonials = [
      { id: 1, client_name: "Alex Morgan", designation: "Founder & CEO", company: "Aura Tech Solutions", text: "Sakhawat transformed our tech brand identity completely. The logo and brand guidelines he delivered elevated our product to look like an established market leader. Exceptional communication and fast delivery!", photo_media_id: null, rating: 5, display_order: 1, visible: 1, deleted_at: null, created_at: "", updated_at: "" } as unknown as Testimonial,
      { id: 2, client_name: "Sophie Laurent", designation: "Creative Director", company: "Maison Luxe Cosmetics", text: "Working with Sakhawat on our luxury skincare packaging was an absolute pleasure. His eye for typography, minimalist aesthetics, and realistic 3D mockups exceeded all expectations.", photo_media_id: null, rating: 5, display_order: 2, visible: 1, deleted_at: null, created_at: "", updated_at: "" } as unknown as Testimonial,
      { id: 3, client_name: "Rahim Ahmed", designation: "Co-Founder", company: "QuickMart E-Commerce", text: "The social media creatives and promo ad kits Sakhawat designed gave us an instant 45% bump in conversion rates. He is our go-to designer for every product launch!", photo_media_id: null, rating: 5, display_order: 3, visible: 1, deleted_at: null, created_at: "", updated_at: "" } as unknown as Testimonial,
      { id: 4, client_name: "Marcus Vance", designation: "Lead Producer", company: "Pulse Media Agency", text: "The AI video editing and promotional motion graphics Sakhawat created were mesmerizing. He has a brilliant sense of timing, rhythm, and visual storytelling on an elite level.", photo_media_id: null, rating: 5, display_order: 4, visible: 1, deleted_at: null, created_at: "", updated_at: "" } as unknown as Testimonial,
    ];
  }

  if (clientLogos.length === 0) {
    clientLogos = [
      { id: 1, name: "Aura Technologies", media_id: null, website_url: null, display_order: 1, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 2, name: "Maison Luxe", media_id: null, website_url: null, display_order: 2, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 3, name: "Apex Athletics", media_id: null, website_url: null, display_order: 3, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 4, name: "Nordic Wood Craft", media_id: null, website_url: null, display_order: 4, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 5, name: "Pulse Media Global", media_id: null, website_url: null, display_order: 5, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
      { id: 6, name: "Zenith AI Labs", media_id: null, website_url: null, display_order: 6, visible: 1, deleted_at: null, created_at: "", updated_at: "" },
    ];
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Reference 1: Hero with Fan-Out Card Deck */}
        <HeroSection settings={settings} />

        {/* Dynamic Infinite Brand Marquee */}
        <ClientLogosSection logos={clientLogos} />

        {/* Streamlined Core Services */}
        <ServicesSection services={services} />

        {/* Featured Work Grid */}
        <ProjectsSection
          projects={featuredProjects}
          title="Featured Work"
          label="Portfolio"
          showViewAll
        />

        {/* 5-Star Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* High-Converting Contact CTA */}
        <ContactCTA
          whatsappUrl={settings.contact_whatsapp_url || "https://wa.me/8801781955355"}
          email={settings.contact_email || "designersakhawat86@gmail.com"}
        />
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp number="8801781955355" />
    </>
  );
}
