# Btq. — Frontend Architecture

> Product requirements: [`PRD.md`](./PRD.md). **API contract:**
> [`btq-backend/ARCHITECTURE.md` §4](https://github.com/amedee-kbm/btq-backend/blob/main/ARCHITECTURE.md#4-http-api-contract).
> It is not duplicated here, and `src/lib/catalog/types.ts` mirrors it.

Legend: ✅ exists today · 🔧 exists, needs change · 🆕 to build

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 16** (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css`), shadcn components on **Base UI** |
| Client data | **SWR** (user + favorites only) |
| Forms | react-hook-form + zod |
| Motion | `motion` (header hide-on-scroll) |
| Icons | lucide-react, @phosphor-icons/react (drop `react-icons` once unused) |
| Toasts | sonner |
| Lint/format | **Biome** (`pnpm lint`, `pnpm format`) |
| Package manager | pnpm |
| Hosting | **Vercel Hobby**: https://btq-frontend-nextjs.vercel.app |
| Backend | Django Ninja API on Render (Frankfurt), env `DJANGO_BASE_URL` |
| Tests | **None in v1** (explicit decision) |

New code is TypeScript. Convert existing `.jsx` files (`lib/auth.jsx`, `config/defaults.jsx`,
`components/layout/*.jsx`) when they're touched.

## 2. System overview

```
 Browser ──► Vercel (Next.js)
   │           ├─ Server Components ── catalog reads ──► Django /api (public)   [cached: ISR, tags]
   │           ├─ Route handlers (BFF) ── auth + favorites ─► Django /api (JWT)  [no cache]
   │           └─ /api/revalidate ◄── webhook from Django admin saves
   └─ wa.me deep link ──► WhatsApp (the sale happens here)
```

- **The browser never calls Django directly.** Catalog data is fetched server-side and cached.
  Auth and favorites go through Next route handlers that keep JWTs in httpOnly cookies.
- The Render backend sleeps when idle. Caching keeps shoppers from noticing; only uncached
  reads (a never-seen filter combination, auth, favorites) can hit a cold start, and those show
  loading states.

## 3. Data layer `src/lib/catalog/` 🆕

The **only** place that knows about the catalog API. Pages and components call these functions
and never `fetch` the API directly.

```
src/lib/catalog/
  types.ts        ProductListItem, ProductDetail, Category, Tag, Collection, SiteSettings,
                  Paginated<T>, ProductFilters   (mirror backend §4)
  client.ts       apiGet<T>(path, params): server-only fetch with cache options
  products.ts     listProducts(filters), getProduct(slug)
  taxonomy.ts     listCategories(), listTags(), listSizes(), listColors()
  collections.ts  listCollections(), getCollection(slug, page)
  settings.ts     getSiteSettings()
  filters.ts      parse/serialize ProductFilters <-> URLSearchParams (shared by pages & UI)
  fixtures/       temporary data shaped exactly like the API (only while an endpoint is missing)
```

`client.ts`:

```ts
import "server-only";
export async function apiGet<T>(path: string, params?: URLSearchParams, tags = ["catalog"]) {
  const res = await fetch(`${DJANGO_API_ENDPOINT}${path}?${params ?? ""}`, {
    next: { tags, revalidate: 3600 },          // on-demand + 1 h safety net
  });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
```

- Settings use the tag `settings`; everything else uses `catalog` (matching the backend
  webhook's tags).
- **Fixtures rule:** when an endpoint isn't deployed yet, that one function returns fixtures
  from `fixtures/` (built from the photos in `public/dresses`, `public/completes`,
  `public/hero`). When the endpoint lands, the function body switches to `apiGet`. There's no
  global flag, and one function never mixes sources.

## 4. Auth (BFF) 🔧

### Current state and the bug

- `/api/login` stores `access` → cookie `auth-token`, `refresh` → `auth-refresh-token`, both
  `maxAge` 1 h, `sameSite: strict`.
- The backend's access token lives **5 min** and the refresh token is **never used**, so users
  silently drop to logged-out after ~5 min.
- `proxy.ts` calls Django `/me` on every `/login`, `/register` and protected-route request. That
  adds a cold-start-prone round trip to navigation.

### Target

- Backend: access 15 min, refresh **30 days**, rotation on (backend ARCHITECTURE §5).
- Cookies (`src/lib/auth.ts`):

  | Cookie | Value | maxAge | Flags |
  |---|---|---|---|
  | `auth-token` | access JWT | 15 min | httpOnly, secure (prod), **`sameSite: lax`**, path `/` |
  | `auth-refresh-token` | refresh JWT | 30 days | same |

  Use `lax`, not `strict`: shoppers arrive via cross-site links (TikTok, WhatsApp), and with
  `strict` the cookies aren't sent on that first navigation, so they'd look logged out.
- **`djangoAuthed(path, init)`** in `src/lib/django-authed.ts` (replaces `api-proxy.ts`), used by
  every authed route handler:
  1. If there's no access cookie but a refresh cookie exists, refresh first.
  2. Call Django with `Authorization: Bearer <access>`.
  3. On `401`, if a refresh cookie exists, `POST /auth/refresh {refresh}`, set **both** new
     cookies (rotation), and retry **once**.
  4. If the refresh fails, delete both cookies and return `401`.
- **`proxy.ts`:** protected routes = `["/favorites"]`. Only check that **`auth-refresh-token`
  exists** (no Django call); otherwise redirect to `/login?next=…`. `/login` and `/register`
  redirect to `/` when the refresh cookie exists. Real validity is enforced by the BFF.
- Logout (`/api/logout`) deletes both cookies (exists).
- `useUser()` (SWR on `/api/me`) stays as is. `/api/me` switches to `djangoAuthed`.

### Route handlers

| Route | Methods | Notes |
|---|---|---|
| `/api/login` | POST | ✅ (update cookie options) |
| `/api/register` | POST | ✅. Then auto-login: call `/auth/pair` and set cookies (🆕) |
| `/api/logout` | POST | ✅ |
| `/api/me` | GET | 🔧 use `djangoAuthed` |
| `/api/favorites` | GET | 🆕 → Django `GET /me/favorites` |
| `/api/favorites/[slug]` | PUT, DELETE | 🆕 → Django `PUT/DELETE /me/favorites/{slug}` |
| `/api/products` | GET | 🆕 thin pass-through to `listProducts()` for client-side "Load more" (cached like any catalog read) |
| `/api/revalidate` | POST | 🆕 see §5 |

### Favorites on the client

- `useFavorites()` hook: SWR on `/api/favorites` (only when authenticated) and exposes
  `isFavorite(slug)` and `toggle(slug)` with an **optimistic** update and rollback with a toast
  on error.
- ♥ tap as a guest → auth sheet. The pending slug is kept in `sessionStorage` and in
  `?next=…&fav=<slug>`; after login or register, the slug is saved, then the user is
  redirected back.

## 5. Caching & revalidation 🆕

- Catalog fetches are cached in Next's data cache with tags (`catalog`, `settings`) and
  `revalidate: 3600`.
- Product, category, occasion and collection pages render on the server. Static params are
  generated on demand (`generateStaticParams` returns `[]`, `dynamicParams` true), so the first
  visit renders and caches.
- `/shop` reads `searchParams` (dynamic render), but its API calls still hit the data cache, keyed
  by URL.
- **`POST /api/revalidate`:**

  ```ts
  // Authorization: Bearer ${REVALIDATE_SECRET}; body { tags: string[] }
  for (const tag of tags.filter((t) => ["catalog", "settings"].includes(t)))
    revalidateTag(tag, { expire: 0 });  // expire immediately, not stale-while-revalidate
  return Response.json({ revalidated: tags });
  ```

  Next 16's `revalidateTag` takes a second argument. `{ expire: 0 }` makes the next request
  fetch fresh data, which is what we want right after the owner publishes a TikTok drop.
  Unknown tags are ignored; a wrong secret returns `401`.

## 6. Routes & rendering

```
src/app/
  layout.tsx                 root: fonts, <NavBar>, <Toaster>                     🔧
  nav-bar.tsx                client; receives categories/collections as props     🔧
  (main)/layout.tsx          fetches settings → <Footer settings>                 🔧
  (main)/page.tsx            Home: tiles + collection rows + how-to-order (server) 🔧
  (main)/shop/page.tsx                                                            🆕
  (main)/categories/[slug]/page.tsx                                               🆕
  (main)/occasions/[slug]/page.tsx                                                🆕
  (main)/collections/[slug]/page.tsx                                              🆕
  (main)/products/[slug]/page.tsx    + generateMetadata (OG image)                🆕
  (main)/favorites/page.tsx          client grid via useFavorites                 🆕
  (main)/faq|contact|terms|privacy/page.tsx                                       🆕
  login/page.tsx, register/page.tsx                                               ✅/🔧
  api/…                              see §4
```

- Each listing route has a `loading.tsx` skeleton grid; product pages have `not-found.tsx`.
- Listing pages share one `<ProductListing fixed={{ category: slug }} searchParams>` server
  component. It parses filters, calls `listProducts`, and renders filters, sort, the grid and
  "Load more".
- The home page's top-level layout calls `listCategories()` and `listCollections()` once and
  passes them to the nav bar (the category bar and mobile menu are no longer hardcoded).
- Delete: `app/playground`, `app/register/_page.tsx`.

## 7. Components

```
src/components/
  ui/            shadcn primitives (✅). Delete hero.tsx, login-form.jsx, register-form.jsx
  layout/        account-dropdown 🔧, login-or-register ✅, auth-sheet 🆕 (♥ prompt),
                 mobile-menu 🆕, search 🆕
  catalog/       product-card, product-grid, price, swatches, filter-panel (sheet/sidebar),
                 sort-select, load-more, empty-state                               🆕
  product/       gallery, variant-picker, whatsapp-button, favorite-button,
                 share-button, related-products                                    🆕
```

- **`<Price>`** shows the effective price bold, plus the original struck through when on sale.
  It uses `formatRWF(n)` → `RWF 19,000`.
- **`<VariantPicker>`** works from `variants[]`. Selection is reflected in `?size=&color=`
  (`router.replace`, no scroll), and picking a color reorders the gallery to that color's
  images.
- Filter UI state = the URL. Changing a filter does a `router.push` with the new query, which
  re-renders on the server.

## 8. WhatsApp handoff `src/lib/whatsapp.ts` 🆕

```ts
buildWhatsAppUrl(settings, product, { size, color }, kind: "order" | "restock"): string
```

- Picks `settings.whatsapp_template` or `whatsapp_restock_template`.
- Fills `{code} {name} {size} {color} {price}` (formatted RWF) and `{url}`
  (`${NEXT_PUBLIC_SITE_URL}/products/${slug}?size=…&color=…`).
- Returns `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`.
- The `kind` decision lives in `<WhatsAppButton>`: `"order"` if the selected variant exists and
  is available, else `"restock"`.
- It's a plain `<a href target="_blank" rel="noopener">`: no JS click handler and no tracking.

## 9. Images

- Product, category and cover images come from R2 as absolute URLs and are rendered with
  `next/image` using accurate `sizes` (grid: `(min-width:1024px) 25vw, 50vw`).
- `next.config.ts`: `images.remotePatterns` for `https://${R2_PUBLIC_DOMAIN}/**` (and
  `localhost:8000/media/**` in dev).
- Uploads are pre-processed by the owner (backend PRD §3.4); Vercel's optimizer handles
  responsive sizes. The Hobby plan's optimization quota is plenty at this scale. If it's ever
  exceeded, set `unoptimized` for R2 images.
- Local `public/` photos are used only by fixtures and static marketing tiles.

## 10. Configuration

| Env var | Where | Purpose |
|---|---|---|
| `DJANGO_BASE_URL` | server | ✅ API base (`…/api` appended in `config/defaults`) |
| `REVALIDATE_SECRET` | server | 🆕 shared with the backend |
| `NEXT_PUBLIC_SITE_URL` | both | 🆕 absolute links in WhatsApp messages and OG tags |
| `R2_PUBLIC_DOMAIN` | build | 🆕 `next/image` remote pattern |

## 11. Build order

1. **Auth fix:** `lib/auth.ts` cookie options, `djangoAuthed` with refresh, slim `proxy.ts`
   (protect `/favorites`). This depends on the backend JWT settings.
2. **Data layer:** `types.ts`, `client.ts`, functions; fixtures only for endpoints not yet live.
3. **Revalidation:** `/api/revalidate` + env vars.
4. **Layout:** nav bar from data, mobile menu, search, footer from `/settings`, cleanup list
   (PRD §4).
5. Home.
6. Listing: `ProductListing`, filters, sort, load more, then `/shop`, `/categories`,
   `/occasions`, `/collections`.
7. Product detail, variant picker, WhatsApp button, metadata/OG.
8. Favorites: BFF routes, `useFavorites`, auth sheet, `/favorites`.
9. Static pages (FAQ, contact, terms, privacy).
