/**
 * Single source of truth for business facts, seasonal content, links,
 * ticket products, characters and FAQs.
 *
 * Every page, the footer, structured data and the sitemap read from here.
 * To update the season: edit `season` (dates, hours) and `tickets` (prices).
 *
 * Sources (audited 2026-09-22):
 *  - https://www.hopkinshauntedattraction.com/ (home, about, FAQ, crew, characters)
 *  - https://hopkinshauntedattraction.fearticket.com (products, fees, FAQ, refund policy)
 *  - Google Form actor application (recruitment facts)
 */

import tipToes from '../assets/images/tip-toes.png';
import jester from '../assets/images/jester.png';
import bobby from '../assets/images/bobby-the-butcher.jpg';
import ashes from '../assets/images/ashes.jpg';
import slasher from '../assets/images/slasher.png';
import schizo from '../assets/images/schizo.jpg';
import jolly from '../assets/images/jolly.png';
import trouble from '../assets/images/trouble.png';

export const SITE_URL = 'https://www.hopkinshauntedattraction.com';

export const business = {
  name: 'Hopkins Haunted Attraction',
  legalCopyrightLine: 'Sinister Woods, 1800s.',
  venue: 'Historic Hopkins Farm',
  established: 2023,
  format: 'Outdoor walk-through haunted trail',
  theme: 'Sinister woods with an 1800s setting',
  trailTime: 'Approximately 30 minutes, depending on how fast your group walks',
  phoneDisplay: '(864) 243-4010',
  phoneTel: '+18642434010',
  email: 'hopkinshauntedattraction@gmail.com',
  address: {
    street: '3717 Fork Shoals Rd.',
    city: 'Simpsonville',
    region: 'SC',
    regionLong: 'South Carolina',
    postal: '29680',
    country: 'US',
    county: 'Greenville County',
    area: 'the Upstate',
  },
} as const;

export const links = {
  tickets: 'https://hopkinshauntedattraction.fearticket.com',
  ticketPolicy: 'https://hopkinshauntedattraction.fearticket.com',
  apply:
    'https://docs.google.com/forms/d/e/1FAIpQLSebeqHuFZSAHoX6PPnMaGSXXhxwLctFvSUT_IQ7yjARclgPaA/viewform?pli=1',
  facebook: 'https://www.facebook.com/profile.php?id=61573071903049',
  instagram: 'https://www.instagram.com/hopkinshauntedattraction/',
  tiktok: 'https://www.tiktok.com/@haunted_hopkins?lang=en',
  directions:
    'http://maps.google.com/maps?daddr=3717%20Fork%20Shoals%20Rd,%20Simpsonville,%20SC%2029680,%20USA',
  mapEmbed:
    'https://www.google.com/maps?q=3717+Fork+Shoals+Rd,+Simpsonville,+SC+29680&output=embed',
  phone: `tel:${business.phoneTel}`,
  email: `mailto:${business.email}`,
} as const;

export const socials = [
  { name: 'Facebook', href: links.facebook, icon: 'facebook' },
  { name: 'Instagram', href: links.instagram, icon: 'instagram' },
  { name: 'TikTok', href: links.tiktok, icon: 'tiktok' },
] as const;

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'The Experience', href: '/experience/' },
  { label: 'Tickets & Dates', href: '/tickets/' },
  { label: 'Plan Your Visit', href: '/plan-your-visit/' },
  { label: 'Join the Crew', href: '/join-the-crew/' },
] as const;

/* ------------------------------------------------------------------ */
/* Season                                                              */
/* ------------------------------------------------------------------ */

export const season = {
  year: 2026,
  timeZone: 'America/New_York',
  hours: { open: '7:30 PM', close: 'Midnight', openISO: '19:30', closeISO: '23:59' },
  hoursLine: '7:30 PM – Midnight',
  /** Operating nights grouped exactly as the source presents them. */
  ranges: [
    { label: 'October 16–17', short: 'Oct 16–17', dates: ['2026-10-16', '2026-10-17'] },
    { label: 'October 23–25', short: 'Oct 23–25', dates: ['2026-10-23', '2026-10-24', '2026-10-25'] },
    { label: 'October 29–31', short: 'Oct 29–31', dates: ['2026-10-29', '2026-10-30', '2026-10-31'] },
    { label: 'November 1', short: 'Nov 1', dates: ['2026-11-01'] },
  ],
} as const;

