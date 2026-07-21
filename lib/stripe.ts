import Stripe from 'stripe';

// ⚠️ SERVER-SIDE ONLY. Never import this file from a Client Component.
//
// STRIPE_SECRET_KEY is read from the environment — set it in `.env.local`
// (see `.env.local.example` in the project root for the exact variable
// names to fill in with your own Stripe test/live keys).
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  // We don't throw at import time so the app can still build without keys
  // present (useful for CI/preview builds). Routes that need Stripe check
  // for this and return a clear error instead of crashing.
  console.warn(
    '[stripe] STRIPE_SECRET_KEY is not set. Add it to .env.local before using checkout.'
  );
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}
