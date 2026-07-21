import Link from 'next/link';
import type { Metadata } from 'next';
import { stripe } from '@/lib/stripe';
import ClearCartOnSuccess from '@/components/ClearCartOnSuccess';
import { formatPrice } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Order confirmed — Shiny Press',
};

// Always fetch a fresh session status from Stripe rather than caching.
export const dynamic = 'force-dynamic';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  let email: string | null = null;
  let amountTotal: number | null = null;
  let currency = 'usd';
  let paid = false;

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      // Retrieving the session server-side (with the secret key) is a
      // second, independent confirmation of payment status alongside the
      // webhook in app/api/webhook/route.ts — the webhook remains the
      // source of truth for anything critical like fulfillment.
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === 'paid';
      email = session.customer_details?.email || null;
      amountTotal = session.amount_total;
      currency = session.currency || 'usd';
    } catch (err) {
      console.error('[success] Could not retrieve session:', err);
    }
  }

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <ClearCartOnSuccess />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accenttint text-2xl text-accentdeep">
        &#10003;
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
        {paid ? 'Payment confirmed' : 'Thanks — we\u2019re confirming your order'}
      </h1>
      <p className="mt-3 max-w-md text-inksoft">
        {paid
          ? 'Your purchase went through. A receipt is on its way to your inbox.'
          : 'If this takes more than a minute, check your email for a receipt from Stripe or contact us.'}
      </p>

      {amountTotal !== null && (
        <div className="mt-6 rounded-sm2 border border-line bg-paper2 px-6 py-4 text-sm text-ink">
          <div className="flex justify-between gap-8">
            <span className="text-inksoft">Amount charged</span>
            <span className="font-semibold">
              {formatPrice(amountTotal, currency)}
            </span>
          </div>
          {email && (
            <div className="mt-2 flex justify-between gap-8">
              <span className="text-inksoft">Sent to</span>
              <span className="font-semibold">{email}</span>
            </div>
          )}
        </div>
      )}

      <Link
        href="/products"
        className="mt-10 inline-flex items-center justify-center rounded-sm2 bg-ink px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-paper transition hover:bg-accentdeep"
      >
        Continue shopping
      </Link>
    </div>
  );
}
