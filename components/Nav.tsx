'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/products';

export default function Nav() {
  const { count, subtotal, isHydrated } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink text-paper">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-paper"
        >
          Shiny<span className="text-accent">.</span>Press
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/"
            className="text-sm text-paper/80 transition hover:text-paper"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm text-paper/80 transition hover:text-paper"
          >
            Shop
          </Link>
        </nav>

        <Link
          href="/cart"
          aria-label={`Cart, ${isHydrated ? count : 0} item${
            isHydrated && count === 1 ? '' : 's'
          }`}
          className="group flex items-center gap-2 rounded-sm2 border border-paper/20 px-3 py-2 text-sm transition hover:border-accent hover:text-accent"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h3.6l2.7 13.4a2 2 0 0 0 2 1.6h9.4a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <span className="tabular-nums">
            {isHydrated ? count : 0}
          </span>
          <span className="hidden tabular-nums text-paper/60 sm:inline">
            {isHydrated ? formatPrice(subtotal) : formatPrice(0)}
          </span>
        </Link>
      </div>
    </header>
  );
}
