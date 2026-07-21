'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { getProductBySlug, formatPrice } from '@/lib/products';

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem, isHydrated } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout.');
      }
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong starting checkout.'
      );
      setIsCheckingOut(false);
    }
  }

  if (!isHydrated) {
    return <div className="container-page py-16" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 text-inksoft">
          Nothing here yet — go find something worth reading.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center justify-center rounded-sm2 bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accentdeep"
        >
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-16">
      <h1 className="font-display text-3xl font-bold text-ink">Your cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,360px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => {
            const product = getProductBySlug(item.slug);
            if (!product) return null;
            return (
              <li key={item.slug} className="flex gap-4 py-6">
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-sm2 border border-line">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={160}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-display text-base font-bold text-ink hover:text-accent"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-inksoft">
                        {formatPrice(product.price, product.currency)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="text-xs font-semibold uppercase tracking-wide text-inkfaint transition hover:text-accent"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-sm2 border border-line">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() =>
                          setQuantity(item.slug, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-paper2"
                      >
                        &minus;
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        onClick={() =>
                          setQuantity(item.slug, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-ink transition hover:bg-paper2"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-ink">
                      {formatPrice(product.price * item.quantity, product.currency)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="h-fit rounded-sm2 border border-line bg-paper2 p-6">
          <h2 className="font-display text-lg font-bold text-ink">Summary</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-inksoft">Subtotal</span>
            <span className="font-semibold text-ink">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-1 text-xs text-inkfaint">
            Taxes, if applicable, are calculated at checkout.
          </p>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mt-6 inline-flex w-full items-center justify-center rounded-sm2 bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accentdeep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCheckingOut ? 'Redirecting to checkout…' : 'Checkout'}
          </button>
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <Link
            href="/products"
            className="mt-4 block text-center text-xs font-semibold uppercase tracking-wide text-inksoft hover:text-accent"
          >
            &larr; Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
