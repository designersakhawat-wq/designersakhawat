const mysql = require("mysql2/promise");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "SakhawatDev2024!",
  database: process.env.DB_NAME || "portfolio_db",
};

async function main() {
  console.log("=== COMPREHENSIVE BACKEND & FRONTEND AUDIT ===");
  const pool = mysql.createPool(dbConfig);
  const issues = [];
  const fixes = [];

  try {
    // 1. Check DB connectivity
    const [rows] = await pool.query("SELECT 1 as test");
    console.log("✓ DB Connection OK:", rows);

    // 2. Check all expected tables
    const expectedTables = [
      "users",
      "services",
      "service_packages",
      "projects",
      "testimonials",
      "inquiries",
      "settings",
      "media",
      "industries",
      "clients"
    ];

    const [tablesRes] = await pool.query("SHOW TABLES");
    const existingTables = tablesRes.map((r) => Object.values(r)[0]);
    console.log("Existing Tables in portfolio_db:", existingTables);

    for (const t of expectedTables) {
      if (!existingTables.includes(t)) {
        issues.push(`Missing DB table: ${t}`);
      } else {
        const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM ${t}`);
        console.log(`✓ Table ${t}: ${count} rows`);
      }
    }

    // 3. Audit 'projects' table columns
    const [projCols] = await pool.query("DESCRIBE projects");
    const projColNames = projCols.map((c) => c.Field);
    console.log("Projects table columns:", projColNames);
    if (!projColNames.includes("video_url")) {
      issues.push("projects table missing video_url column");
    } else {
      console.log("✓ projects.video_url exists");
    }

    // Check projects data
    const [projects] = await pool.query("SELECT id, title, slug, service_id, cover_media_id, video_url, status, featured FROM projects");
    console.log(`Total projects in DB: ${projects.length}`);
    const videoProjects = projects.filter((p) => p.video_url);
    console.log(`Projects with video_url: ${videoProjects.length}`);

    // 4. Audit 'services' & 'service_packages'
    const [services] = await pool.query("SELECT id, name, slug, visible, pricing_mode FROM services");
    console.log(`Total services in DB: ${services.length}`);
    for (const s of services) {
      const [pkgs] = await pool.query("SELECT * FROM service_packages WHERE service_id = ?", [s.id]);
      console.log(`  Service '${s.name}' (id: ${s.id}, slug: ${s.slug}, pricing_mode: ${s.pricing_mode}) has ${pkgs.length} packages.`);
    }

    // 5. Audit 'testimonials'
    const [testimonials] = await pool.query("SELECT id, author_name, author_role, company, rating, visible FROM testimonials");
    console.log(`Total testimonials in DB: ${testimonials.length}`);

    // 6. Audit 'settings'
    const [settings] = await pool.query("SELECT `key`, `value` FROM settings");
    const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
    console.log("Settings keys in DB:", Object.keys(settingsMap));
    const crucialSettings = ["site_title", "contact_email", "contact_phone", "whatsapp_number"];
    for (const cs of crucialSettings) {
      if (!settingsMap[cs]) {
        issues.push(`Missing recommended setting key: ${cs}`);
      } else {
        console.log(`✓ Setting ${cs} = ${settingsMap[cs]}`);
      }
    }

    // 7. Audit 'inquiries'
    const [inquiries] = await pool.query("SELECT COUNT(*) as count FROM inquiries");
    console.log(`Total inquiries in DB: ${inquiries[0].count}`);

    // 8. Audit 'client_logos'
    const [clients] = await pool.query("SELECT COUNT(*) as count FROM client_logos");
    console.log(`Total client logos in DB: ${clients[0].count}`);

    // 9. Audit 'industries'
    const [industries] = await pool.query("SELECT COUNT(*) as count FROM industries");
    console.log(`Total industries in DB: ${industries[0].count}`);

    // Summary of DB audit
    console.log("\n--- AUDIT SUMMARY ---");
    console.log("Issues found:", issues.length);
    issues.forEach((iss, i) => console.log(` [Issue ${i+1}] ${iss}`));

  } catch (err) {
    console.error("Audit DB Error:", err);
    issues.push(err.message);
  } finally {
    await pool.end();
  }
}

main();
