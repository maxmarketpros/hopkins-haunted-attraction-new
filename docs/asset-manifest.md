# Asset manifest

Audit date: 2026-09-22. All assets were downloaded from the live Wix site (`static.wixstatic.com` / `video.wixstatic.com`) and are stored as untouched masters in `assets/masters/`. Web sources live in `src/assets/images/` (processed by Astro/sharp into AVIF + WebP + fallback derivatives at build time) and `public/video/`.

Legend for "Alpha": whether the master PNG contains transparent pixels (all "opaque" PNGs were flattened to JPG web sources to keep the build small; transparent ones stay PNG).

| # | Master file | Original URL (Wix media id) | Dimensions | Alpha | Source page(s) | Web source | Placement | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | `video/hero-trailer-720p-original.mp4` | `video/30eebb_df547e4c42e845c596d57355420dbecb/720p/mp4/file.mp4` | 960×720, 33.5 s, H.264 + AAC, 11.0 MB | – | all pages (background), trailer page (player) | `public/video/hero-bg-720.mp4` (no audio, 4.5 MB), `hero-bg-480.mp4` (640×480, no audio, 2.1 MB), `trailer-720.mp4` (with audio, 7.2 MB) | Home hero background (muted loop); trailer modal; `/experience/#trailer` | Confirmed: same file used for the Wix background and the dedicated trailer player. Footage unchanged; re-encoded only. |
| 2 | `video/hero-trailer-480p-original.mp4` | `…/480p/mp4/file.mp4` | 640×480 | – | – | – | Master only | Kept for reference. |
| 3 | `images/video-poster.jpg` | `30eebb_df547e4c42e845c596d57355420dbecbf000.jpg` | 960×720 | – | all pages | `public/video/poster.jpg` | `poster` attribute on hero and trailer video | Near-black first frame; matches frame 0 so playback starts seamlessly. |
| – | `src/assets/images/hero-still.jpg` (derived) | frame at 6.5 s of asset 1 | 960×720 | – | – | `hero-still.jpg` | Reduced-motion / autoplay-blocked / constrained-connection still, trailer poster, home trailer feature, experience story + gallery | Derived from the actual footage (masked face). Chosen because the original poster is nearly black. |
| 4 | `images/logo-square.png` | `30eebb_64c9ea943c5d4671b184035518d206fd~mv2.png` | 500×500 | transparent (round) | all (header) | `logo-square.png` | Mobile header mark, favicons (`public/icons/*`, `public/favicon.ico`) | |
| 5 | `images/logo-wide.png` | `30eebb_d6dc1dfd28ec47bc936c947a4e0d0eda~mv2.png` | 2000×750 | transparent | all (footer) | `logo-wide.png` (trimmed to 1068×537 content box), `handprint.png` (crop of the handprint) | Desktop header, footer, handprint motif | Trim removes empty padding only. |
| 6 | `images/website-cover.png` | `30eebb_296fe717684941f38aa3b176695e97cb~mv2.png` | 1999×571 | opaque | all (hero banner) | `website-cover.jpg` | Experience gallery; `public/og/og-default.jpg` (1200×630 centre crop) | Contains wordmark; not overlaid on the hero. |
| 7 | `images/wide-artwork-address.png` | `30eebb_6d350fe79efc4413996a49c9855578de~mv2.png` | 1500×600 | opaque | all (present in markup) | `wide-artwork-address.jpg` | Experience gallery (full image, lightbox) | Embedded text: address + AVL Solutions mark. Preserved whole; no sponsorship claim made. |
| 8 | `images/ensemble-scene.png` | `30eebb_d37e45b67cae439eadca82e16a851fcf~mv2.png` | 1086×1448 | opaque | home | `ensemble-scene.jpg` | Home intro spread, Experience hero (cropped), Experience gallery | Illustration; labelled as promotional artwork. |
| 9 | `images/jolly-square.png` | `30eebb_7b97bed78a774ab79d56d84a41c81412~mv2.png` | 500×500 | transparent (octagon) | home | `jolly-square.png` | Experience story ("The Setting") | Octagonal crop baked in; displayed without extra frame. |
| 10 | `images/crew-join-banner.png` | `30eebb_afbf2cc9f2584a6891b35263e6dd9c9a~mv2.png` | 1500×300 | opaque | crew | `crew-join-banner.jpg` | Join the Crew band | Text baked in ("Join Our Haunt Crew"); decorative, headline is HTML. |
| 11 | `images/join-haunt-crew.png` | `30eebb_1b03264e019c469ab3095a5b18e3bc65~mv2.png` | 1800×1200 | opaque | crew | `join-haunt-crew.jpg` | Join the Crew hero artwork | Text baked in; HTML headline sits beside, not over, it. |
| 12 | `images/tryouts-flyer.png` | `30eebb_95e885c735b04f999b5cbaef2c7502e0~mv2.png` | 900×600 | opaque | crew | `tryouts-flyer.jpg` | Join the Crew, collapsed "Past recruitment flyer" | **Expired date** (July 25, 2026 11:00 a.m.). Shown only with an explicit past-event caption; not in schema. |
| 13 | `images/tip-toes.png` | `30eebb_b724fbcbb9734eb9a2545e2192bdf32b~mv2.png` | 900×1200 | transparent (rounded corners) | characters | `tip-toes.png` | Characters grid, home cast preview | |
| 14 | `images/jester.png` | `30eebb_3a699f76f8b1497a8b641c9d391551f4~mv2.png` | 900×1200 | transparent (rounded) | characters | `jester.png` | Characters grid, home cast preview | |
| 15 | `images/bobby-the-butcher.png` | `30eebb_be680008b6a144ff84efd831da48f614~mv2.png` | 900×1200 | opaque | characters | `bobby-the-butcher.jpg` | Characters grid, home cast preview | Source filename "Bobby Stark"; public name used. |
| 16 | `images/ashes.png` | `30eebb_c0ec9a230d934105a69a3f505ee5c3f3~mv2.png` | 900×1200 | opaque | characters | `ashes.jpg` | Characters grid | |
| 17 | `images/slasher.png` | `30eebb_f9e1cf2e1c7d443c9b8c1a6cee186057~mv2.png` | 900×1200 | transparent (rounded) | characters | `slasher.png` | Characters grid, home cast preview | |
| 18 | `images/schizo.png` | `30eebb_d09b2c42195b4f8da7461a1a845d4eab~mv2.png` | 542×819 | opaque | characters | `schizo.jpg` | Characters grid | Low resolution; never upscaled (max derivative = source width). |
| 19 | `images/jolly.png` | `30eebb_ec760ea783cb47f6a6ff46e7fc93b113~mv2.png` | 900×1200 | transparent (rounded) | characters | `jolly.png` | Characters grid | |
| 20 | `images/trouble.png` | `30eebb_7526c5b8c4384734b958d4e93fe8c788~mv2.png` | 900×1200 | transparent (rounded) | characters | `trouble.png` | Characters grid | |
| 21 | `images/og-image.png` | `30eebb_abd6768a42204f059b1bd37a03c8cf07~mv2.png` | 600×300 | transparent | home (og:image only) | – | Not used (too small for OG); replaced by a 1200×630 crop of the cover artwork | Discovered during audit; not in the brief's inventory. |
| 22 | `images/business-logo-schema.png` | `30eebb_4cdb1dd95ff14989891d86ebc256ee1f~mv2.png` | 835×356 | opaque | all (JSON-LD `image` only, never rendered) | – | Not used | Discovered during audit. An older tree-and-gold-type logo that conflicts with the current handprint identity. Kept as a master for the owner. |

## Fonts

Self-hosted latin subsets in `public/fonts/` (Google Fonts, OFL): Barlow Condensed 700/800, Manrope 400/500/700.
