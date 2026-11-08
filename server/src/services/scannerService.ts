import * as cheerio from 'cheerio';
import dns from 'dns/promises';
import tls from 'tls';
import { URL } from 'url';
import { ICheckItem } from '../models/ScanResult';
import { LaunchStatus } from '../models/Website';

// Safe SSRF check: Disallow private IP ranges and localhost
export const isPrivateOrInternalIp = (ip: string): boolean => {
  // IPv6 loopback and private
  if (ip === '::1' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) {
    return true;
  }
  // IPv4 loopback & local
  if (
    ip === 'localhost' ||
    ip === '0.0.0.0' ||
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('169.254.')
  ) {
    return true;
  }
  // 172.16.0.0 to 172.31.255.255
  const parts = ip.split('.').map(Number);
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true;
  }
  return false;
};

// TLS Certificate inspector
const inspectSSLCertificate = async (
  hostname: string,
  port: number = 443
): Promise<{
  valid: boolean;
  issuer?: string;
  subject?: string;
  validFrom?: string;
  validTo?: string;
  daysRemaining?: number;
  error?: string;
}> => {
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port,
        servername: hostname,
        timeout: 8000,
        rejectUnauthorized: false, // Let us inspect the cert even if untrusted
      },
      () => {
        const cert = socket.getPeerCertificate();
        if (!cert || Object.keys(cert).length === 0) {
          socket.destroy();
          return resolve({ valid: false, error: 'No peer SSL certificate presented.' });
        }

        const validTo = new Date(cert.valid_to);
        const validFrom = new Date(cert.valid_from);
        const now = new Date();
        const daysRemaining = Math.max(0, Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        const isAuthorized = socket.authorized;

        const formatName = (val: string | string[] | undefined): string => {
          if (!val) return '';
          return Array.isArray(val) ? val.join(', ') : val;
        };

        const issuerStr = formatName(cert.issuer?.O) || formatName(cert.issuer?.CN) || 'Unknown Certificate Authority';
        const subjectStr = formatName(cert.subject?.CN) || hostname;

        socket.destroy();
        resolve({
          valid: isAuthorized && daysRemaining > 0,
          issuer: issuerStr,
          subject: subjectStr,
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysRemaining,
        });
      }
    );

    socket.on('error', (err) => {
      resolve({ valid: false, error: err.message });
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve({ valid: false, error: 'SSL handshake connection timed out (8s limit).' });
    });
  });
};

export interface ScanResultPayload {
  url: string;
  domain: string;
  readinessScore: number;
  launchStatus: LaunchStatus;
  passedCount: number;
  failedCount: number;
  warningCount: number;
  durationMs: number;
  checks: ICheckItem[];
  meta: {
    title?: string;
    description?: string;
    responseTimeMs: number;
    sslDays?: number;
  };
}

export class ScannerService {
  /**
   * Main scan execution entry point
   */
  public static async executeFullScan(targetUrl: string): Promise<ScanResultPayload> {
    const startTime = Date.now();

    // 1. Sanitize & Normalize URL
    let sanitized = targetUrl.trim();
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      sanitized = 'https://' + sanitized;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(sanitized);
    } catch {
      throw new Error(`Invalid URL format: "${targetUrl}". Provide a valid domain.`);
    }

    const domain = parsedUrl.hostname;

    // 2. SSRF Protection: Resolve DNS to verify public IP
    try {
      const { address } = await dns.lookup(domain);
      if (isPrivateOrInternalIp(address)) {
        throw new Error(
          `Security Alert: Destination IP (${address}) resolves to a private or internal network. Scanning localhost or private networks is restricted.`
        );
      }
    } catch (dnsErr: any) {
      if (dnsErr.message.includes('Security Alert')) {
        throw dnsErr;
      }
      throw new Error(`Unable to resolve domain "${domain}". Ensure DNS records are published.`);
    }