export const allOperatingDates: string[] = season.ranges.flatMap((r) => [...r.dates]);

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions) {
  // Noon local avoids any DST edge when formatting a calendar date.
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', { timeZone: season.timeZone, ...opts }).format(d);
}

export const datesInline = season.ranges.map((r) => r.short).join(' · ');
/** Month shown once per run: "Oct 16–17 · 23–25 · 29–31 · Nov 1". */
export const datesCompact = season.ranges
  .map((r, i, arr) => (i > 0 && r.short.slice(0, 3) === arr[i - 1].short.slice(0, 3) ? r.short.slice(4) : r.short))
  .join(' · ');
export const datesSentence = 'October 16–17, 23–25, 29–31 and November 1';

/* ------------------------------------------------------------------ */
/* Tickets                                                             */
/* ------------------------------------------------------------------ */

export type Ticket = {
  id: string;
  name: string;
  price: number;
  /** Observed service fee at checkout on 2026-09-22 (informational). */
  fee: number;
  kind: 'admission' | 'parking';
  tagline: string;
  blurb: string;
  notes: string[];
  emphasis?: boolean;
};

export const tickets: Ticket[] = [
  {
    id: 'haunt-pass',
    name: 'Haunt Pass',
    price: 25,
    fee: 2.5,
    kind: 'admission',
    tagline: 'Standard admission',
    blurb:
      'Walk the full trail: live scare actors, sets in the woods and a fully immersive haunted adventure. Actors will not touch you.',
    notes: ['One admission per pass', 'PG-13 intensity: darkness, loud noises, fog, flashing lights, sudden scares'],
  },
  {
    id: 'haunt-touch-pass',
    name: 'Haunt Touch Pass',
    price: 30,
    fee: 3,
    kind: 'admission',
    tagline: 'Optional contact experience',
    blurb:
      'Admission plus permission for actors to touch you in a safe but startling way. Pick up your glow necklace at the ticket booth and keep it visible on the trail.',
    notes: [
      'Sold as its own admission product, not a separate upgrade',
      'Remove the necklace and tell a staff member to opt out at any point',
    ],
    emphasis: true,
  },
  {
    id: 'haunt-kids-pass',
    name: 'Haunt Kids 10 & Under Pass',
    price: 15,
    fee: 2,
    kind: 'admission',
    tagline: 'Ages 10 and under',
    blurb:
      'Admission for children ages 10 and under. This is a PG-13 haunted attraction designed to scare, so parental discretion is strongly advised.',
    notes: [
      'Every child must be accompanied by a responsible adult',
      'Consider your child’s comfort with scary environments before buying',
    ],
  },
  {
    id: 'vip-parking',
    name: 'VIP Parking Pass',
    price: 10,
    fee: 1.5,
    kind: 'parking',
    tagline: 'Per vehicle · does not include admission',
    blurb:
      'Skip the general parking area and park closer to the entrance for a quicker arrival and exit. Valid for one vehicle.',
    notes: ['Limited VIP parking each night', 'Attraction tickets must be purchased separately'],
  },
];

export const admissionTickets = tickets.filter((t) => t.kind === 'admission');
export const parkingTicket = tickets.find((t) => t.kind === 'parking')!;
export const feesNote = 'Prices shown are base prices. Additional fees apply at checkout.';
export const lowestAdmission = Math.min(...admissionTickets.map((t) => t.price));

