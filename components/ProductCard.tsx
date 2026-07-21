import Image from 'next/image';
import Link from 'next/link';
import { Product, formatPrice } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm2 border border-line bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper2">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 90vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accentdeep">
          {product.format.split('·')[0].trim()}
        </p>
        <h3 className="font-display text-lg font-bold leading-snug text-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-inksoft">
          {product.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-ink">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-sm font-semibold text-accent transition group-hover:underline">
            View details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
