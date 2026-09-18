const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function seed() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'SakhawatDev2024!',
    database: 'portfolio_db'
  });

  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const files = [
    { num: 1, name: 'project-1.webp', alt: 'Aura Tech Brand Identity' },
    { num: 2, name: 'project-2.webp', alt: 'Maison Luxe Perfume Packaging' },
    { num: 3, name: 'project-3.webp', alt: 'Apex Athletics Social Campaign' },
    { num: 4, name: 'project-4.webp', alt: 'Zenith AI Video Editing' },
    { num: 5, name: 'project-5.webp', alt: 'Botanica Organics Tea Packaging' },
    { num: 6, name: 'project-6.webp', alt: 'Veloce Motors Monogram' },
    { num: 7, name: 'project-7.webp', alt: 'Geometric Brandmark' },
    { num: 8, name: 'project-8.webp', alt: 'Corporate Identity System' }
  ];

  for (const f of files) {
    const src = path.join(process.cwd(), 'public/images/projects', f.name);
    const dest = path.join(uploadDir, f.name);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
    }
    const [existing] = await conn.execute('SELECT id FROM media WHERE id = ?', [f.num]);
    if (existing.length === 0) {
      await conn.execute(
        'INSERT INTO media (id, filename, original_name, mime_type, size, width, height, alt_text, storage_path, thumb_path, medium_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [f.num, f.name, f.name, 'image/webp', 150000, 1000, 1000, f.alt, dest, dest, dest]
      );
      console.log('Inserted media id:', f.num);
    }
  }

  // Update services cover_media_id
  await conn.execute("UPDATE services SET cover_media_id = 1 WHERE slug = 'logo-branding'");
  await conn.execute("UPDATE services SET cover_media_id = 2 WHERE slug = 'packaging-label-design'");
  await conn.execute("UPDATE services SET cover_media_id = 3 WHERE slug = 'social-media-design'");
  await conn.execute("UPDATE services SET cover_media_id = 4 WHERE slug = 'ai-video-editing'");
  console.log('Updated services cover_media_id');

  // Update projects cover_media_id
  await conn.execute("UPDATE projects SET cover_media_id = 1 WHERE id = 1");
  await conn.execute("UPDATE projects SET cover_media_id = 2 WHERE id = 2");
  await conn.execute("UPDATE projects SET cover_media_id = 3 WHERE id = 3");
  await conn.execute("UPDATE projects SET cover_media_id = 4 WHERE id = 4");
  await conn.execute("UPDATE projects SET cover_media_id = 5 WHERE id = 5");
  await conn.execute("UPDATE projects SET cover_media_id = 6 WHERE id = 6");
  console.log('Updated projects cover_media_id');

  await conn.end();
  console.log('Seeding completed successfully!');
}

seed().catch(console.error);
