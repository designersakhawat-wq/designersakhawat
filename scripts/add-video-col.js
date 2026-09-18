const mysql = require('mysql2/promise');

async function updateDb() {
  const c = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'SakhawatDev2024!',
    database: 'portfolio_db'
  });

  const [cols] = await c.query('DESCRIBE projects');
  const hasVideoUrl = cols.some(x => x.Field === 'video_url');
  if (!hasVideoUrl) {
    await c.query('ALTER TABLE projects ADD COLUMN video_url VARCHAR(500) NULL AFTER cover_media_id');
    console.log('✅ Added video_url column to projects table!');
  } else {
    console.log('ℹ️ video_url column already exists!');
  }

  // Update AI Video projects with demo YouTube commercial video URL
  await c.query(
    "UPDATE projects SET video_url = 'https://www.youtube.com/watch?v=EngW7tLk6R8' WHERE service_id = 4 OR slug LIKE '%video%'"
  );
  console.log('✅ Updated video_url for video projects in database!');

  await c.end();
}

updateDb().catch(console.error);
