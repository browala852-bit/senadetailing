// Single source of truth for business data (NAP, services, areas).
// Reused across pages, schema, and the booking flow.

export const site = {
  name: 'Sena Premium Detailing & Tint',
  shortName: 'Sena Premium Detailing',
  tagline: 'Mobile Car Detailing & Window Tint',
  // Owner can confirm/replace the exact street address. City/state shown for now.
  city: 'Prosper',
  region: 'TX',
  regionName: 'Texas',
  zip: '75078',
  url: 'https://senadetailing.vercel.app',
  phoneDisplay: '(214) 656-0656',
  phoneHref: '+12146560656',
  whatsapp: '12146560656', // international, no + or spaces
  instagram: 'senadetailingtint',
  instagramUrl: 'https://instagram.com/senadetailingtint',
  email: 'hello@senapremiumdetailing.com', // placeholder — owner confirms
  priceRange: '$$',
} as const;

// Cities served — also generate /[city] SEO pages from this list.
export const serviceAreas = [
  { slug: 'prosper', name: 'Prosper', region: 'TX' },
  { slug: 'frisco', name: 'Frisco', region: 'TX' },
  { slug: 'plano', name: 'Plano', region: 'TX' },
  { slug: 'mckinney', name: 'McKinney', region: 'TX' },
  { slug: 'dallas', name: 'Dallas', region: 'TX' },
] as const;

// Approx. geo anchor (Prosper, TX) — used for LocalBusiness schema.
export const geo = { latitude: 33.2365, longitude: -96.8006 } as const;
export const openingHours = ['Mo-Sa 08:00-19:00'] as const;

export const areaLabel = 'Frisco · Plano · McKinney · Dallas · Prosper';

// Pre-filled WhatsApp message.
export function waLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const waDefault = waLink(
  "Hello Sena Premium! I'd like to book a detail / get a quote for my vehicle."
);

// --- Detailing packages ---
// PRICE NOTE: Only "Basic $89" is confirmed by the owner. Premium/Ultimate/Tint
// prices below are aligned to real DFW market rates (local research) — owner
// confirms. Prices shown are "from" (sedan); SUV/truck slightly higher.
export const packages = [
  {
    name: 'Essential Detail',
    price: '$89',
    confirmed: true,
    image: '/images/detail-hand.jpg',
    blurb: 'A fast, thorough refresh — inside and out.',
    features: [
      'Full exterior hand wash',
      'Wheels, tires & tire shine',
      'Interior vacuum',
      'Windows in & out',
    ],
    featured: false,
  },
  {
    name: 'Premium Detail',
    price: '$199',
    confirmed: false,
    image: '/images/interior.jpg',
    blurb: 'Deep clean with protection that lasts months.',
    features: [
      'Everything in Essential',
      'Interior deep clean & shampoo',
      'Leather conditioned',
      'Ceramic sealant — 6 months',
    ],
    featured: true,
  },
  {
    name: 'Ultimate Protection',
    price: '$349',
    confirmed: false,
    image: '/images/paint.jpg',
    blurb: 'Showroom finish with ceramic protection.',
    features: [
      'Everything in Premium',
      'Paint correction',
      'Ceramic coating — 12 months',
      'Engine bay & headlights',
    ],
    featured: false,
  },
] as const;

// Window tint — separate service line. Lifetime warranty on film.
export const tintTiers = [
  {
    name: 'Carbon Tint',
    price: 'from $299',
    blurb: 'Fade-resistant carbon film with strong heat rejection. Lifetime warranty.',
  },
  {
    name: 'Ceramic Tint',
    price: 'from $449',
    blurb: 'Premium ceramic film — up to 98% IR heat rejection, crystal clarity. Lifetime warranty.',
  },
] as const;

// The combo is Sena's key differentiator: detail + tint in one visit.
export const comboOffer = {
  label: 'Detail + Tint Combo',
  discount: 'Save $50',
  blurb: 'Book any detail package together with window tint and save $50 — done in one visit.',
} as const;

export const serviceOptions = [
  'Basic Detail — $89',
  'Premium Detail',
  'Ultimate Detail',
  'Window Tint — Carbon',
  'Window Tint — Ceramic',
  'Not sure yet — recommend for me',
] as const;
