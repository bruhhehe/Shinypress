import Image from 'next/image';
import Link from 'next/link';
import { products, formatPrice } from '@/lib/products';

const featured = products[0];

const benefits = [
  {
    title: 'Land your first clients',
    body: 'A concrete outreach system for Upwork and cold email — including exactly what to say before, during, and after the call.',
  },
  {
    title: 'Price with confidence',
    body: 'The 5x ROI rule and a clear framework for choosing between result-based, per-unit, and retainer pricing.',
  },
  {
    title: 'Deliver with Claude Code',
    body: 'Real build patterns for websites, automations, and full AI systems — the same patterns used to ship real client work.',
  },
  {
    title: 'A repeatable system',
    body: 'Turn every project into a reusable skill, so your tenth client takes a fraction of the time your first one did.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 85% 10%, rgba(180,118,58,0.32), transparent 45%), radial-gradient(circle at 8% 95%, rgba(180,118,58,0.16), transparent 40%)',
          }}
        />
        <div className="container-page relative grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:py-32">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              The Solo Builder&rsquo;s Playbook
            </p>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.2rem]">
              Build a one-person
              <br />
              AI agency that pays you.
            </h1>
            <div className="mt-6 h-[3px] w-11 bg-accent" />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/75">
              {featured.tagline}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/products/${featured.slug}`}
                className="inline-flex items-center justify-center rounded-sm2 bg-accent px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accentdeep"
              >
                Get the Playbook — {formatPrice(featured.price)}
              </Link>
              <a
                href="#whats-inside"
                className="inline-flex items-center justify-center rounded-sm2 border border-paper/25 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-paper/85 transition hover:border-paper hover:text-paper"
              >
                See what&rsquo;s inside
              </a>
            </div>
            <p className="mt-6 text-xs uppercase tracking-wide text-paper/40">
              Instant digital download &middot; Secure checkout via Stripe
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
            <div className="absolute -inset-6 -z-10 rounded-lg bg-accent/10 blur-2xl" />
            <div className="overflow-hidden rounded-sm2 shadow-2xl ring-1 ring-paper/10">
              <Image
                src={featured.images[0]}
                alt={featured.name}
                width={640}
                height={828}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="container-page py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentdeep">
            Why this book
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            Everything you need, in the order you actually need it.
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-sm2 border border-line bg-white p-6 shadow-card"
            >
              <h3 className="font-display text-lg font-bold text-ink">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-inksoft">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S INSIDE / STATS */}
      <section id="whats-inside" className="border-y border-line bg-paper2">
        <div className="container-page py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr,1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accentdeep">
                What&rsquo;s inside
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink">
                A complete, ordered playbook — not a loose collection of tips.
              </h2>
              <ul className="mt-6 space-y-3">
                {featured.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 text-sm text-ink">
                    <span className="mt-0.5 text-accent">&#10003;</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/products/${featured.slug}`}
                className="mt-8 inline-flex items-center justify-center rounded-sm2 bg-ink px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-paper transition hover:bg-accentdeep"
              >
                View full details &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                ['8', 'Parts'],
                ['25', 'Chapters'],
                ['85', 'Pages'],
                ['1', 'Instant PDF download'],
              ].map(([stat, label]) => (
                <div
                  key={label}
                  className="rounded-sm2 border border-line bg-white p-6 text-center shadow-card"
                >
                  <div className="font-display text-4xl font-extrabold text-accent">
                    {stat}
                  </div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-inksoft">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-ink text-paper">
        <div className="container-page flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="max-w-xl font-display text-3xl font-bold sm:text-4xl">
            Stop reading about it. Start building it.
          </h2>
          <p className="max-w-md text-paper/70">
            Get instant access to the full playbook and start your first
            outreach today.
          </p>
          <Link
            href={`/products/${featured.slug}`}
            className="inline-flex items-center justify-center rounded-sm2 bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-accentdeep"
          >
            Get the Playbook — {formatPrice(featured.price)}
          </Link>
        </div>
      </section>
    </div>
  );
}
