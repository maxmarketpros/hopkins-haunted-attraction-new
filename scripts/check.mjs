/**
 * Functional and accessibility smoke checks against a built site.
 * Usage: node scripts/check.mjs [baseUrl]
 * Covers: hero video behaviour (autoplay, reduced motion, pause control),
 * trailer modal (open, Escape, focus restore), mobile menu (Escape, focus),
 * homepage slogan, absence of the mobile ticket bar, lightbox, FAQ deep links,
 * link integrity, no horizontal overflow, and images with dimensions.
 */
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4321';
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await chromium.launch();

/* ---------------- Desktop ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const state = await page.getAttribute('.hero-video', 'data-state');
  ok('hero video autoplays (muted)', state === 'playing', `state=${state}`);

  // Trailer modal
  await page.click('[data-trailer-open]');
  await page.waitForTimeout(500);
  const modalOpen = await page.evaluate(() => document.getElementById('trailer-modal').open);
  const heroPausedWhileModal = await page.evaluate(() => document.querySelector('.hero-video video').paused);
  const focusInModal = await page.evaluate(() => document.getElementById('trailer-modal').contains(document.activeElement));
  ok('trailer modal opens', modalOpen === true);
  ok('hero pauses while trailer modal is open', heroPausedWhileModal === true);
  ok('focus moves into trailer modal', focusInModal === true);
  const trailerSrc = await page.evaluate(() => document.querySelector('#trailer-modal video').getAttribute('src'));
  ok('trailer video src assigned only on open', !!trailerSrc, trailerSrc);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const modalClosed = await page.evaluate(() => !document.getElementById('trailer-modal').open);
  const focusRestored = await page.evaluate(() => document.activeElement?.hasAttribute('data-trailer-open'));
  const heroResumed = await page.evaluate(() => !document.querySelector('.hero-video video').paused);
  ok('Escape closes trailer modal', modalClosed === true);
  ok('focus returns to opener', focusRestored === true);
  ok('hero resumes after modal closes', heroResumed === true);

  // Header turns opaque on scroll
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  ok('header gets is-scrolled class', await page.evaluate(() => document.getElementById('site-header').classList.contains('is-scrolled')));

  // Keyboard: first Tab on a fresh load lands on the skip link
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => document.activeElement?.className);
  ok('first Tab lands on skip link', skip === 'skip-link', skip);

  // Links integrity on every page
  for (const path of ['/', '/experience/', '/tickets/', '/plan-your-visit/', '/join-the-crew/']) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const bad = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]'))
        .map((a) => a.getAttribute('href'))
        .filter((h) => h === '#' || h === '' || h.startsWith('javascript:'))
    );
    ok(`no placeholder links on ${path}`, bad.length === 0, bad.join(','));
    const noDims = await page.evaluate(() =>
      Array.from(document.images)
        .filter((i) => !i.closest('dialog')) // lightbox image is populated on demand
        .filter((i) => !i.getAttribute('width') || !i.getAttribute('height'))
        .map((i) => i.currentSrc.split('/').pop())
    );
    ok(`all images have width/height on ${path}`, noDims.length === 0, noDims.join(','));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`no horizontal overflow on ${path} @1440`, overflow === 0, `${overflow}px`);
    const h1s = await page.evaluate(() => document.querySelectorAll('h1').length);
    ok(`exactly one h1 on ${path}`, h1s === 1, `${h1s}`);
  }

  // Lightbox + FAQ deep link
  await page.goto(base + '/experience/', { waitUntil: 'networkidle' });
  await page.click('[data-lightbox]');
  await page.waitForTimeout(300);
  ok('lightbox opens', await page.evaluate(() => document.getElementById('lightbox').open));
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  ok('lightbox closes on Escape', await page.evaluate(() => !document.getElementById('lightbox').open));

  await page.goto(base + '/plan-your-visit/#refund-policy', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  ok('FAQ deep link opens the matching accordion', await page.evaluate(() => document.getElementById('refund-policy').open));

  // Reduced motion
  const rmCtx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const rm = await rmCtx.newPage();
  await rm.goto(base + '/', { waitUntil: 'networkidle' });
  await rm.waitForTimeout(800);
  const rmState = await rm.getAttribute('.hero-video', 'data-state');
  const rmSrc = await rm.evaluate(() => document.querySelector('.hero-video video').getAttribute('src'));
  ok('reduced motion: still shown, video not loaded', rmState === 'still' && !rmSrc, `state=${rmState} src=${rmSrc}`);
  await rmCtx.close();

  ok('no page errors (desktop)', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

/* ---------------- Mobile ---------------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const src480 = await page.evaluate(() => document.querySelector('.hero-video video').getAttribute('src'));
  ok('mobile hero loads the 480p variant', src480 === '/video/hero-bg-480.mp4', src480);

  const tagline = await page.locator('.hero__tagline').textContent();
  ok('homepage slogan has the requested text', tagline?.trim() === 'The trail that haunts you', tagline?.trim());
  ok('mobile ticket bar is absent', await page.locator('.ticket-bar').count() === 0);
  const pad = await page.evaluate(() => getComputedStyle(document.body).paddingBottom);
  ok('no body padding reserved for ticket bar', pad === '0px', pad);

  // Mobile menu (opened while scrolled down: header backdrop-filter must not trap the fixed panel)
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(300);
  await page.click('.menu-toggle');
  await page.waitForTimeout(300);
  ok('mobile menu opens', await page.evaluate(() => !document.getElementById('mobile-menu').hidden));
  const menuRect = await page.evaluate(() => { const r = document.getElementById('mobile-menu').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; });
  ok('mobile menu covers the viewport when scrolled', menuRect[0] === 0 && menuRect[1] >= 800, menuRect.join(','));
  ok('body scroll locked while menu open', await page.evaluate(() => document.body.classList.contains('scroll-lock')));
  ok('focus inside menu', await page.evaluate(() => document.getElementById('mobile-menu').contains(document.activeElement)));
  ok('active page marked in menu', await page.evaluate(() => !!document.querySelector('#mobile-menu a[aria-current="page"]')));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  ok('Escape closes mobile menu', await page.evaluate(() => document.getElementById('mobile-menu').hidden));
  ok('focus returns to menu button', await page.evaluate(() => document.activeElement?.classList.contains('menu-toggle')));

  for (const path of ['/', '/experience/', '/tickets/', '/plan-your-visit/', '/join-the-crew/']) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`no horizontal overflow on ${path} @390`, overflow === 0, `${overflow}px`);
    ok(`no mobile ticket bar on ${path}`, await page.locator('.ticket-bar').count() === 0);
  }

  ok('no page errors (mobile)', errors.length === 0, errors.join(' | '));
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