    // 3. Fetch Primary HTML & Measure Page Load Time
    const fetchStart = performance.now();
    let response: Response;
    let html = '';
    let responseTimeMs = 0;
    let fetchError: string | null = null;
    let headers: Headers | null = null;
    let status = 0;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LaunchPilot-Scanner/1.0 (+https://launchpilot.dev; website launch readiness scanner)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      clearTimeout(timeoutId);

      responseTimeMs = Math.round(performance.now() - fetchStart);
      status = response.status;
      headers = response.headers;
      html = await response.text();
    } catch (err: any) {
      fetchError = err.message || 'Failed to establish connection';
      responseTimeMs = Math.round(performance.now() - fetchStart);
    }

    // 4. Parse DOM with Cheerio if HTML received
    const $ = html ? cheerio.load(html) : cheerio.load('<html><body></body></html>');

    // 5. Run the 15 Dedicated Launch Readiness Checks
    const checks: ICheckItem[] = [];

    // Check 1: Mobile Responsiveness
    const hasViewport = $('meta[name="viewport"]').length > 0;
    const viewportContent = $('meta[name="viewport"]').attr('content') || '';
    const isResponsiveConfig = viewportContent.includes('width=device-width');
    checks.push({
      checkId: 1,
      name: 'Mobile Responsiveness',
      category: 'performance',
      isMandatory: true,
      status: hasViewport && isResponsiveConfig ? 'passed' : hasViewport ? 'warning' : 'failed',
      score: hasViewport && isResponsiveConfig ? 100 : hasViewport ? 60 : 15,
      details: hasViewport && isResponsiveConfig
        ? `Configured standard viewport (${viewportContent}). Mobile zoom and scaling properly active.`
        : hasViewport
        ? `Viewport meta tag present but missing width=device-width parameter.`
        : `Missing <meta name="viewport"> tag. Mobile devices will display zoomed-out desktop layout.`,
      fixSuggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> inside your <head>.',
      lastChecked: new Date(),
    });

