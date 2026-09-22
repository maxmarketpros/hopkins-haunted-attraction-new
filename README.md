# Hopkins Haunted Attraction — website

Five-page marketing site for Hopkins Haunted Attraction (Simpsonville, SC), built with [Astro 7](https://astro.build), plain CSS and a small amount of vanilla JavaScript. No framework runtime ships to the browser.

| Page | Path |
|---|---|
| Home | `/` |
| The Experience (story, trailer, characters, artwork, pass comparison) | `/experience/` |
| Tickets & Dates | `/tickets/` |
| Plan Your Visit (directions, practical info, FAQ, contact) | `/plan-your-visit/` |
| Join the Crew | `/join-the-crew/` |

A technical 404 page exists at `/404.html`.

## Commands

Requires Node 22.12+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run preview    # serves dist/ at http://localhost:4321
npm run shots      # full-page screenshots of every page at 390/768/1024/1440 → docs/screenshots/
npm run check      # functional + accessibility smoke checks against the preview server
```

`shots` and `check` need the preview server running (`npm run preview`) and Playwright's Chromium (`npx playwright install chromium`, done once).

## Editing seasonal content

Everything that changes year to year lives in **`src/data/site.ts`**:

- `season` — year, operating-night ranges, hours. Every date list, the hero date line, the calendar on `/tickets/`, the footer and the JSON-LD `openingHoursSpecification` are generated from this.
- `tickets` — product names, base prices, observed fees (informational), blurbs and notes. Also drives "Admission from $…" copy.
- `links` — FearTicket, application form, socials, directions. Buttons labelled **Buy Tickets** always open the FearTicket storefront; **Tickets & Dates** always goes to `/tickets/`.
- `characters` — the eight portraits, names and alt text. Add or remove a character here and both the home preview and the full grid update.
- `faqGroups` — FAQ content grouped by topic (also emitted as `FAQPage` JSON-LD).
- `recruitment` — application facts and the past-flyer caption.

There is intentionally no countdown or "open tonight" logic. If you add one, use `season.timeZone` (`America/New_York`) and the exact dates in `season.ranges`.

## Media

- **Masters** (never served): `assets/masters/images/` and `assets/masters/video/`. See `docs/asset-manifest.md` for every source URL, dimensions and placement.
- **Web image sources**: `src/assets/images/`. Astro generates AVIF/WebP + fallback derivatives with `srcset`/`sizes` at build time. Opaque PNGs were flattened to JPG sources; PNGs with transparency (logos, rounded portraits) stay PNG.
- **Video**: `public/video/`. `hero-bg-720.mp4` / `hero-bg-480.mp4` are the muted background loops; `trailer-720.mp4` keeps the audio. All are re-encodes of the original Wix file, footage unchanged. To replace the video, drop new files with the same names, then regenerate `src/assets/images/hero-still.jpg` (a representative frame) with:

  ```bash
  ffmpeg -ss 6.5 -i assets/masters/video/hero-trailer-720p-original.mp4 -frames:v 1 -q:v 2 src/assets/images/hero-still.jpg
  ```

- **Fonts**: self-hosted latin subsets in `public/fonts/` (Barlow Condensed 700/800, Manrope 400/500/700).
- **Icons / OG**: `public/icons/`, `public/favicon.ico`, `public/og/og-default.jpg` (1200×630 crop of the cover artwork).

## Hero video behaviour

Implemented in `src/components/HeroVideo.astro` + `src/scripts/main.js`:

- Autoplays muted, loops, plays inline; audio never autoplays.
- The `poster` is the original (near-black) first frame so playback starts seamlessly; a still from the footage is layered underneath and shown until playback begins, for `prefers-reduced-motion`, on `saveData`/2g–3g connections, or if autoplay is blocked.
- 720p on viewports ≥768px, 480p below. `preload="none"`; the source is assigned by script.
- Visible pause/play control (bottom right). Playback pauses when the hero leaves the viewport, the tab is hidden, or the trailer modal is open.
- "Watch Trailer" opens an accessible `<dialog>` with the same file plus audio and controls; without JavaScript the link goes to `/experience/#trailer`.

## Hosting and redirects

`netlify.toml` contains the build settings, cache headers and all permanent redirects from the old Wix URLs (plus 410s for the retired blog). If you host elsewhere, port the `[[redirects]]` table. After deploying, verify in a browser that `/hopkins-haunted-attraction-trailer` lands on `/experience/#trailer` with the trailer in view; if the host drops the fragment, the page's "On this page" links are the fallback.

Structured data decisions and the content migration map are in `docs/content-map.md`.

## Project layout

```
src/
  data/site.ts            single source of truth for content
  layouts/Base.astro      <head>, JSON-LD, header/footer/ticket bar, script
  components/             Header, Footer, HeroVideo, TrailerModal, Lightbox,
                          CharacterCard, TicketPanel, Schedule, FaqList, PageIntro, Icon, TicketBar
  pages/                  index, experience, tickets, plan-your-visit, join-the-crew, 404
  scripts/main.js         progressive enhancements (menu, ticket bar, video, dialogs, reveals)
  styles/global.css       fonts, design tokens, base styles, shared components
public/                   fonts, video, icons, og, robots.txt, sitemap.xml, site.webmanifest
assets/masters/           original downloads (not served)
docs/                     asset manifest, content map, screenshots, verification report
scripts/                  screenshots.mjs, check.mjs (Playwright)
```
