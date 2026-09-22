# Build and verification report

Date: 2026-09-22. Environment: Windows 11, Node 22.15, Astro 7.3.3, Playwright Chromium.

## Build

`npm run build` → 6 pages (`/`, `/experience/`, `/tickets/`, `/plan-your-visit/`, `/join-the-crew/`, `/404.html`), no errors or warnings. Output ~77 MB, of which ~14 MB is video and the rest responsive image derivatives (AVIF/WebP + fallback at multiple widths).

## Functional checks (`npm run check`, 55/55 passing)

Desktop 1440×900 and mobile 390×844 (touch, mobile UA):

- Hero video autoplays muted; pause/play control works; hero pauses while the trailer modal is open and resumes after.
- Trailer modal: opens from "Watch Trailer" and the home trailer feature; video `src` is assigned only on open; Escape closes; focus returns to the opener.
- Reduced motion: still image shown, no video downloaded.
- Mobile hero loads the 480p variant; desktop loads 720p.
- Mobile ticket bar: hidden while the hero CTA is visible, appears after it scrolls away, reserves body padding, hides over the footer and while the Experience trailer player is in view.
- Mobile menu: opens, locks scroll, moves focus inside, marks the active page, closes on Escape and returns focus to the button.
- Lightbox opens/closes on the Experience page; arrow keys navigate.
- FAQ deep link (`/plan-your-visit/#refund-policy`) opens the matching accordion.
- Every page: exactly one `h1`, no placeholder (`#`) links, all rendered images carry width/height, no horizontal overflow at 390 or 1440.
- First Tab on a fresh load lands on the skip link.

## Visual review (`npm run shots`)

Full-page captures at 390, 768, 1024 and 1440 px are in `docs/screenshots/`. Reviewed page by page; corrections made during review: trailer feature crop (mask eyes were cut), footer email wrapping, contact-card email wrapping, mobile hero date line clearance from the video control, character card corners matching the baked-in rounded PNGs, header logo size (transparent padding trimmed).

## Lighthouse (lab, mobile emulation, local preview server)

Reports in `docs/lighthouse/`. These are single local lab runs, not real-user Core Web Vitals; the owner asked not to optimise further.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Home | 78 | 92 | 100 | 100 | 3.0 s | 0 |
| Experience | 82 | 92 | 100 | 100 | 3.9 s | 0 |
| Tickets | 96 | 96 | 100 | 100 | 2.1 s | 0 |

Accessibility items from those runs were fixed afterwards (header ticket button accessible name, hidden ticket bar now `inert`, small red labels raised to ≥4.5:1 contrast); the tables above are from before those fixes.

## Not verified in this environment

- Netlify redirect behaviour (including fragment preservation) — test after the first deploy.
- Real-device Safari/iOS autoplay; the code follows the muted + playsinline requirements and falls back to the still if playback is refused.
- Trailer audio content: loudness confirmed (mean −22.6 dB) but no speech recognition was run, so no caption track was generated. If the audio contains dialogue, add a WebVTT track to both trailer players.

## Open content questions for the owner

1. **November 1**: the website and actor application list it as an operating night; FearTicket's event header says "Oct 16 to Oct 31" and its last checkout slot ends "Nov 01, 12:00 AM". The site keeps November 1. Please confirm.
2. **Free general parking** comes only from the FearTicket FAQ ("Is there free parking? Yes"). Confirm it still applies.
3. **Touch Pass** is presented as its own $30 admission product (as sold). If it is meant to be an add-on to a Haunt Pass, the ticket copy needs changing.
4. **Trailer captions**: see above.
5. **Old tree logo** found in the Wix structured data: unused; delete or confirm retired.
6. The **AVL Solutions** mark appears inside one piece of artwork; it is shown as part of that artwork only, with no sponsorship claim.
