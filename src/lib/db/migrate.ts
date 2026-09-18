import { execute, query } from "./index";

/**
 * Safe migration runner - idempotent, uses IF NOT EXISTS / IF NOT EXISTS column guards.
 * Safe to run on every deploy - never drops or truncates existing tables.
 */
export async function migrate(): Promise<void> {
  console.log("Running database migrations...");

  // ── media ──────────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS media (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      filename     VARCHAR(255)  NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      mime_type    VARCHAR(100)  NOT NULL,
      size         INT           NOT NULL,
      width        INT           NULL,
      height       INT           NULL,
      alt_text     TEXT          NULL,
      focal_x      FLOAT         NULL DEFAULT 0.5,
      focal_y      FLOAT         NULL DEFAULT 0.5,
      storage_path VARCHAR(512)  NOT NULL,
      thumb_path   VARCHAR(512)  NULL,
      medium_path  VARCHAR(512)  NULL,
      webp_path    VARCHAR(512)  NULL,
      created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── settings ────────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS settings (
      \`key\`        VARCHAR(100) PRIMARY KEY,
      value        LONGTEXT     NULL,
      updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── services ────────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS services (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      name           VARCHAR(255)  NOT NULL,
      slug           VARCHAR(255)  NOT NULL UNIQUE,
      description    TEXT          NULL,
      cover_media_id INT           NULL,
      pricing_mode   ENUM('quote_only','pricing','both') NOT NULL DEFAULT 'quote_only',
      display_order  INT           NOT NULL DEFAULT 0,
      visible        TINYINT(1)    NOT NULL DEFAULT 1,
      deleted_at     DATETIME      NULL,
      created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── service_packages ────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS service_packages (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      service_id      INT           NOT NULL,
      name            VARCHAR(255)  NOT NULL,
      price           DECIMAL(10,2) NULL,
      currency        VARCHAR(10)   NOT NULL DEFAULT 'USD',
      is_starting_from TINYINT(1)   NOT NULL DEFAULT 0,
      description     TEXT          NULL,
      features_json   JSON          NULL,
      display_order   INT           NOT NULL DEFAULT 0,
      visible         TINYINT(1)    NOT NULL DEFAULT 1,
      created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── projects ────────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id                 INT AUTO_INCREMENT PRIMARY KEY,
      title              VARCHAR(255)  NOT NULL,
      slug               VARCHAR(255)  NOT NULL UNIQUE,
      cover_media_id     INT           NULL,
      service_id         INT           NULL,
      client             VARCHAR(255)  NULL,
      industry           VARCHAR(255)  NULL,
      short_description  TEXT          NULL,
      challenge          TEXT          NULL,
      solution           TEXT          NULL,
      result             TEXT          NULL,
      services_provided  TEXT          NULL,
      featured           TINYINT(1)    NOT NULL DEFAULT 0,
      display_order      INT           NOT NULL DEFAULT 0,
      status             ENUM('draft','published','trashed') NOT NULL DEFAULT 'draft',
      seo_title          VARCHAR(255)  NULL,
      seo_description    TEXT          NULL,
      og_image_id        INT           NULL,
      deleted_at         DATETIME      NULL,
      published_at       DATETIME      NULL,
      created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (cover_media_id) REFERENCES media(id) ON DELETE SET NULL,
      FOREIGN KEY (service_id)     REFERENCES services(id) ON DELETE SET NULL,
      FOREIGN KEY (og_image_id)    REFERENCES media(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── project_media ────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS project_media (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      project_id    INT           NOT NULL,
      media_id      INT           NULL,
      video_url     VARCHAR(512)  NULL,
      video_type    ENUM('file','youtube','vimeo') NULL,
      poster_id     INT           NULL,
      display_order INT           NOT NULL DEFAULT 0,
      type          ENUM('image','video') NOT NULL DEFAULT 'image',
      created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (media_id)   REFERENCES media(id)    ON DELETE CASCADE,
      FOREIGN KEY (poster_id)  REFERENCES media(id)    ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── testimonials ─────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      author_name    VARCHAR(255)  NOT NULL,
      author_role    VARCHAR(255)  NULL,
      company        VARCHAR(255)  NULL,
      photo_media_id INT          NULL,
      content        TEXT          NOT NULL,
      rating         TINYINT      NOT NULL DEFAULT 5,
      display_order  INT           NOT NULL DEFAULT 0,
      visible        TINYINT(1)    NOT NULL DEFAULT 1,
      project_id     INT           NULL,
      avatar_media_id INT          NULL,
      deleted_at     DATETIME      NULL,
      created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (photo_media_id) REFERENCES media(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── client_logos ─────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS client_logos (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(255)  NOT NULL,
      media_id      INT           NULL,
      website_url   VARCHAR(512)  NULL,
      display_order INT           NOT NULL DEFAULT 0,
      visible       TINYINT(1)    NOT NULL DEFAULT 1,
      deleted_at    DATETIME      NULL,
      created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── industries ───────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS industries (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(255)  NOT NULL,
      icon          VARCHAR(100)  NULL,
      display_order INT           NOT NULL DEFAULT 0,
      visible       TINYINT(1)    NOT NULL DEFAULT 1,
      created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── inquiries ─────────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255)  NOT NULL,
      email      VARCHAR(255)  NOT NULL,
      service    VARCHAR(255)  NULL,
      message    TEXT          NOT NULL,
      budget     VARCHAR(100)  NULL,
      ip_hash    VARCHAR(64)   NULL,
      read_at    DATETIME      NULL,
      created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── activity_log ─────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      action      VARCHAR(100)  NOT NULL,
      entity_type VARCHAR(100)  NULL,
      entity_id   INT           NULL,
      detail      TEXT          NULL,
      created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // ── admin_users ───────────────────────────────────────────────────────────
  await execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      email         VARCHAR(255)  NOT NULL UNIQUE,
      password_hash VARCHAR(255)  NOT NULL,
      name          VARCHAR(255)  NULL,
      created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
      last_login    DATETIME      NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log("✅ Migrations complete.");
}

/**
 * Seed initial data - checks each table independently and inserts missing data.
 * Safe to run multiple times.
 */
export async function seed(): Promise<void> {
  console.log("Checking and enriching seed data...");

  // 1. Services
  const existingServices = await query<{ id: number; slug: string }>("SELECT id, slug FROM services");
  const serviceMap = new Map<string, number>();
  existingServices.forEach((s) => serviceMap.set(s.slug, s.id));

  const initialServices = [
    {
      name: "Logo & Branding",
      slug: "logo-branding",
      description: "From conceptual discovery to final guidelines, I craft timeless logos, cohesive color systems, typography hierarchies, and complete brand identity packages that command attention and drive recognition.",
      order: 1,
    },
    {
      name: "Social Media Design",
      slug: "social-media-design",
      description: "High-converting visual creatives engineered for digital engagement: eye-catching Instagram feeds, carousel infographics, Facebook ad creatives, YouTube thumbnails, and LinkedIn banners tailored to captivate your audience.",
      order: 2,
    },
    {
      name: "Packaging & Label Design",
      slug: "packaging-label-design",
      description: "Shelf-ready packaging and label designs that convert browsing into buying: print-ready dielines, 3D product mockups, premium finishes, bottle labels, box packaging, and pouch designs.",
      order: 3,
    },
    {
      name: "AI Video Editing",
      slug: "ai-video-editing",
      description: "Cutting-edge AI-assisted video editing for reels, ads, and product demos: dynamic pacing, cinematic transitions, AI voice sync, caption styling, color grading, and motion graphics optimized for modern platforms.",
      order: 4,
    },
  ];

  for (const svc of initialServices) {
    if (!serviceMap.has(svc.slug)) {
      const res = await execute(
        "INSERT INTO services (name, slug, description, display_order, visible, pricing_mode) VALUES (?, ?, ?, ?, 1, 'both')",
        [svc.name, svc.slug, svc.description, svc.order]
      );
      serviceMap.set(svc.slug, res.insertId);
    } else {
      await execute(
        "UPDATE services SET description = COALESCE(description, ?) WHERE slug = ?",
        [svc.description, svc.slug]
      );
    }
  }

  // 2. Testimonials
  const existingTestimonials = await query("SELECT id FROM testimonials LIMIT 1");
  if (existingTestimonials.length === 0) {
    console.log("Seeding testimonials...");
    const testimonials = [
      {
        author_name: "Alex Morgan",
        author_role: "Founder & CEO",
        company: "Aura Tech Solutions",
        content: "Sakhawat transformed our tech brand identity completely. The logo and brand guidelines he delivered elevated our product to look like an established market leader. Exceptional communication, pixel-perfect attention to detail, and fast delivery!",
        rating: 5,
        display_order: 1,
      },
      {
        author_name: "Sophie Laurent",
        author_role: "Creative Director",
        company: "Maison Luxe Cosmetics",
        content: "Working with Sakhawat on our luxury skincare packaging design was an absolute pleasure. His eye for luxury typography, minimalist packaging aesthetics, and realistic 3D mockups exceeded all expectations.",
        rating: 5,
        display_order: 2,
      },
      {
        author_name: "Rahim Ahmed",
        author_role: "Co-Founder",
        company: "QuickMart E-Commerce",
        content: "The promotional ad creatives and social media post kits Sakhawat created for our campaign gave us an instant 45% bump in click-through rates. He is our go-to designer for every launch!",
        rating: 5,
        display_order: 3,
      },
      {
        author_name: "Marcus Vance",
        author_role: "Lead Producer",
        company: "Pulse Media Agency",
        content: "The AI video editing and promotional motion graphics Sakhawat created were mesmerizing. He has a brilliant sense of timing, rhythm, and visual storytelling on an elite level.",
        rating: 5,
        display_order: 4,
      },
    ];

    for (const t of testimonials) {
      await execute(
        "INSERT INTO testimonials (author_name, author_role, company, content, rating, display_order, visible) VALUES (?, ?, ?, ?, ?, ?, 1)",
        [t.author_name, t.author_role, t.company, t.content, t.rating, t.display_order]
      );
    }
  }

  // 3. Client Logos
  const existingLogos = await query("SELECT id FROM client_logos LIMIT 1");
  if (existingLogos.length === 0) {
    console.log("Seeding client logos...");
    const logos = [
      { name: "Aura Technologies", url: "https://auratech.example.com", order: 1 },
      { name: "Maison Luxe", url: "https://maisonluxe.example.com", order: 2 },
      { name: "Apex Athletics", url: "https://apexathletics.example.com", order: 3 },
      { name: "Nordic Wood Craft", url: "https://nordicwood.example.com", order: 4 },
      { name: "Pulse Media Global", url: "https://pulsemedia.example.com", order: 5 },
      { name: "Zenith AI Labs", url: "https://zenithai.example.com", order: 6 },
    ];
    for (const l of logos) {
      await execute(
        "INSERT INTO client_logos (name, website_url, display_order, visible) VALUES (?, ?, ?, 1)",
        [l.name, l.url, l.order]
      );
    }
  }

  // 4. Projects
  const existingProjects = await query("SELECT id FROM projects LIMIT 1");
  if (existingProjects.length === 0) {
    console.log("Seeding projects...");
    const brandingId = serviceMap.get("logo-branding") || null;
    const packagingId = serviceMap.get("packaging-label-design") || null;
    const socialId = serviceMap.get("social-media-design") || null;
    const videoId = serviceMap.get("ai-video-editing") || null;

    const sampleProjects = [
      {
        title: "Aura Tech — Minimalist Brand Identity & Guidelines",
        slug: "aura-tech-brand-identity",
        description: "Comprehensive brand identity system including logo design, color palette, custom iconography, and brand guideline manual for a cutting-edge cloud infrastructure platform.",
        service_id: brandingId,
        client_name: "Aura Technologies",
        completion_year: 2024,
        status: "published",
        featured: 1,
        display_order: 1,
      },
      {
        title: "Maison Luxe — Premium Perfume Packaging & 3D Mockup",
        slug: "maison-luxe-packaging",
        description: "Luxury packaging and bottle label design featuring gold foil accents, bespoke serif typography, and ultra-realistic 3D box mockups ready for commercial production.",
        service_id: packagingId,
        client_name: "Maison Luxe Cosmetics",
        completion_year: 2024,
        status: "published",
        featured: 1,
        display_order: 2,
      },
      {
        title: "Apex Athletics — High-Conversion Social Media Ad Campaign",
        slug: "apex-athletics-social-campaign",
        description: "Set of 30+ high-energy Instagram and Facebook promo creatives, carousel ads, and story templates optimized for e-commerce conversion and brand awareness.",
        service_id: socialId,
        client_name: "Apex Athletics",
        completion_year: 2024,
        status: "published",
        featured: 1,
        display_order: 3,
      },
      {
        title: "Zenith AI — Dynamic Brand Video & AI Motion Graphics",
        slug: "zenith-ai-brand-video",
        description: "AI-assisted promo video editing with cinematic transitions, dynamic text animations, sound design, and color grading for a breakthrough SaaS product launch.",
        service_id: videoId,
        client_name: "Zenith AI Labs",
        completion_year: 2024,
        status: "published",
        featured: 1,
        display_order: 4,
      },
      {
        title: "Botanica Organics — Sustainable Tea Box & Label Design",
        slug: "botanica-tea-packaging",
        description: "Eco-friendly, botanical packaging design for an artisanal organic tea collection with earthy color harmony, custom patterns, and hand-drawn line art.",
        service_id: packagingId,
        client_name: "Botanica Organics",
        completion_year: 2023,
        status: "published",
        featured: 1,
        display_order: 5,
      },
      {
        title: "Veloce Motors — Modern Automotive Identity & Monogram",
        slug: "veloce-motors-identity",
        description: "Aerodynamic monogram logo, showroom signage, business cards, and digital brand presence designed for a boutique performance automotive brand.",
        service_id: brandingId,
        client_name: "Veloce Motors",
        completion_year: 2023,
        status: "published",
        featured: 1,
        display_order: 6,
      },
    ];

    for (const p of sampleProjects) {
      await execute(
        "INSERT INTO projects (title, slug, short_description, service_id, client, status, featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [p.title, p.slug, p.description, p.service_id, p.client_name, p.status, p.featured, p.display_order]
      );
    }
  }

  // 5. Industries
  const existingIndustries = await query("SELECT id FROM industries LIMIT 1");
  if (existingIndustries.length === 0) {
    console.log("Seeding industries...");
    const industries = [
      { name: "E-Commerce & Retail", icon: "🛍️", order: 1 },
      { name: "Tech & SaaS Startups", icon: "💻", order: 2 },
      { name: "Fashion & Apparel", icon: "✨", order: 3 },
      { name: "Food & Beverage", icon: "🍷", order: 4 },
      { name: "Beauty & Cosmetics", icon: "💄", order: 5 },
      { name: "Health & Fitness", icon: "⚡", order: 6 },
      { name: "Real Estate & Architecture", icon: "🏢", order: 7 },
      { name: "Media & Entertainment", icon: "🎬", order: 8 },
    ];
    for (const ind of industries) {
      await execute(
        "INSERT INTO industries (name, icon, display_order, visible) VALUES (?, ?, ?, 1)",
        [ind.name, ind.icon, ind.order]
      );
    }
  }

  // 6. Settings
  const defaultSettings: Record<string, string> = {
    site_name: "Md Sakhawat Hossain",
    site_tagline: "Creative Graphic Designer",
    hero_headline: "Transforming Brands With High-Impact Visuals",
    hero_subline: "3+ Years Experience • 590+ Projects Delivered • Helping ambitious brands grow through world-class branding, packaging, social media, and AI video editing.",
    hero_cta_primary_label: "Explore Portfolio",
    hero_cta_primary_href: "/portfolio",
    hero_cta_secondary_label: "Chat on WhatsApp",
    hero_cta_secondary_href: "https://wa.me/8801781955355",
    about_bio: "I'm Md Sakhawat Hossain, a dedicated Creative Graphic Designer with over 3 years in the design industry. Having successfully delivered 590+ projects to 37+ global clients, I specialize in crafting distinctive brand identities, shelf-ready packaging, high-converting social media creatives, and cinematic AI-powered video editing.\n\nMy philosophy is simple: design should not only look visually stunning, it must solve real business problems and leave an unforgettable impression.",
    contact_whatsapp: "+8801781955355",
    contact_whatsapp_url: "https://wa.me/8801781955355",
    contact_email: "designersakhawat86@gmail.com",
    contact_location: "Dhaka, Bangladesh (Available Worldwide)",
    social_facebook: "https://www.facebook.com/designersakhawat",
    social_instagram: "https://instagram.com/designersakhawat",
    social_linkedin: "https://linkedin.com/in/designersakhawat",
    social_behance: "https://behance.net/designersakhawat",
    social_youtube: "",
    seo_title_template: "%s | Md Sakhawat Hossain — Creative Graphic Designer",
    seo_default_description: "Md Sakhawat Hossain is a professional creative graphic designer specializing in logo & branding, packaging design, social media ads, and AI video editing.",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await execute(
      "INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = COALESCE(value, VALUES(value))",
      [key, value]
    );
  }

  console.log("✅ Seed complete: All tables populated successfully.");
}

