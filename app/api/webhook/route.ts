import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';

// Stripe needs the exact raw request body (untouched by any JSON parsing)
// to verify the webhook signature, which is why we read it with `.text()`
// rather than `.json()`. The App Router's Route Handlers give us the raw
// body by default, so no extra config is required here.

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set.');
    return NextResponse.json(
      { error: 'Webhook not configured.' },
      { status: 500 }
    );
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[webhook] Signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // This is the authoritative, server-side confirmation that payment
      // succeeded — safe to trust, unlike the client-side redirect to
      // /success (which a user could reach without actually paying).
      const items = session.metadata?.items
        ? JSON.parse(session.metadata.items)
        : [];

      console.log('[webhook] Payment completed for session', session.id, {
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
        items,
      });

      // 🔧 Extend here once you're ready:
      //   - send an order confirmation email (e.g. with Resend or SendGrid)
      //   - record the order / decrement inventory in a database
      //   - grant access to the downloadable file, if you gate it
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.warn('[webhook] Async payment failed for session', session.id);
      break;
    }

    default:
      // Unhandled event types are fine to ignore.
      break;
  }

  return NextResponse.json({ received: true });
}
