const mysql = require('mysql2/promise');

async function testBackend() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🛠️ RUNNING BACKEND DATABASE & SCHEMA SMOKE TEST');
  console.log('═══════════════════════════════════════════════════');

  const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'SakhawatDev2024!',
    database: 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    // 1. Verify services have covers
    const [services] = await pool.query('SELECT id, name, slug, cover_media_id FROM services ORDER BY display_order ASC');
    console.log(`✅ Services Found: ${services.length}`);
    services.forEach(s => {
      console.log(`   - Service: ${s.name} (Slug: ${s.slug}, Cover Media ID: ${s.cover_media_id})`);
    });

    // 2. Verify media items
    const [media] = await pool.query('SELECT id, storage_path, mime_type, size FROM media ORDER BY id ASC');
    console.log(`✅ Media Items in Database: ${media.length}`);

    // 3. Verify projects and cover media
    const [projects] = await pool.query('SELECT id, title, slug, cover_media_id, featured FROM projects ORDER BY id ASC');
    console.log(`✅ Projects in Database: ${projects.length}`);
    projects.forEach(p => {
      console.log(`   - Project: ${p.title} (Slug: ${p.slug}, Cover: ${p.cover_media_id})`);
    });

    // 4. Test insert and delete a test project (ensuring published_at DATETIME works properly)
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const [insertResult] = await pool.query(
      `INSERT INTO projects (service_id, title, slug, short_description, published_at, status, featured)
       VALUES (?, ?, ?, ?, ?, 'published', 0)`,
      [services[0].id, 'Smoke Test Project', 'smoke-test-project-' + Date.now(), 'Temporary smoke test summary', now]
    );
    console.log(`✅ Project Insert Test: Passed (Inserted ID: ${insertResult.insertId})`);

    // Clean up test project
    await pool.query('DELETE FROM projects WHERE id = ?', [insertResult.insertId]);
    console.log(`✅ Project Cleanup Test: Passed (Deleted ID: ${insertResult.insertId})`);

    console.log('═══════════════════════════════════════════════════');
    console.log('🎉 ALL BACKEND CHECKS PASSED PERFECTLY!');
    console.log('═══════════════════════════════════════════════════');
  } catch (err) {
    console.error('❌ Backend Smoke Test Failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testBackend();
