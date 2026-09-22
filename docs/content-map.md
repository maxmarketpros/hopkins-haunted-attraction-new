# Content mapping and migration notes

Audit date: 2026-09-22. Source of truth: live Wix pages + FearTicket storefront + the Google Form application. Cached search snippets were ignored.

## Source → destination

| Source page / section | Destination |
|---|---|
| Home: nav (Home, About, Trailer, "Frequant Questions", Join the Crew, Characters, Blog) | New nav: Home, The Experience, Tickets & Dates, Plan Your Visit, Join the Crew. Misspelling corrected. Blog removed. |
| Home: background video + cover banner | `/` hero (same video, muted loop). Cover artwork moved to `/experience/#gallery` and used for the OG image. |
| Home: "The Most Terrifying Haunted Attraction…" intro | `/` intro spread ("This is no ordinary haunted trail") and `/experience/` story sections, rewritten concisely. |
| Home: "THIS IS NO ORDINARY HAUNTED TRAIL" body | `/` intro; `/experience/#story`. |
| Home: Touch Pass paragraph + "Haunt Touch Pass – $30" | `/tickets/#haunt-touch-pass`, `/tickets/#touch-pass`, `/experience/#options`. Presented as its own $30 admission product (as the checkout does), not a $5 upgrade. |
| Home: 2026 SEASON DATES / HOURS OF OPERATION | `src/data/site.ts` → `/` hero date line, info strip, tickets preview; `/tickets/#dates` calendar; footer; JSON-LD `openingHoursSpecification`. |
| Home: Pricing (Haunt Pass $25, Kids $15 + PG-13 copy, VIP Parking $10) | `/tickets/#admission` panels; `/` tickets preview; kids guidance kept beside the price. Parking presented separately from admission. |
| Home: SEE TRAILER | `/` "Watch Trailer" (modal, falls back to `/experience/#trailer`). |
| Home: Jolly octagon image | `/experience/#story`. |
| Home: contact/socials/footer | Shared footer; `/plan-your-visit/#contact`; `/` visit preview. |
| About page (4 SEO sections) | `/experience/#story` (setting, production, local roots), trimmed of repetitive SEO copy and unverifiable ghost-lore claims. "Tickets often sell out" was not carried over (unverified). |
| Trailer page | `/experience/#trailer` (full 4:3 player with controls). |
| FAQ page (7 questions) | `/plan-your-visit/#faq` merged with the 14 FearTicket FAQs, deduplicated and grouped. |
| Join the Crew page (intro, Haunt Crew Join banner, JOIN THE HAUNT CREW artwork, Apply Now, tryouts flyer, "Premier Seasonal Entertainment Jobs" section) | `/join-the-crew/` (hero artwork, opportunity copy, banner, past-flyer disclosure, application facts from the form, Apply CTA). |
| Characters page (8 portraits + names) | `/experience/#characters` (all 8, verified pairing); 4 previewed on `/`. |
| FearTicket: products, fees, FAQ, refund policy | Ticket data + fee note; FAQ; "Before you buy" policy summary with link to the checkout policy. |
| Google Form: application description | `/join-the-crew/` "Before you apply" facts. Waiver language intentionally not reproduced. |
| Blog (4 posts) | Not migrated. See redirects below. |

## Reconciliation and verification notes

- **Products and fees (verified in checkout modal 2026-09-22):** Haunt Pass $25 (+$2.50 fee = $27.50), Haunt Touch Pass $30 (+$3.00 = $33.00), Haunt Kids 10 & Under Pass $15 (+$2.00 = $17.00), VIP Parking $10 (+$1.50 = $11.50, "Private Booking" label, "does not include admission"). Base prices are shown on the site with "plus fees at checkout".
- **Date slots at checkout:** FearTicket sells three date-range slots (Oct 16 7:30 PM → Oct 17, Oct 23 → Oct 25, Oct 29 → Nov 1 12:00 AM), not individual nights, and offers no per-date deep links. The site therefore never links a specific date to checkout.
- **Video:** confirmed 960×720, 33.5 s, audio present (mean −22.6 dB). The same Wix media id backs both the site background and the trailer page player.
- **Live links checked:** FearTicket, Google Form, Google Maps directions, Instagram, TikTok respond; Facebook returns 400 to non-browser clients (normal bot blocking) and the URL is the one in the footer.
- **Legacy AllEvents link / Square checkout:** not present on the live site; not used.
- **Old tree logo:** the Wix JSON-LD referenced an older gold "tree" logo never shown on the pages. Kept as a master, not used.

## Redirects (see `netlify.toml`)

| Old path | New | Reason |
|---|---|---|
| `/about-hopkins-haunted-attraction` | `/experience/` | About content lives here. |
| `/hopkins-haunted-attraction-trailer` | `/experience/#trailer` | |
| `/hopkins-haunted-attraction-characters` | `/experience/#characters` | |
| `/frequently-asked-questions` | `/plan-your-visit/#faq` | |
| `/entertainment-jobs-in-greenville-county` | `/join-the-crew/` | |
| `/post/exciting-seasonal-entertainment-jobs-…` | `/join-the-crew/` | Same topic: seasonal jobs at the attraction. |
| `/post/experience-the-thrills-of-hopkins-haunted-attraction` | `/experience/` | Generic "what to expect" article; the Experience page covers it. |
| `/post/join-the-chilling-story-at-hopkins-haunted-attraction` | `/experience/` | Same as above. |
| `/post/discover-simpsonville-s-1800s-haunted-adventure` | **410 Gone** | Town ghost-history article; no equivalent content exists. |
| `/blog`, `/blog/*` | **410 Gone** | Blog retired. |

Fragments in `Location` headers are honoured by browsers; in case a host strips them, each destination page has a visible "On this page" jump navigation right under its heading.

## Structured data decisions

- `TouristAttraction` + `LocalBusiness` with exact contact details, logo, `sameAs` (3 verified socials) and `openingHoursSpecification` limited to the four operating ranges.
- `BreadcrumbList` on interior pages. `FAQPage` on Plan Your Visit (content is visible on the page).
- **No `Event` markup.** Google's Event documentation (checked 2026-09-22) supports only pages focused on a single event and asks for a separate Event per performance with its own detail URL. A single schedule page listing nine nights is not eligible, and the brief keeps the site to five pages. Visible dates are accurate; no misleading schema was added.
- No ratings, reviews or coordinates.
