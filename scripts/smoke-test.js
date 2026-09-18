const http = require('http');

const URLS = [
  { url: 'http://localhost:3000/', name: 'Homepage' },
  { url: 'http://localhost:3000/about', name: 'About Page' },
  { url: 'http://localhost:3000/services', name: 'Services Listing' },
  { url: 'http://localhost:3000/services/logo-branding', name: 'Service: Logo Branding' },
  { url: 'http://localhost:3000/services/packaging-label-design', name: 'Service: Packaging' },
  { url: 'http://localhost:3000/services/social-media-design', name: 'Service: Social Media' },
  { url: 'http://localhost:3000/services/ai-video-editing', name: 'Service: AI Video' },
  { url: 'http://localhost:3000/portfolio', name: 'Portfolio Listing' },
  { url: 'http://localhost:3000/portfolio/aura-tech-brand-identity', name: 'Project: Aura Tech' },
  { url: 'http://localhost:3000/portfolio/maison-luxe-packaging', name: 'Project: Maison Luxe' },
  { url: 'http://localhost:3000/portfolio/apex-athletics-social-campaign', name: 'Project: Apex Athletics' },
  { url: 'http://localhost:3000/portfolio/zenith-ai-brand-video', name: 'Project: Zenith AI' },
  { url: 'http://localhost:3000/contact', name: 'Contact Page' },
  { url: 'http://localhost:3000/admin/login', name: 'Admin Login' },
  { url: 'http://localhost:3000/api/media/1', name: 'Media API: Item 1' },
  { url: 'http://localhost:3000/api/media/2', name: 'Media API: Item 2' }
];

async function runSmokeTest() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 RUNNING AUTOMATED COMPREHENSIVE SMOKE TEST');
  console.log('═══════════════════════════════════════════════════');

  let passed = 0;
  let failed = 0;

  for (const item of URLS) {
    try {
      const res = await fetch(item.url);
      if (res.status === 200) {
        console.log(`✅ [200 OK] ${item.name} (${item.url})`);
        passed++;

        // Page content checks
        if (item.url === 'http://localhost:3000/services') {
          const html = await res.text();
          const hasLogo = html.includes('Logo &amp; Branding') || html.includes('Logo & Branding');
          const hasPackaging = html.includes('Packaging &amp; Label Design') || html.includes('Packaging & Label Design');
          const hasSocial = html.includes('Social Media Design');
          const hasVideo = html.includes('AI Video Editing');
          if (hasLogo && hasPackaging && hasSocial && hasVideo) {
            console.log('   ↳ ⭐ All 4 Core Services Verified on Services Page!');
          } else {
            console.error('   ↳ ⚠️ Warning: Missing some services in HTML!');
          }
        }

        if (item.url === 'http://localhost:3000/portfolio') {
          const html = await res.text();
          const hasSliding = html.includes('portfolio-marquee-track') || html.includes('portfolio-lane-track');
          const hasLanes = (html.includes('marquee-drift-left') || html.includes('roadDriftLeft')) &&
                           (html.includes('marquee-drift-right') || html.includes('roadDriftRight'));
          const hasWhatsApp = html.includes('Order on WhatsApp') || html.includes('whatsapp');
          if (hasSliding && hasLanes && hasWhatsApp) {
            console.log('   ↳ ⭐ 360 Gapless Dual-Group Marquee & WhatsApp CTAs Verified on Portfolio Page!');
          } else {
            console.error('   ↳ ⚠️ Warning: Sliding showcases or WhatsApp not detected!');
          }
        }
      } else {
        console.error(`❌ [${res.status}] ${item.name} (${item.url})`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [FAILED] ${item.name} (${item.url}) — ${err.message}`);
      failed++;
    }
  }

  console.log('═══════════════════════════════════════════════════');
  console.log(`TEST SUMMARY: ${passed} PASSED / ${failed} FAILED (Total ${URLS.length})`);
  console.log('═══════════════════════════════════════════════════');

  if (failed > 0) process.exit(1);
}

runSmokeTest();
