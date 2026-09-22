# Hopkins Haunted Attraction site

Astro 7 static site. Read `README.md` first; content lives in `src/data/site.ts`, migration decisions in `docs/content-map.md`, media provenance in `docs/asset-manifest.md`.

## Development

- `npm run dev` for the dev server (use `astro dev --background` when running from an agent; manage with `astro dev stop|status|logs`).
- `npm run build` then `npm run preview` before running `npm run shots` (screenshots) or `npm run check` (Playwright smoke checks).
- Never hotlink Wix media. Add new images to `src/assets/images/` and originals to `assets/masters/`.
- Keep the five-page structure. Do not add a blog, extra marketing pages, or event schema without reading the notes in `docs/content-map.md`.
- Ticket prices, dates and links change only in `src/data/site.ts`.
