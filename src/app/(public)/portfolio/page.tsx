import { query } from "@/lib/db";
import { getSettings } from "@/lib/db/settings";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import PortfolioPerServiceShowcase from "@/components/public/PortfolioPerServiceShowcase";
import ContactCTA from "@/components/public/ContactCTA";
import type { Project, Service } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio | Md Sakhawat Hossain — Creative Graphic Designer",
  description:
    "Explore curated commercial projects across logo & branding, packaging design, social media campaigns, and AI video editing.",
};

type ExtendedProject = Project & {
  service_name?: string;
  service_slug?: string;
};

export default async function PortfolioPage() {
  const settings = await getSettings(["contact_whatsapp_url", "contact_email"]);
  let projects: ExtendedProject[] = [];
  let services: Service[] = [];

  try {
    [projects, services] = await Promise.all([
      query<ExtendedProject>(`
        SELECT p.*,
          s.name as service_name, s.slug as service_slug,
          m.storage_path as cover_path, m.thumb_path as cover_thumb, m.medium_path as cover_medium, m.alt_text as cover_alt
        FROM projects p
        LEFT JOIN services s ON p.service_id = s.id
        LEFT JOIN media m ON p.cover_media_id = m.id
        WHERE p.status = 'published'
        ORDER BY p.display_order ASC, p.published_at DESC
      `),
      query<Service>(
        "SELECT id, name, slug FROM services WHERE deleted_at IS NULL AND visible = 1 ORDER BY display_order ASC"
      ),
    ]);
  } catch {
    // Graceful fallback
  }

  // Define the 4 core service groups with curated high-res works (unique imagery per card)
  const serviceConfigs = [
    {
      id: 1,
      name: "Logo & Branding",
      slug: "logo-branding",
      tagline: "Timeless visual identities, vector monograms, and comprehensive brand books.",
      badge: "Brand Identity",
      defaultProjects: [
        {
          id: "aura-tech",
          title: "Aura Tech — Minimalist Cloud Identity",
          slug: "aura-tech-brand-identity",
          image: "/images/projects/project-1.webp",
          badge: "Brand Guidelines",
        },
        {
          id: "branding-arcada",
          title: "Arcada Modern — Geometric Monogram & Stationery",
          slug: "aura-tech-brand-identity",
          image: "/images/projects/branding-arcada.jpg",
          badge: "Monogram & Print",
        },
        {
          id: "veloce-motors",
          title: "Veloce Motors — Luxury Automotive Monogram",
          slug: "veloce-motors-identity",
          image: "/images/projects/project-6.webp",
          badge: "Automotive Monogram",
        },
        {
          id: "zenith-mark",
          title: "Zenith Nexus — Geometric Brandmark",
          slug: "aura-tech-brand-identity",
          image: "/images/projects/project-7.webp",
          badge: "Vector Logo",
        },
        {
          id: "horizon-tech",
          title: "Horizon Labs — Corporate Identity System",
          slug: "veloce-motors-identity",
          image: "/images/projects/project-8.webp",
          badge: "Design System",
        },
        {
          id: "apex-mark",
          title: "Apex Core — High-Tech Emblem",
          slug: "aura-tech-brand-identity",
          image: "/images/projects/project-1.webp",
          badge: "Emblem Design",
        },
      ],
    },
    {
      id: 3,
      name: "Packaging & Label Design",
      slug: "packaging-label-design",
      tagline: "Shelf-ready dielines, luxury cosmetics packaging, and 3D product renders.",
      badge: "Packaging",
      defaultProjects: [
        {
          id: "maison-luxe",
          title: "Maison Luxe — Perfume Bottle & Dieline",
          slug: "maison-luxe-packaging",
          image: "/images/projects/project-2.webp",
          badge: "Luxury Bottle",
        },
        {
          id: "aethel-tea",
          title: "Aethel Organics — Herbal Tea Box & Foil Pouch",
          slug: "botanica-tea-packaging",
          image: "/images/projects/pkg-tea-box.jpg",
          badge: "Eco Packaging",
        },
        {
          id: "aurelia-serum",
          title: "Aurelia Skincare — Dropper Bottle & Box",
          slug: "maison-luxe-packaging",
          image: "/images/projects/pkg-cosmetics.jpg",
          badge: "Luxury Cosmetics",
        },
        {
          id: "arcturus-coffee",
          title: "The Arcturus Blend — Specialty Coffee Bag",
          slug: "botanica-tea-packaging",
          image: "/images/projects/pkg-coffee.jpg",
          badge: "Specialty Roast",
        },
        {
          id: "botanica-box",
          title: "Botanica Organics — Gold Foil Packaging",
          slug: "botanica-tea-packaging",
          image: "/images/projects/pkg-tea-box.jpg",
          badge: "Print Ready",
        },
        {
          id: "luxe-perfume-matte",
          title: "Maison Luxe Noir — Limited Edition Perfume",
          slug: "maison-luxe-packaging",
          image: "/images/projects/project-2.webp",
          badge: "Limited Edition",
        },
      ],
    },
    {
      id: 2,
      name: "Social Media Design",
      slug: "social-media-design",
      tagline: "High-converting Instagram carousel ads, promotional kits, and design systems.",
      badge: "Social Media",
      defaultProjects: [
        {
          id: "apex-athletics",
          title: "Apex Athletics — High-CTR Promo Campaign",
          slug: "apex-athletics-social-campaign",
          image: "/images/projects/project-3.webp",
          badge: "Ad Campaign",
        },
        {
          id: "fintrack-carousel",
          title: "FinTrack — Fintech Analytics Carousel",
          slug: "apex-athletics-social-campaign",
          image: "/images/projects/social-fintech.jpg",
          badge: "Instagram Carousel",
        },
        {
          id: "astra-sneaker",
          title: "Astra Kinetic — Streetwear Limited Drop Ad",
          slug: "apex-athletics-social-campaign",
          image: "/images/projects/social-sneaker.jpg",
          badge: "Product Drop Ad",
        },
        {
          id: "urban-pulse",
          title: "Urban Pulse — Instagram Growth Carousel",
          slug: "apex-athletics-social-campaign",
          image: "/images/projects/project-3.webp",
          badge: "Growth Creatives",
        },
        {
          id: "fintrack-stories",
          title: "FinTrack Dark Mode — Promo Stories",
          slug: "apex-athletics-social-campaign",
          image: "/images/projects/social-fintech.jpg",
          badge: "Story Ads",
        },
        {
          id: "kinetic-drop-story",
          title: "Astra Streetwear — Animated Story Kit",
          slug: "apex-athletics-social-campaign",
          image: "/images/projects/social-sneaker.jpg",
          badge: "E-Commerce Kit",
        },
      ],
    },
    {
      id: 4,
      name: "AI Video Editing",
      slug: "ai-video-editing",
      tagline: "Cinematic commercial reels, AI motion graphics, and sound-synced video ads.",
      badge: "AI Video",
      defaultProjects: [
        {
          id: "zenith-ai-vid",
          title: "Zenith AI — Launch Video & Motion Graphics",
          slug: "zenith-ai-brand-video",
          image: "/images/projects/project-4.webp",
          badge: "AI Motion",
        },
        {
          id: "hypercar-drift",
          title: "Apex Hypercar — Tokyo Night Drift Commercial",
          slug: "zenith-ai-brand-video",
          image: "/images/projects/video-hypercar.jpg",
          badge: "Commercial Reel",
        },
        {
          id: "cybercore-ai",
          title: "CyberCore AI — VFX Motion Reel & Hologram",
          slug: "zenith-ai-brand-video",
          image: "/images/projects/video-ai-cyber.jpg",
          badge: "VFX & Hologram",
        },
        {
          id: "cyber-pulse",
          title: "CyberPulse — Commercial Promo Reel",
          slug: "zenith-ai-brand-video",
          image: "/images/projects/project-4.webp",
          badge: "Cinematic Reel",
        },
        {
          id: "night-drift-cinematic",
          title: "Hypercar Drift — 4K Color Grade Cut",
          slug: "zenith-ai-brand-video",
          image: "/images/projects/video-hypercar.jpg",
          badge: "Color Grade",
        },
        {
          id: "ai-humanoid-vfx",
          title: "Neural Core — 3D Cybernetic Title Sequence",
          slug: "zenith-ai-brand-video",
          image: "/images/projects/video-ai-cyber.jpg",
          badge: "Title Sequence",
        },
      ],
    },
  ];

  // Map each service config with DB projects if available
  const serviceGroups = serviceConfigs.map((cfg) => {
    // Find matching projects from DB for this service
    const matchingDbProjects = projects.filter(
      (p) =>
        p.service_id === cfg.id ||
        (p.service_slug && p.service_slug === cfg.slug) ||
        (p.service_name && p.service_name.toLowerCase().includes(cfg.name.toLowerCase()))
    );

    let mappedProjects: Array<{
      id: number | string;
      title: string;
      slug: string;
      image: string;
      badge: string;
    }> = matchingDbProjects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      image: p.cover_media_id
        ? `/api/media/${p.cover_media_id}?size=medium`
        : cfg.defaultProjects[0].image,
      badge: cfg.badge,
    }));

    // Ensure at least 6 distinct items per service by combining with curated defaults
    const combined = [...mappedProjects];
    for (const def of cfg.defaultProjects) {
      if (combined.length >= 6) break;
      if (!combined.some((p) => p.title === def.title)) {
        combined.push(def);
      }
    }

    return {
      id: cfg.id,
      name: cfg.name,
      slug: cfg.slug,
      tagline: cfg.tagline,
      projects: combined,
    };
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section
          style={{
            paddingTop: "calc(var(--nav-height) + 56px)",
            paddingBottom: "36px",
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
              Curated Portfolio
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
              Selected Commercial Works
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
              Arranged by discipline: explore brand identities, shelf-ready packaging, social growth creatives, and AI motion reels.
            </p>
          </div>
        </section>

        {/* Per-Service Sliding Showcase */}
        <section style={{ padding: "40px 0 80px", background: "var(--bg-deep)" }}>
          <PortfolioPerServiceShowcase
            groups={serviceGroups}
            whatsappUrl={settings.contact_whatsapp_url || "https://wa.me/8801781955355"}
          />
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
