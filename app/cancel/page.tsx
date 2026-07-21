import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout canceled — Shiny Press',
};

export default function CancelPage() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-paper2 text-2xl text-inksoft">
        &times;
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
        Checkout canceled
      </h1>
      <p className="mt-3 max-w-md text-inksoft">
        No charge was made. Your cart is still saved, so you can pick up
        right where you left off whenever you&rsquo;re ready.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-sm2 bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accentdeep"
        >
          Return to cart
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-sm2 border border-line px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-ink transition hover:border-accent hover:text-accent"
        >
          Keep browsing
        </Link>
      </div>
    </div>
  );
}