export function money(n: number) {
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/* Characters                                                          */
/* ------------------------------------------------------------------ */

export type Character = {
  slug: string;
  name: string;
  image: ImageMetadata;
  /** Describes the artwork only; no invented biography. */
  alt: string;
};

export const characters: Character[] = [
  {
    slug: 'tip-toes',
    name: 'Tip Toes',
    image: tipToes,
    alt: 'Tip Toes: a grinning clown-faced figure with teal and pink hair peering around a rust-red door.',
  },
  {
    slug: 'jester',
    name: 'Jester',
    image: jester,
    alt: 'Jester: a masked jester in a black-and-white striped suit and horned hood, crouched with a bat.',
  },
  {
    slug: 'bobby-the-butcher',
    name: 'Bobby the Butcher',
    image: bobby,
    alt: 'Bobby the Butcher: a figure in a blood-stained apron beside a rusted cabinet in the woods.',
  },
  {
    slug: 'ashes',
    name: 'Ashes',
    image: ashes,
    alt: 'Ashes: a long-haired figure in a leopard-print coat straddling a motorcycle on a leaf-covered road.',
  },
  {
    slug: 'slasher',
    name: 'Slasher',
    image: slasher,
    alt: 'Slasher: a top-hatted figure in a stitched mask and red bandana gripping a chainsaw.',
  },
  {
    slug: 'schizo',
    name: 'Schizo',
    image: schizo,
    alt: 'Schizo: a motion-blurred portrait of a dreadlocked figure with a scarred face and manic grin.',
  },
  {
    slug: 'jolly',
    name: 'Jolly',
    image: jolly,
    alt: 'Jolly: a doll-like figure in a torn dress and pigtails seated in a rocking chair, clutching a doll.',
  },
  {
    slug: 'trouble',
    name: 'Trouble',
    image: trouble,
    alt: 'Trouble: a grinning youth in a ragged vest and bandana standing before a spray-painted sign.',
  },
];

/* ------------------------------------------------------------------ */
/* FAQs                                                                */
/* ------------------------------------------------------------------ */

export type Faq = { id: string; q: string; a: string };
export type FaqGroup = { id: string; title: string; items: Faq[] };

export const faqGroups: FaqGroup[] = [
  {
    id: 'experience',
    title: 'The experience',
    items: [
      {
        id: 'indoors-or-outdoors',
        q: 'Is the attraction indoors or outdoors?',
        a: 'The haunted trail is an outdoor walking attraction through the woods of Historic Hopkins Farm. You will encounter natural and uneven terrain, so closed-toe, comfortable walking shoes are strongly recommended.',
      },
      {
        id: 'how-long',
        q: 'How long does it take to walk the trail?',
        a: 'Typically about 30 minutes. It depends on how fast you and your group walk.',
      },
      {
        id: 'do-actors-touch',
        q: 'Do the actors touch you?',
        a: 'Actors will only touch you if you purchase the Haunt Touch Pass. With the standard Haunt Pass, actors will not touch you.',
      },
      {
        id: 'too-scary-for-children',
        q: 'Is this haunted attraction too scary for children?',
        a: 'A Haunt Kids 10 & Under Pass is available, but please keep in mind this is a PG-13 haunted attraction designed to scare. The trail includes live scare actors, darkness, loud noises, flashing lights, fog effects, frightening scenes and sudden scares. Parental discretion is strongly advised. All children must be accompanied by a responsible adult, and please consider your child’s comfort level with scary environments before purchasing.',
      },
    ],
  },
  {
    id: 'tickets',
    title: 'Tickets & Touch Pass',
    items: [
      {
        id: 'buy-at-event',
        q: 'Can I purchase tickets at the event?',
        a: 'Yes, there is a ticket booth on site. You can skip the line by purchasing your tickets online in advance.',
      },
      {
        id: 'touch-pass-necklace',
        q: 'Where do I get my Touch Pass necklace?',
        a: 'If you purchased a Touch Pass, pick up your glow necklace at the ticket booth when you arrive. The necklace must be worn and clearly visible throughout the attraction so actors know you have opted in.',
      },
      {
        id: 'remove-touch-pass',
        q: 'Can I remove my Touch Pass if it becomes too intense?',
        a: 'Yes. If you no longer want to participate in physical interactions, remove your glow necklace and notify a staff member. Once removed, actors should no longer intentionally engage you under the Touch Pass experience.',
      },
      {
        id: 'refund-too-scared',
        q: 'Can I get a refund if I get too scared to finish?',
        a: 'No. Being scared is part of the experience. Refunds are not issued because a guest chooses not to enter, becomes frightened or does not complete the attraction.',
      },
    ],
  },
  {
    id: 'parking',
    title: 'Arrival & parking',
    items: [
      {
        id: 'free-parking',
        q: 'Is there free parking?',
        a: 'Yes. General parking is available at no charge.',
      },
      {
        id: 'park-close',
        q: 'Can we park close to the entrance?',
        a: 'Yes. A VIP Parking Pass is $10 per vehicle and lets you park closer to the entrance. It can be purchased online when buying tickets and does not include admission.',
      },
      {
        id: 'accessible-parking',
        q: 'Is there accessible (handicap) parking?',
        a: 'Yes, accessible parking is available. Note that the trail itself is on natural, uneven terrain; see the accessibility question below.',
      },
      {
        id: 'coolers',
        q: 'Can I bring a cooler?',
        a: 'No. Food and drink vendors will be selling at the event each night.',
      },
    ],
  },
  {
    id: 'comfort',
    title: 'Comfort, safety & accessibility',
    items: [
      {
        id: 'what-to-wear',
        q: 'What should I wear?',
        a: 'Dress for the weather and wear comfortable, closed-toe shoes. High heels, flip-flops or other footwear not suited to uneven outdoor terrain are strongly discouraged.',
      },
      {
        id: 'medical-conditions',
        q: 'Can I go through if I am pregnant or have a medical condition?',
        a: 'The attraction includes sudden scares, uneven terrain, darkness, loud noises, flashing lights, fog effects and other intense elements. Guests who are pregnant or who have heart conditions, seizure disorders, respiratory conditions, mobility concerns or other conditions that could be affected by the experience should consider these risks before entering.',
      },
      {
        id: 'wheelchair-access',
        q: 'Is the trail wheelchair or stroller accessible?',
        a: 'Because the attraction takes place outdoors on natural and uneven terrain, some areas may be difficult to navigate with wheelchairs, walkers or strollers. Please contact us before purchasing if you have accessibility questions so we can discuss current trail conditions and available accommodations.',
      },
    ],
  },
  {
    id: 'weather',
    title: 'Weather & refunds',
    items: [
      {
        id: 'rain',
        q: 'What happens if it rains?',
        a: 'The event is a live outdoor experience and operates in most weather conditions, so dress accordingly. Severe weather may affect operations; any weather-related delays, closures or updates are announced through our official channels.',
      },
      {
        id: 'refund-policy',
        q: 'What is the refund policy?',
        a: 'All ticket sales are final and non-refundable. If you cannot attend, you may transfer your ticket to another guest or use it on a different operating night, based on availability. If the venue fully cancels a night due to severe weather or unforeseen circumstances, ticket holders can transfer to another available date or receive a full refund. No refunds are issued for no-shows, long wait times, or for fear or choosing not to complete the attraction. The full policy is on the checkout site.',
      },
    ],
  },
];

export const allFaqs: Faq[] = faqGroups.flatMap((g) => g.items);

/* ------------------------------------------------------------------ */
/* Recruitment                                                         */
/* ------------------------------------------------------------------ */

export const recruitment = {
  formTitle: 'Paid Haunt Actor Application',
  facts: [
    'Scare actor positions are paid by the day; pay is discussed once your application is reviewed.',
    'Applicants must be 16 or older. A parent or guardian signs for applicants under 18.',
    'No prior acting experience is required.',
    'All actors audition before being cast in a role.',
    'Selected actors attend all mandatory meetings, orientation and practice days. The schedule is provided after you apply.',
    'Each actor is assigned a character and provided a costume.',
  ],
  actorNightsNote:
    'Performances run on the same nights as the public season. Actor call times are set during orientation and are separate from public hours.',
  pastFlyer: {
    label: 'Past recruitment flyer',
    caption:
      'Actor recruitment and tryouts flyer for July 25, 2026 at 11:00 a.m. This date has passed and is shown for reference only. Apply through the form for current opportunities.',
  },
} as const;
