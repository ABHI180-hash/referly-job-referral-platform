const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const mockSeeker = {
  id: 'usr_seeker_01',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  role: 'seeker',
  title: 'Senior Frontend Engineer',
  company: 'Targeting Tier-1 Tech',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  bio: 'Building design systems and high-performance React web applications.',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Design Systems'],
  resumeUrl: '/resumes/Priya_Sharma_Resume.pdf',
  resumeName: 'Priya_Sharma_Frontend_Staff_2026.pdf'
};

const mockReferrer = {
  id: 'usr_referrer_01',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@figma.com',
  role: 'referrer',
  title: 'Senior Staff Product Designer',
  company: 'Figma',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  bio: 'Passionate about bridging designers and developers. Happy to review portfolios and refer talented product designers and engineers.',
  skills: ['Design Systems', 'Figma', 'UI/UX', 'Product Architecture']
};

const mockAdmin = {
  id: 'usr_admin_01',
  name: 'Vikramaditya',
  email: 'admin@referly.careers',
  role: 'admin',
  title: 'Platform Administrator & Trust Lead',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
};

const screens = [
  {
    name: 'homepage.png',
    path: '/',
    role: 'guest',
    user: null,
    waitMs: 1200
  },
  {
    name: 'login.png',
    path: '/login',
    role: 'guest',
    user: null,
    waitMs: 800
  },
  {
    name: 'register.png',
    path: '/register',
    role: 'guest',
    user: null,
    waitMs: 800
  },
  {
    name: 'jobs.png',
    path: '/jobs',
    role: 'guest',
    user: null,
    waitMs: 1200
  },
  {
    name: 'job-details.png',
    path: '/jobs/job_001',
    role: 'guest',
    user: null,
    waitMs: 1000
  },
  {
    name: 'referrals.png',
    path: '/referrals',
    role: 'guest',
    user: null,
    waitMs: 1200
  },
  {
    name: 'companies.png',
    path: '/companies',
    role: 'guest',
    user: null,
    waitMs: 1200
  },
  {
    name: 'pricing.png',
    path: '/pricing',
    role: 'guest',
    user: null,
    waitMs: 1000
  },
  {
    name: 'seeker-dashboard.png',
    path: '/dashboard',
    role: 'seeker',
    user: mockSeeker,
    waitMs: 1500
  },
  {
    name: 'messaging.png',
    path: '/dashboard/messages',
    role: 'seeker',
    user: mockSeeker,
    waitMs: 1500
  },
  {
    name: 'referrer-dashboard.png',
    path: '/referrer-dashboard',
    role: 'referrer',
    user: mockReferrer,
    waitMs: 1500
  },
  {
    name: 'referrer-profile.png',
    path: '/referrer-dashboard/profile',
    role: 'referrer',
    user: mockReferrer,
    waitMs: 1200
  },
  {
    name: 'admin-dashboard.png',
    path: '/admin',
    role: 'admin',
    user: mockAdmin,
    waitMs: 1500
  }
];

async function captureAll() {
  console.log('Launching Chrome via Puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1440,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  for (const s of screens) {
    console.log(`Capturing: ${s.name} at ${s.path} (Role: ${s.role})...`);
    
    // Set localStorage before loading page
    await page.goto(BASE_URL + '/404', { waitUntil: 'domcontentloaded' }).catch(() => {});
    await page.evaluate((role, user) => {
      localStorage.setItem('referly_role', role);
      if (user) {
        localStorage.setItem('referly_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('referly_user');
      }
    }, s.role, s.user);

    await page.goto(BASE_URL + s.path, { waitUntil: 'networkidle0', timeout: 15000 }).catch(err => {
      console.warn(`Warning loading ${s.path}:`, err.message);
    });

    if (s.waitMs) {
      await new Promise(r => setTimeout(r, s.waitMs));
    }

    const outPath = path.join(OUTPUT_DIR, s.name);
    await page.screenshot({ path: outPath, type: 'png' });
    const stat = fs.statSync(outPath);
    console.log(`Saved: ${s.name} (${Math.round(stat.size / 1024)} KB)`);
  }

  // Generate referly-banner.png
  console.log('Generating Referly Project Banner...');
  const bannerHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: 1200px;
        height: 480px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #09090b 70%, #030712 100%);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
        color: #ffffff;
        position: relative;
        overflow: hidden;
      }
      .grid-pattern {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        background-size: 40px 40px;
        mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        background: rgba(99, 102, 241, 0.15);
        border: 1px solid rgba(99, 102, 241, 0.35);
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 1px;
        color: #a5b4fc;
        text-transform: uppercase;
        margin-bottom: 24px;
        z-index: 10;
      }
      .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #6366f1;
        box-shadow: 0 0 10px #6366f1;
      }
      .title {
        font-size: 68px;
        font-weight: 800;
        letter-spacing: -2px;
        margin-bottom: 12px;
        z-index: 10;
        background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .tagline {
        font-size: 26px;
        font-weight: 700;
        letter-spacing: 2px;
        color: #818cf8;
        margin-bottom: 16px;
        text-transform: uppercase;
        z-index: 10;
      }
      .subtitle {
        font-size: 18px;
        font-weight: 400;
        color: #94a3b8;
        letter-spacing: 0.5px;
        z-index: 10;
        margin-bottom: 32px;
      }
      .pills {
        display: flex;
        gap: 12px;
        z-index: 10;
      }
      .pill {
        padding: 6px 14px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        font-size: 13px;
        color: #cbd5e1;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div class="grid-pattern"></div>
    <div class="badge"><span class="badge-dot"></span> Next-Gen Talent & Referral Infrastructure</div>
    <h1 class="title">REFERLY</h1>
    <div class="tagline">GET REFERRED. GET HIRED.</div>
    <div class="subtitle">A Modern Job Referral & Career Networking Platform</div>
    <div class="pills">
      <div class="pill">⚡ React 19 + TypeScript</div>
      <div class="pill">🛡️ Node.js + Express + JWT</div>
      <div class="pill">🍃 MongoDB Dual-Engine</div>
      <div class="pill">💬 Real-Time Chat & Documents</div>
    </div>
  </body>
  </html>
  `;

  await page.setViewport({ width: 1200, height: 480, deviceScaleFactor: 2 });
  await page.setContent(bannerHtml, { waitUntil: 'load' });
  const bannerPath = path.join(OUTPUT_DIR, 'referly-banner.png');
  await page.screenshot({ path: bannerPath, type: 'png' });
  console.log(`Saved: referly-banner.png (${Math.round(fs.statSync(bannerPath).size / 1024)} KB)`);

  await browser.close();
  console.log('All screenshots captured successfully!');
}

captureAll().catch(err => {
  console.error('Error in captureAll:', err);
  process.exit(1);
});
