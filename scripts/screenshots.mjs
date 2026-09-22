/**
 * Full-page screenshots of every page at representative widths.
 * Usage: node scripts/screenshots.mjs [baseUrl] [widths]
 *   node scripts/screenshots.mjs http://127.0.0.1:4321 390,768,1024,1440
 * Output: docs/screenshots/<page>-<width>.jpg
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://127.0.0.1:4321';
const widths = (process.argv[3] || '390,768,1024,1440').split(',').map(Number);
const pages = [
  ['home', '/'],
  ['experience', '/experience/'],
  ['tickets', '/tickets/'],
  ['plan-your-visit', '/plan-your-visit/'],
  ['join-the-crew', '/join-the-crew/'],
];

await mkdir('docs/screenshots', { recursive: true });
const browser = await chromium.launch();
const report = [];

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 700 ? 844 : 900 },
    deviceScaleFactor: 1,
    isMobile: width < 700,
    hasTouch: width < 700,
    reducedMotion: 'no-preference',
  });
  for (const [name, path] of pages) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // Force reveals + lazy images so the capture shows final layout.
    await page.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = 'eager'));
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 600));
      window.scrollTo(0, 0);
      await Promise.all(
        Array.from(document.images)
          .filter((i) => !i.complete)
          .map((i) => new Promise((r) => ((i.onload = r), (i.onerror = r))))
      );
    });
    // Fixed/sticky chrome would repeat mid-page in a stitched full-page capture.
    await page.addStyleTag({
      content: '.site-header{position:absolute!important}.ticket-bar{display:none!important}',
    });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const file = `docs/screenshots/${name}-${width}.jpg`;
    await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 82 });
    report.push({ name, width, overflow, errors: errors.length, file });
    if (errors.length) console.log(`  [${name}@${width}] console errors:`, errors.slice(0, 3));
    await page.close();
  }
  await context.close();
}
await browser.close();
console.table(report);
