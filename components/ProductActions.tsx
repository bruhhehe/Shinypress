'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';

export default function ProductActions({ slug }: { slug: string }) {
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const router = useRouter();

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }
  function increment() {
    setQuantity((q) => Math.min(99, q + 1));
  }

  function handleAddToCart() {
    addItem(slug, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  async function handleBuyNow() {
    setError(null);
    setIsBuyingNow(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ slug, quantity }] }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout.');
      }
      router.push(data.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong starting checkout.'
      );
      setIsBuyingNow(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-inksoft">
          Quantity
        </span>
        <div className="flex items-center rounded-sm2 border border-line">
          <button
            type="button"
            onClick={decrement}
            aria-label="Decrease quantity"
            className="flex h-10 w-10 items-center justify-center text-lg text-ink transition hover:bg-paper2 disabled:opacity-30"
            disabled={quantity <= 1}
          >
            &minus;
          </button>
          <span
            className="w-10 text-center text-sm font-semibold tabular-nums"
            aria-live="polite"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            aria-label="Increase quantity"
            className="flex h-10 w-10 items-center justify-center text-lg text-ink transition hover:bg-paper2"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex flex-1 items-center justify-center rounded-sm2 border-2 border-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-ink transition hover:bg-ink hover:text-paper"
        >
          {justAdded ? 'Added ✓' : 'Add to Cart'}
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={isBuyingNow}
          className="inline-flex flex-1 items-center justify-center rounded-sm2 bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accentdeep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBuyingNow ? 'Redirecting to checkout…' : 'Buy Now'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <p className="mt-3 text-xs text-inkfaint">
        Buy Now skips the cart and takes you straight to a secure Stripe
        checkout.
      </p>
    </div>
  );
}
