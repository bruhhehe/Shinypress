import { NextRequest, NextResponse } from 'next/server';
import { stripe, getSiteUrl } from '@/lib/stripe';
import { getProductBySlug } from '@/lib/products';

type IncomingItem = { slug: string; quantity: number };

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          'Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env.local (see .env.local.example).',
      },
      { status: 500 }
    );
  }

  let body: { items?: IncomingItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const incomingItems = Array.isArray(body.items) ? body.items : [];
  if (incomingItems.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  }

  // Never trust prices/quantities from the client — always re-look-up the
  // product (and its price) on the server from our own product catalog.
  const line_items: Array<{
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; images?: string[] };
    };
    quantity: number;
  }> = [];

  for (const item of incomingItems) {
    const product = getProductBySlug(item.slug);
    const quantity = Math.min(99, Math.max(1, Math.floor(item.quantity || 1)));
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${item.slug}` },
        { status: 400 }
      );
    }
    const siteUrl = getSiteUrl();
    line_items.push({
      price_data: {
        currency: product.currency,
        unit_amount: product.price,
        product_data: {
          name: product.name,
          images: product.images.map((img) =>
            img.startsWith('http') ? img : `${siteUrl}${img}`
          ),
        },
      },
      quantity,
    });
  }

  const siteUrl = getSiteUrl();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      // Stashed so the webhook handler can log/act on exactly what was
      // purchased (e.g. for order records or confirmation emails) without
      // a database — see app/api/webhook/route.ts.
      metadata: {
        items: JSON.stringify(
          incomingItems.map((i) => ({ slug: i.slug, quantity: i.quantity }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Stripe error:', err);
    return NextResponse.json(
      { error: 'Could not create a checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
