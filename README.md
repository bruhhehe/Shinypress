# Shiny Press — One-Person AI Agency Shop

A small, three-page e-commerce site for selling "The One-Person AI Agency"
(and any future titles) as a digital download, built with Next.js (App
Router) and Stripe Checkout.

## What's here

```
app/
  page.tsx                 Landing page (hero, benefits, what's inside, CTA)
  products/page.tsx         Product grid (loops over lib/products.ts)
  products/[slug]/page.tsx  Product detail page (gallery, price, qty, Add to
                             Cart / Buy Now)
  cart/page.tsx             Cart page (qty edit, remove, checkout)
  success/page.tsx          Post-payment confirmation (verifies the Stripe
                             session server-side)
  cancel/page.tsx           Shown if checkout is abandoned
  api/checkout/route.ts     Creates a Stripe Checkout Session (server-only)
  api/webhook/route.ts      Verifies Stripe webhook signatures, logs
                             checkout.session.completed events
components/
  CartProvider.tsx          Cart state + localStorage persistence (client)
  Nav.tsx                   Nav bar with live cart count/subtotal
  ProductCard.tsx           Card used on the grid page
  ProductActions.tsx        Quantity selector + Add to Cart / Buy Now
  ClearCartOnSuccess.tsx    Empties the cart once payment succeeds
lib/
  products.ts               Product catalog — add more products here
  stripe.ts                 Server-only Stripe client
```

## 1. Install dependencies

```bash
npm install
```

## 2. Add your Stripe keys

Copy the example env file and fill in your own keys:

```bash
cp .env.local.example .env.local
```

Then open **`.env.local`** and replace the placeholders:

| Variable | Where it's used | Where to get it |
|---|---|---|
| `STRIPE_SECRET_KEY` | `lib/stripe.ts` (server-only) | [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | not used by the current flow yet, reserved for later | same page as above |
| `STRIPE_WEBHOOK_SECRET` | `app/api/webhook/route.ts` | created in step 4 below |
| `NEXT_PUBLIC_SITE_URL` | `lib/stripe.ts` → success/cancel URLs | `http://localhost:3000` locally |

**Start with your test-mode keys** (`sk_test_...` / `pk_test_...`). Nothing
in the frontend ever touches `STRIPE_SECRET_KEY` — it's only read inside the
two API routes and the success page, all of which run on the server.

## 3. Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 4. Test the full payment flow (test mode)

1. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and log in:
   `stripe login`
2. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   This prints a `whsec_...` value — put that in `.env.local` as
   `STRIPE_WEBHOOK_SECRET` and restart `npm run dev`.
3. Go to a product page, click **Buy Now** (or add to cart and checkout).
4. On Stripe's hosted checkout page, use a test card:
   - `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
5. You should land on `/success`, and your terminal running `stripe listen`
   (and your `npm run dev` logs) should show the `checkout.session.completed`
   event being received and verified.
6. To see the cancel flow, start checkout and click the back arrow on
   Stripe's page instead of paying — you'll land on `/cancel`.

## 5. Going live

When you're ready to accept real payments:

1. Swap `sk_test_...` → `sk_live_...` in `STRIPE_SECRET_KEY`.
2. Create a **live-mode** webhook endpoint in the Stripe Dashboard pointing
   at `https://yourdomain.com/api/webhook`, subscribed at minimum to
   `checkout.session.completed`. Put its signing secret in
   `STRIPE_WEBHOOK_SECRET`.
3. Update `NEXT_PUBLIC_SITE_URL` to your real domain.
4. Set all of the above as environment variables in your hosting
   provider's dashboard (e.g. Vercel → Project → Settings →
   Environment Variables) rather than committing `.env.local`.

## Deploying

This is a real Next.js app with server-side API routes (`/api/checkout`,
`/api/webhook`) — it is **not** a static site, so it can't just be dragged
into a host as a folder of files. It needs to go through `next build` on
the hosting platform, which turns those routes into serverless functions.

### Option A — Netlify (connected to Git)

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. In Netlify: **Add new site → Import an existing project**, and pick
   the repo. Netlify will detect `netlify.toml` (already included in this
   project) and use it automatically:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```
3. Before the first deploy, add your environment variables in
   **Site settings → Environment variables**: `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and
   `NEXT_PUBLIC_SITE_URL` (set this to the `https://yoursite.netlify.app`
   URL Netlify gives you — update it again if you later add a custom
   domain).
4. Deploy. `/api/checkout` and `/api/webhook` will run as Netlify
   Functions automatically via the Next.js plugin.
5. In the Stripe Dashboard, create a webhook endpoint pointing at
   `https://yoursite.netlify.app/api/webhook` and put its signing secret
   into `STRIPE_WEBHOOK_SECRET`.

### Option B — Netlify CLI (no Git repo needed)

```bash
npm install -g netlify-cli
netlify login
netlify init      # links/creates a site, detects netlify.toml
netlify deploy --prod
```
This actually runs the build (unlike drag-and-drop) and sets up the API
routes as functions. Set the same environment variables via
`netlify env:set STRIPE_SECRET_KEY sk_test_...` (repeat for the others)
before running `--prod`.

### Option C — Vercel (made by the Next.js team, zero config)

If you don't need Netlify specifically, Vercel requires no plugin or
`netlify.toml` at all:
```bash
npm install -g vercel
vercel
```
Add the same four environment variables in the Vercel dashboard
(**Project → Settings → Environment Variables**) before your first
production deploy.

## Adding more products


Add another entry to the `products` array in `lib/products.ts` — the grid,
detail page, cart, and checkout all already loop over that list, so a new
product needs no other code changes. Drop its image in `public/images/`.

## Notes on how the pieces fit together

- **Cart persistence**: `CartProvider` keeps cart contents in React state and
  mirrors them to `localStorage` (`components/CartProvider.tsx`), so the
  cart survives page navigation and browser refreshes, and stays in sync
  across tabs.
- **Add to Cart** adds the item to that shared cart state; the **Cart**
  page later calls `/api/checkout` with the full cart contents.
- **Buy Now** skips the cart entirely and calls `/api/checkout` directly
  with just that one item and quantity.
- **Prices are never trusted from the browser.** Both entry points send
  only a product `slug` and `quantity`; `app/api/checkout/route.ts` looks
  up the real price server-side from `lib/products.ts` before creating the
  Stripe session.
- **Design system** matches the ebook: the same self-hosted Playfair
  Display / Inter fonts (in `public/fonts/`) and the same ink / paper /
  accent color tokens (defined in `tailwind.config.js`).
