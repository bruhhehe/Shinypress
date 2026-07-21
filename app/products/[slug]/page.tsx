import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, products, formatPrice } from '@/lib/products';
import ProductActions from '@/components/ProductActions';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} — Shiny Press`,
    description: product.tagline,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <div className="container-page py-16">
      <nav className="mb-8 text-sm text-inksoft">
        <Link href="/products" className="hover:text-accent">
          Shop
        </Link>
        <span className="mx-2 text-inkfaint">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="overflow-hidden rounded-sm2 border border-line bg-white shadow-card">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={900}
              height={1165}
              priority
              className="h-auto w-full"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(1).map((img) => (
                <div
                  key={img}
                  className="overflow-hidden rounded-sm2 border border-line"
                >
                  <Image
                    src={img}
                    alt=""
                    width={200}
                    height={260}
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentdeep">
            {product.format}
          </p>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-inksoft">{product.tagline}</p>

          <div className="mt-6 font-display text-3xl font-bold text-ink">
            {formatPrice(product.price, product.currency)}
          </div>

          <div className="mt-8 border-t border-line pt-8">
            <ProductActions slug={product.slug} />
          </div>

          <div className="mt-10 border-t border-line pt-8">
            <h2 className="font-display text-xl font-bold text-ink">
              What&rsquo;s inside
            </h2>
            <ul className="mt-4 space-y-3">
              {product.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm text-ink">
                  <span className="mt-0.5 text-accent">&#10003;</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 space-y-4 border-t border-line pt-8 text-sm leading-relaxed text-inksoft">
            {product.description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
