import type { Metadata } from 'next';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Shop — Shiny Press',
};

export default function ProductsPage() {
  return (
    <div className="container-page py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentdeep">
          Shop
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">
          Playbooks &amp; guides
        </h1>
        <p className="mt-3 text-inksoft">
          Every title is an instant digital download. More guides are on the
          way — this page will grow as new ones ship.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
