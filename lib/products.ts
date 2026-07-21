export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  /** Price in cents (USD). $29.00 = 2900 */
  price: number;
  currency: string;
  images: string[];
  description: string[];
  bullets: string[];
  format: string;
  downloadFile: string;
};

// Add more products to this array as your catalog grows — every page
// (grid, detail, cart, checkout) already loops over this list.
export const products: Product[] = [
  {
    id: 'one-person-ai-agency',
    slug: 'the-one-person-ai-agency',
    name: 'The One-Person AI Agency',
    downloadFile: '/downloads/the-one-person-ai-agency.pdf',
    tagline:
      'A complete blueprint for using Claude Code to land clients, deliver AI-powered websites and automation systems, and build a profitable service business — by yourself.',
    price: 1800,
    currency: 'usd',
    images: ['/images/ebook-cover.jpg'],
    format: 'Digital PDF · 85 pages · instant download',
    description: [
      'Most guides on building an AI service business stop at the tech. This one starts with the harder, more valuable part: how to actually land clients, price your work, and deliver it with Claude Code doing the majority of the heavy lifting.',
      'Across eight parts and twenty-five chapters, you\u2019ll get a complete, ordered playbook — from the mindset that survives the hard early stretch, to the exact outreach channels worth your time, to the sales structure that closes deals without ever feeling like a hard sell, to the technical patterns behind websites, automations, and full AI systems.',
      'Every chapter ends with clear takeaways and an action checklist, so you\u2019re never left wondering what to actually do next.',
    ],
    bullets: [
      'The 5x ROI rule for pricing any AI service with confidence',
      'A step-by-step client acquisition system for Upwork and cold email',
      'The "doctor approach" sales structure for calls that close themselves',
      'Exact build patterns for websites, automations, and full AI systems',
      'A 25-chapter, 85-page action-ready playbook — instant PDF download',
    ],
    
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(cents: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
