const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "SakhawatDev2024!",
  database: process.env.DB_NAME || "portfolio_db",
};

async function seed() {
  const pool = mysql.createPool(dbConfig);
  try {
    const extraProjects = [
      {
        title: "Nexus Studio — Kinetic Brand Motion & Commercial Reel",
        slug: "nexus-studio-motion",
        service_id: 4,
        video_url: "https://www.youtube.com/watch?v=EngW7tLk6R8",
        short_description: "High-energy commercial reel featuring kinetic typography and 3D visual effects.",
        featured: 1,
        display_order: 7,
      },
      {
        title: "Cyber Shield — Cyber Security Visual Identity",
        slug: "cyber-shield-identity",
        service_id: 1,
        video_url: null,
        short_description: "Next-generation visual identity for an enterprise cybersecurity firm.",
        featured: 1,
        display_order: 8,
      },
      {
        title: "Velocity Gym — High-Energy Social Creative Kit",
        slug: "velocity-gym-social",
        service_id: 2,
        video_url: null,
        short_description: "Aggressive, high-contrast social media ads driving memberships and sales.",
        featured: 1,
        display_order: 9,
      },
      {
        title: "Pulse AI — Futuristic Commercial Concept",
        slug: "pulse-ai-commercial",
        service_id: 4,
        video_url: "https://www.youtube.com/watch?v=EngW7tLk6R8",
        short_description: "Cutting-edge AI-assisted video editing and promotional spot for tech brands.",
        featured: 1,
        display_order: 10,
      },
    ];

    for (const p of extraProjects) {
      const [existing] = await pool.query("SELECT id FROM projects WHERE slug = ?", [p.slug]);
      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO projects (title, slug, service_id, video_url, short_description, featured, status, display_order, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 'published', ?, NOW(), NOW())`,
          [p.title, p.slug, p.service_id, p.video_url, p.short_description, p.featured, p.display_order]
        );
        console.log("Inserted project:", p.title);
      }
    }
    const [count] = await pool.query("SELECT COUNT(*) as c FROM projects");
    console.log("Total projects in DB now:", count[0].c);
  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await pool.end();
  }
}

seed();