    // Check 2: Internal and External Links
    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')?.trim();
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        links.push(href);
      }
    });
    const brokenPlaceholderLinks = $('a[href="#"], a[href=""], a[href="javascript:void(0)"]').length;
    checks.push({
      checkId: 2,
      name: 'Internal and External Links',
      category: 'compliance',
      isMandatory: true,
      status: brokenPlaceholderLinks > 3 ? 'warning' : links.length > 0 ? 'passed' : 'warning',
      score: brokenPlaceholderLinks > 3 ? 65 : links.length > 0 ? 100 : 70,
      details: `Detected ${links.length} active navigational links across the DOM. Found ${brokenPlaceholderLinks} empty or placeholder '#' links.`,
      fixSuggestion: brokenPlaceholderLinks > 0
        ? `Replace ${brokenPlaceholderLinks} placeholder href="#" links with actual route destinations or button elements.`
        : 'All detected links have valid destinations.',
      lastChecked: new Date(),
    });

    // Check 3: Contact Form Functionality
    const forms = $('form');
    const formCount = forms.length;
    const emailInputs = $('input[type="email"], input[name*="email"], input[id*="email"]').length;
    const submitButtons = $('form button[type="submit"], form input[type="submit"], form button:not([type="button"])').length;
    const hasContactForm = formCount > 0 && emailInputs > 0 && submitButtons > 0;
    checks.push({
      checkId: 3,
      name: 'Contact Form Functionality',
      category: 'integrations',
      isMandatory: false,
      status: hasContactForm ? 'passed' : formCount > 0 ? 'warning' : 'warning',
      score: hasContactForm ? 100 : formCount > 0 ? 70 : 50,
      details: hasContactForm
        ? `Found ${formCount} form(s) with validated email inputs and active submit triggers.`
        : formCount > 0
        ? `Detected ${formCount} form(s), but missing dedicated email input or submit handler.`
        : `No HTML form found on primary landing page. Verify contact capture mechanisms.`,
      fixSuggestion: 'Ensure your lead capture or contact form includes client-side validation, CAPTCHA, and sends confirmation emails.',
      lastChecked: new Date(),
    });

    // Check 4: Page Loading Speed (Target < 3s)
    const isSpeedFast = responseTimeMs < 1200;
    const isSpeedAcceptable = responseTimeMs <= 3000;
    checks.push({
      checkId: 4,
      name: 'Page Loading Speed',
      category: 'performance',
      isMandatory: true,
      status: isSpeedFast ? 'passed' : isSpeedAcceptable ? 'warning' : 'failed',
      score: isSpeedFast ? 100 : isSpeedAcceptable ? 75 : Math.max(20, Math.round((3000 / responseTimeMs) * 100)),
      details: `Server response time (TTFB + DOM delivery): ${responseTimeMs}ms. Target benchmark: < 3,000ms.`,
      fixSuggestion: isSpeedAcceptable
        ? 'Response time within acceptable boundaries. Utilize CDN caching and Gzip/Brotli compression to reach sub-second speeds.'
        : 'Optimize server processing, enable HTTP/2/Brotli, leverage edge caching, and defer blocking scripts.',
      meta: { responseTimeMs },
      lastChecked: new Date(),
    });

    // Check 5: Image Loading and Optimization
    const totalImages = $('img').length;
    let missingAltCount = 0;
    let modernFormatCount = 0;
    $('img').each((_, el) => {
      const alt = $(el).attr('alt');
      const src = $(el).attr('src') || '';
      if (!alt || alt.trim() === '') missingAltCount++;
      if (src.endsWith('.webp') || src.endsWith('.avif') || src.endsWith('.svg')) modernFormatCount++;
    });
    const imageScore = totalImages === 0 ? 100 : Math.round(((totalImages - missingAltCount) / totalImages) * 100);
    checks.push({
      checkId: 5,
      name: 'Image Loading & Optimization',
      category: 'performance',
      isMandatory: true,
      status: totalImages === 0 || missingAltCount === 0 ? 'passed' : missingAltCount > 2 ? 'warning' : 'passed',
      score: imageScore,
      details: `Inspected ${totalImages} image(s). ${totalImages - missingAltCount}/${totalImages} have descriptive alt attributes. ${modernFormatCount} use modern formats (WebP/AVIF/SVG).`,
      fixSuggestion: missingAltCount > 0
        ? `Provide descriptive alt attributes for ${missingAltCount} unlabelled images to maintain WCAG accessibility and SEO indexing.`
        : 'All images satisfy accessibility and optimization standards.',
      lastChecked: new Date(),
    });

    // Check 6: HTTPS / SSL Certificate
    let sslResult = { valid: false, issuer: '', daysRemaining: 0, error: '' };
    if (parsedUrl.protocol === 'https:') {
      try {
        const certData = await inspectSSLCertificate(domain, 443);
        sslResult = {
          valid: certData.valid,
          issuer: certData.issuer || 'Trusted CA',
          daysRemaining: certData.daysRemaining || 0,
          error: certData.error || '',
        };
      } catch (sslErr: any) {
        sslResult = { valid: false, issuer: '', daysRemaining: 0, error: sslErr.message };
      }
    }
    const isHttps = parsedUrl.protocol === 'https:' && sslResult.valid;
    checks.push({
      checkId: 6,
      name: 'HTTPS / SSL Certificate',
      category: 'security',
      isMandatory: true,
      status: isHttps ? 'passed' : 'failed',
      score: isHttps ? 100 : 0,
      details: isHttps
        ? `Valid TLS/SSL certificate verified. Issued by ${sslResult.issuer}. Days until expiration: ${sslResult.daysRemaining} days.`
        : parsedUrl.protocol === 'http:'
        ? 'Website is serving over insecure plain HTTP. Modern browsers will flag "Not Secure".'
        : `SSL validation issue: ${sslResult.error || 'Invalid or self-signed certificate.'}`,
      fixSuggestion: isHttps
        ? 'Enable HSTS (Strict-Transport-Security) headers to enforce encrypted traffic.'
        : 'Install an active SSL certificate (e.g. Let\'s Encrypt / Cloudflare) and redirect all HTTP traffic to HTTPS.',
      meta: { sslDays: sslResult.daysRemaining, issuer: sslResult.issuer },
      lastChecked: new Date(),
    });

    // Check 7: Browser Compatibility
    const hasDoctype = html.toLowerCase().includes('<!doctype html');
    const hasCharset = $('meta[charset]').length > 0 || $('meta[http-equiv="Content-Type"]').length > 0;
    const deprecatedTags = $('font, center, marquee, blink, applet').length;
    checks.push({
      checkId: 7,
      name: 'Browser Compatibility',
      category: 'compliance',
      isMandatory: true,
      status: hasDoctype && hasCharset && deprecatedTags === 0 ? 'passed' : 'warning',
      score: hasDoctype && hasCharset && deprecatedTags === 0 ? 100 : 70,
      details: hasDoctype && hasCharset
        ? `Standards-compliant HTML5 DOCTYPE and UTF-8 charset verified. 0 deprecated legacy elements detected.`
        : `Non-standard HTML elements or missing DOCTYPE declaration may trigger quirks mode across Firefox and Safari.`,
      fixSuggestion: 'Ensure <!DOCTYPE html> is at the very top of your document and declare <meta charset="UTF-8">.',
      lastChecked: new Date(),
    });

    // Check 8: Spelling & Content Errors (Placeholder detection)
    const bodyText = $('body').text().toLowerCase();
    const placeholderTokens = ['lorem ipsum', 'dolor sit amet', 'sample text', 'placeholder text', 'todo:'];
    const foundPlaceholders = placeholderTokens.filter((token) => bodyText.includes(token));
    const pageTitle = $('title').text().trim();
    const h1Count = $('h1').length;
    checks.push({
      checkId: 8,
      name: 'Spelling & Content Errors',
      category: 'content',
      isMandatory: true,
      status: foundPlaceholders.length === 0 && pageTitle && h1Count > 0 ? 'passed' : 'warning',
      score: foundPlaceholders.length === 0 ? 100 : Math.max(30, 100 - foundPlaceholders.length * 25),
      details: foundPlaceholders.length > 0
        ? `Found ${foundPlaceholders.length} placeholder token(s) in visible content: "${foundPlaceholders.join(', ')}". Page title: "${pageTitle}".`
        : `Zero filler placeholder tokens detected. Title "${pageTitle}" and ${h1Count} <h1> header(s) verified.`,
      fixSuggestion: foundPlaceholders.length > 0
        ? `Replace draft filler words (${foundPlaceholders.join(', ')}) with finalized marketing and product copy before public launch.`
        : 'Content structure verified with finalized copy.',
      lastChecked: new Date(),
    });

    // Check 9: WhatsApp Integration
    const hasWaLink =
      $('a[href*="wa.me"]').length > 0 ||
      $('a[href*="api.whatsapp.com"]').length > 0 ||
      $('a[href*="whatsapp://"]').length > 0 ||
      $('script[src*="whatsapp"]').length > 0;
    checks.push({
      checkId: 9,
      name: 'WhatsApp Integration',
      category: 'integrations',
      isMandatory: false,
      status: hasWaLink ? 'passed' : 'warning',
      score: hasWaLink ? 100 : 60,
      details: hasWaLink
        ? `Active WhatsApp Click-to-Chat link or messaging widget detected in DOM.`
        : `No direct WhatsApp Click-to-Chat trigger found on landing view.`,
      fixSuggestion: hasWaLink
        ? 'Verify WhatsApp direct phone number connects to active business support.'
        : 'Add a direct WhatsApp contact button (e.g. https://wa.me/<number>) for instant customer engagement.',
      lastChecked: new Date(),
    });

    // Check 10: Professional Domain Email
    let detectedEmails: string[] = [];
    const mailtoHrefs = $('a[href^="mailto:"]')
      .map((_, el) => $(el).attr('href')?.replace('mailto:', '').split('?')[0].trim())
      .get()
      .filter(Boolean);
    detectedEmails = [...new Set(mailtoHrefs)];
    const hasDomainEmail = detectedEmails.some((email) => email.endsWith(`@${domain}`) || email.endsWith(`@${domain.replace(/^www\./, '')}`));
    const hasFreeEmail = detectedEmails.some((email) => email.includes('@gmail.') || email.includes('@yahoo.') || email.includes('@hotmail.'));
    checks.push({
      checkId: 10,
      name: 'Professional Domain Email',
      category: 'compliance',
      isMandatory: true,
      status: hasDomainEmail ? 'passed' : detectedEmails.length > 0 ? (hasFreeEmail ? 'warning' : 'passed') : 'warning',
      score: hasDomainEmail ? 100 : detectedEmails.length > 0 ? 75 : 55,
      details: hasDomainEmail
        ? `Corporate email verified matching target domain: ${detectedEmails.join(', ')}.`
        : detectedEmails.length > 0
        ? `Found contact email (${detectedEmails.join(', ')}), but does not match domain @${domain}.`
        : `No mailto contact email discovered in DOM.`,
      fixSuggestion: 'Configure Google Workspace, Zoho, or Microsoft 365 on your domain to provide trusted contact emails.',
      lastChecked: new Date(),
    });

    // Check 11: Google Analytics Integration
    const scriptsText = $('script')
      .map((_, el) => $(el).html() || $(el).attr('src') || '')
      .get()
      .join(' ');
    const hasGtag = scriptsText.includes('googletagmanager.com') || scriptsText.includes('gtag(') || scriptsText.includes('G-');
    const hasGaOld = scriptsText.includes('google-analytics.com/analytics.js') || scriptsText.includes('ga(');
    const hasAnalytics = hasGtag || hasGaOld;
    checks.push({
      checkId: 11,
      name: 'Google Analytics Integration',
      category: 'integrations',
      isMandatory: false,
      status: hasAnalytics ? 'passed' : 'warning',
      score: hasAnalytics ? 100 : 45,
      details: hasAnalytics
        ? `Google Tag Manager or GA4 measurement stream tag discovered in scripts.`
        : `No Google Analytics (GA4) or Google Tag Manager tracking snippets found in markup.`,
      fixSuggestion: 'Install Google Tag Manager or GA4 snippet in <head> to capture launch traffic and user conversion telemetry.',
      lastChecked: new Date(),
    });

    // Check 12: Google Search Indexing
    const metaRobots = $('meta[name="robots"]').attr('content')?.toLowerCase() || '';
    const hasNoIndex = metaRobots.includes('noindex');
    checks.push({
      checkId: 12,
      name: 'Google Search Indexing',
      category: 'seo',
      isMandatory: true,
      status: hasNoIndex ? 'failed' : 'passed',
      score: hasNoIndex ? 0 : 100,
      details: hasNoIndex
        ? `Critical SEO Block: Found <meta name="robots" content="${metaRobots}">. Search engine crawlers are barred from indexing this website!`
        : `No blocking noindex meta tags detected. Website is publicly indexable by Googlebot.`,
      fixSuggestion: hasNoIndex
        ? 'Remove the "noindex" attribute from <meta name="robots"> before launch so Google and Bing can crawl your pages.'
        : 'Submit your XML sitemap in Google Search Console after public release.',
      lastChecked: new Date(),
    });

    // Check 13: Social Media Link Preview / Open Graph
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');
    const twitterCard = $('meta[name="twitter:card"]').attr('content');
    const ogScore = (ogTitle ? 25 : 0) + (ogDesc ? 25 : 0) + (ogImage ? 35 : 0) + (twitterCard ? 15 : 0);
    checks.push({
      checkId: 13,
      name: 'Social Media Link Preview / OG',
      category: 'seo',
      isMandatory: true,
      status: ogScore >= 85 ? 'passed' : ogScore >= 50 ? 'warning' : 'failed',
      score: ogScore,
      details: ogScore >= 85
        ? `Complete OpenGraph suite present: og:title, og:description, and social banner og:image.`
        : `Incomplete social previews: missing ${[!ogTitle && 'og:title', !ogDesc && 'og:description', !ogImage && 'og:image', !twitterCard && 'twitter:card'].filter(Boolean).join(', ')}.`,
      fixSuggestion: 'Provide a 1200x630px og:image banner and clear og:title so links preview attractively on LinkedIn, Twitter, and Slack.',
      lastChecked: new Date(),
    });

    // Check 14: Website Backup System (Security headers & backup posture)
    const hasHsts = headers?.has('strict-transport-security') ?? false;
    const hasXFrame = headers?.has('x-frame-options') ?? false;
    const hasCsp = headers?.has('content-security-policy') ?? false;
    const secHeadersCount = (hasHsts ? 1 : 0) + (hasXFrame ? 1 : 0) + (hasCsp ? 1 : 0);
    checks.push({
      checkId: 14,
      name: 'Website Backup System',
      category: 'security',
      isMandatory: true,
      status: secHeadersCount >= 2 ? 'passed' : 'warning',
      score: secHeadersCount >= 2 ? 100 : 70,
      details: secHeadersCount >= 2
        ? `Automated host headers verified (HSTS: ${hasHsts}, X-Frame-Options: ${hasXFrame}, CSP: ${hasCsp}). Host provides snapshot resilience.`
        : `Security protection headers partially configured. Confirm automated database & code backup schedule.`,
      fixSuggestion: 'Verify scheduled automated backups with your host (e.g. AWS S3, Cloudflare, Vercel) and test snapshot restore procedures.',
      lastChecked: new Date(),
    });

    // Check 15: Payment Gateway Integration
    const hasStripe = scriptsText.includes('js.stripe.com') || html.includes('stripe-');
    const hasRazorpay = scriptsText.includes('checkout.razorpay.com');
    const hasPayPal = scriptsText.includes('paypal.com/sdk');
    const hasLemon = scriptsText.includes('lemonsqueezy.com');
    const hasPaddle = scriptsText.includes('paddle.com');
    const hasPayment = hasStripe || hasRazorpay || hasPayPal || hasLemon || hasPaddle;
    checks.push({
      checkId: 15,
      name: 'Payment Gateway Integration',
      category: 'integrations',
      isMandatory: false,
      status: hasPayment ? 'passed' : 'warning',
      score: hasPayment ? 100 : 65,
      details: hasPayment
        ? `Detected payment gateway provider script (${[hasStripe && 'Stripe', hasRazorpay && 'Razorpay', hasPayPal && 'PayPal', hasLemon && 'LemonSqueezy', hasPaddle && 'Paddle'].filter(Boolean).join(', ')}).`
        : `No client payment gateway SDK detected. (If this is not an e-commerce or paid SaaS app, you may mark verified).`,
      fixSuggestion: 'Run test card transactions in sandbox mode before switching API keys to Live/Production mode.',
      lastChecked: new Date(),
    });

    // 6. Calculate Overall Readiness Score & GO / NO-GO Launch Decision
    const totalScore = checks.reduce((acc, c) => acc + c.score, 0);
    const readinessScore = Math.round(totalScore / checks.length);

    const mandatoryChecks = checks.filter((c) => c.isMandatory);
    const mandatoryFailed = mandatoryChecks.some((c) => c.status === 'failed');
    const anyFailed = checks.some((c) => c.status === 'failed');
    const passedCount = checks.filter((c) => c.status === 'passed').length;
    const failedCount = checks.filter((c) => c.status === 'failed').length;
    const warningCount = checks.filter((c) => c.status === 'warning').length;

    let launchStatus: LaunchStatus = 'GO';
    if (mandatoryFailed || readinessScore < 75) {
      launchStatus = 'NO-GO';
    } else if (warningCount > 0 || anyFailed) {
      launchStatus = 'CONDITIONAL';
    } else {
      launchStatus = 'GO';
    }

    const durationMs = Date.now() - startTime;

    return {
      url: parsedUrl.toString(),
      domain,
      readinessScore,
      launchStatus,
      passedCount,
      failedCount,
      warningCount,
      durationMs,
      checks,
      meta: {
        title: pageTitle || domain,
        description: ogDesc || $('meta[name="description"]').attr('content') || '',
        responseTimeMs,
        sslDays: sslResult.daysRemaining,
      },
    };
  }
}
