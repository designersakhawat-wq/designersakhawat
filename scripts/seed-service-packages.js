const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "SakhawatDev2024!",
  database: process.env.DB_NAME || "portfolio_db",
};

const packagesData = [
  // Service 1: Logo & Branding
  {
    service_id: 1,
    name: "Starter Brand Kit",
    price: 150,
    currency: "USD",
    is_starting_from: 1,
    description: "Ideal for early-stage startups and creators launching a fresh new venture.",
    features: [
      "2 Distinct Logo Concepts",
      "Curated Typography & Color System",
      "High-Res PNG, JPG & Vector SVG",
      "Dark & Light Mode Variants",
      "3 Revisions & Full Commercial Rights"
    ],
    display_order: 1,
  },
  {
    service_id: 1,
    name: "Complete Brand Identity",
    price: 350,
    currency: "USD",
    is_starting_from: 1,
    description: "Full brand identity designed to position your company as an industry leader.",
    features: [
      "4 Unique Logo Explorations",
      "Comprehensive Brand Guidelines PDF",
      "Stationery Design (Business Card, Letterhead)",
      "Social Media Kit (Avatar, Cover, Templates)",
      "Full Vector Source Files (.AI, .EPS, .PDF)",
      "Unlimited Revisions until 100% Satisfied"
    ],
    display_order: 2,
  },
  {
    service_id: 1,
    name: "Enterprise Transformation",
    price: 750,
    currency: "USD",
    is_starting_from: 1,
    description: "Complete visual ecosystem for scaling companies and international brands.",
    features: [
      "In-Depth Visual Strategy & Positioning",
      "Full Multi-Asset Design Suite & Merch Kit",
      "Photorealistic 3D Brand Mockups",
      "Complete Print & Digital Asset Library",
      "Direct 1-on-1 WhatsApp Priority Support"
    ],
    display_order: 3,
  },

  // Service 2: Social Media Design
  {
    service_id: 2,
    name: "Social Starter Pack",
    price: 120,
    currency: "USD",
    is_starting_from: 1,
    description: "A quick boost of eye-catching social graphics to upgrade your feed.",
    features: [
      "6 Custom Instagram / LinkedIn Posts",
      "Matching Story Layouts Included",
      "High-Engagement Typography & Visuals",
      "Royalty-Free Premium Stock Assets",
      "Figma / Photoshop Editable Files"
    ],
    display_order: 1,
  },
  {
    service_id: 2,
    name: "Growth Monthly Kit",
    price: 280,
    currency: "USD",
    is_starting_from: 1,
    description: "Continuous high-converting content kit built to accelerate followers & sales.",
    features: [
      "15 Custom Carousels & Static Posts",
      "15 Matching Stories & Highlight Covers",
      "High-Converting Ad Creatives (Meta & Google)",
      "Structured Content Rhythm & Layouts",
      "Source Files (.PSD / .FIGMA) & Unlimited Tweaks"
    ],
    display_order: 2,
  },
  {
    service_id: 2,
    name: "Brand Dominance Bundle",
    price: 550,
    currency: "USD",
    is_starting_from: 1,
    description: "Full monthly creative firepower for aggressive growth brands.",
    features: [
      "30 Custom Posts, Carousels & Video Thumbnails",
      "Full Performance Paid Ad Creative Suite",
      "Custom Micro-Animations & Motion Covers",
      "Consistent Cohesive Visual Direction",
      "Priority Same-Day Turnaround Support"
    ],
    display_order: 3,
  },

  // Service 3: Packaging & Label Design
  {
    service_id: 3,
    name: "Single SKU Label",
    price: 180,
    currency: "USD",
    is_starting_from: 1,
    description: "Sleek, market-ready label or pouch design tailored for shelf-appeal.",
    features: [
      "1 Custom Label / Bottle / Pouch Design",
      "Print-Ready Vector Dieline with Bleed",
      "Photorealistic 3D Product Mockup",
      "CMYK Color Profile for Flawless Printing",
      "Commercial Use & Source Files Included"
    ],
    display_order: 1,
  },
  {
    service_id: 3,
    name: "Product Line Collection",
    price: 380,
    currency: "USD",
    is_starting_from: 1,
    description: "Cohesive packaging system for a 3-flavor or multi-item product range.",
    features: [
      "3 Cohesive Product Packaging Designs",
      "Foil Stamping, Emboss & Spot UV Specs",
      "High-Resolution 4K 3D Renderings for E-Commerce",
      "Custom Dieline Architecture & Measurements",
      "Direct Printer Communication Support"
    ],
    display_order: 2,
  },
  {
    service_id: 3,
    name: "Luxury Packaging Architecture",
    price: 750,
    currency: "USD",
    is_starting_from: 1,
    description: "End-to-end luxury packaging engineering for premium cosmetic & food brands.",
    features: [
      "Complete Outer Box, Bottle & Unboxing Experience",
      "Multiple Angles & 360° 3D Cinema Mockups",
      "Regulatory & Barcode Placement Compliance",
      "Full Vector Print Files with Die-Cut Lines",
      "Dedicated Revisions until Production Run"
    ],
    display_order: 3,
  },

  // Service 4: AI Video Editing
  {
    service_id: 4,
    name: "Short-Form Reel / TikTok",
    price: 99,
    currency: "USD",
    is_starting_from: 1,
    description: "High-retention viral vertical video designed for TikTok, Reels, & Shorts.",
    features: [
      "1 Dynamic 30-60s Short-Form Video",
      "Kinetic Subtitles & Sound Effects (SFX)",
      "Pacing Optimization for Maximum Retention",
      "Color Grading & Dynamic B-Roll Inserts",
      "Quick 24-48 Hour Turnaround"
    ],
    display_order: 1,
  },
  {
    service_id: 4,
    name: "YouTube & Brand Video",
    price: 250,
    currency: "USD",
    is_starting_from: 1,
    description: "Cinematic promotional or YouTube video with studio-grade polish.",
    features: [
      "Up to 3-5 Min Full Video Editing",
      "Dynamic Motion Graphics & Lower Thirds",
      "AI Voice Enhancement & Audio Mastering",
      "Licensed Royalty-Free Soundtrack",
      "4K Master Export with YouTube Thumbnail"
    ],
    display_order: 2,
  },
  {
    service_id: 4,
    name: "Full Ad Campaign Suite",
    price: 600,
    currency: "USD",
    is_starting_from: 1,
    description: "High-converting multi-format video ads engineered for Meta, TikTok & YouTube.",
    features: [
      "3 Aspect Ratios (16:9 Landscape, 9:16 Vertical, 1:1 Square)",
      "Custom 3D Motion Intro / Outro Hook",
      "Multiple Hook Variations for A/B Ad Testing",
      "Comprehensive Audio & Color Grading",
      "Priority VIP Turnaround & Revisions"
    ],
    display_order: 3,
  }
];

async function seed() {
  const pool = mysql.createPool(dbConfig);
  try {
    console.log("Seeding service packages and updating services pricing_mode...");

    // Update all services to pricing_mode = 'both'
    await pool.query("UPDATE services SET pricing_mode = 'both' WHERE deleted_at IS NULL");
    console.log("✓ Updated all services pricing_mode to 'both'");

    // Clear existing packages if any
    await pool.query("DELETE FROM service_packages");

    for (const pkg of packagesData) {
      await pool.query(
        `INSERT INTO service_packages 
        (service_id, name, price, currency, is_starting_from, description, features_json, display_order, visible, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
        [
          pkg.service_id,
          pkg.name,
          pkg.price,
          pkg.currency,
          pkg.is_starting_from,
          pkg.description,
          JSON.stringify(pkg.features),
          pkg.display_order
        ]
      );
    }

    const [rows] = await pool.query("SELECT COUNT(*) as count FROM service_packages");
    console.log(`✓ Successfully seeded ${rows[0].count} service packages across all services!`);
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await pool.end();
  }
}

seed();
