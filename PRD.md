# Btq. — Product Requirements (Frontend)

> Companion docs: [`ARCHITECTURE.md`](./ARCHITECTURE.md) (this repo) and the backend's
> [`PRD.md`](https://github.com/amedee-kbm/btq-backend/blob/main/PRD.md) /
> [`ARCHITECTURE.md`](https://github.com/amedee-kbm/btq-backend/blob/main/ARCHITECTURE.md)
> (the API contract lives there).
>
> Live: https://btq-frontend-nextjs.vercel.app · Design inspiration: [mrp.com](https://www.mrp.com)

## 1. Product overview (shared with the backend PRD)

Btq. is a single fashion boutique in Kigali, Rwanda, selling women's clothing: dresses,
matching sets ("completes"), jeans, shorts, boubous and more. Most customers arrive
organically from TikTok videos.

Until now, shoppers screenshotted items they liked, sent them to the seller on WhatsApp, and
asked for more pictures. The Btq. website replaces that back-and-forth:

- Customers **browse the whole catalog themselves**, filtering by **category** (party, casual,
  maxi dresses…), by **occasion/style tags** (wedding guest, church…), and by **hand-picked
  collections** (New Arrivals, Promos).
- Each item shows its **photos**, a **price in RWF** (with a crossed-out price on promo), its
  **material**, a **fit note**, and **which sizes and colors are available or sold out**.
- When a customer wants something, **one tap opens WhatsApp** with a message already naming
  the exact item (code + name), size and color. The sale is finished in conversation with the
  seller: payment by **MoMo or cash**, delivery by **motard** or **pickup at CHIC Building B30A**.
- Shoppers can create an account **only to save favorites**.
- The owner manages products, photos, categories, collections and contact details **in Django
  admin**, without a developer.

### Scope decisions (v1)

| In v1 | Deferred / out |
|---|---|
| Catalog browse, filter, search, sort | Cart, online payments, orders, order tracking |
| Product detail with variant availability | Password reset (until Btq. owns a domain) |
| WhatsApp handoff (pre-filled message) | Guest (logged-out) favorites |
| Favorites (login required) | Analytics / WhatsApp-tap tracking |
| Contact details from admin | Kinyarwanda / multilingual UI |
| Instant refresh after admin edits | Mobile apps (remove app-store badges) |
| | "Style me" AI, blog, notifications |
| | Automated tests and CI |

The site is **English only** and **mobile-first** (most traffic comes from TikTok on phones).

## 2. Users & key journeys

**J1 — TikTok to WhatsApp (the core flow).** A shopper sees a dress on TikTok and taps the bio
link (often a collection or product URL). They land on the product page and see photos, price,
material and fit. They pick a color (the photos switch to that color) and a size; unavailable
combinations are crossed out. They tap **"Order on WhatsApp"** and WhatsApp opens with:
*"Hi Btq! I'd like BQ-0142 – Emerald Satin Maxi, size M, colour Emerald (RWF 19,000). Is it
available? https://…/products/emerald-satin-maxi"*.

**J2 — Browse by need.** From home, the shopper taps a category tile or an occasion (e.g.
"Wedding guest"), narrows by size, color, price or "on sale", sorts by price, and opens items.
Sold-out items appear at the end with a badge.

**J3 — Find a quoted item.** The shopper types a product code (`BQ-0142`) or a word ("linen")
into search and gets results.

**J4 — Sold out.** On a sold-out product (or an unavailable size/color), the button reads
**"Ask if it's coming back"** and opens WhatsApp with the restock message.

**J5 — Favorites.** A guest taps ♥ and a sheet says *"Create an account to save favorites
across devices"* with Sign in / Register. After auth, the item is saved and they return to
where they were. `/favorites` lists saved items. The shopper stays logged in for 30 days
(sliding).

## 3. Pages & requirements

### 3.1 Global header (exists; adjust)

- Logo "Btq." → `/`.
- **Search** (exists as a dead button): opens a search input; submitting goes to
  `/shop?q=…`.
- ♥ → `/favorites` (opens the auth sheet for guests).
- Account: "Sign In / Register" or the account dropdown. The dropdown contains **Favorites**
  and **Log out** only; remove Profile, Billing and Settings.
- Desktop category bar: driven by `/categories` (top-level, in order) plus active collections
  (e.g. New Arrivals, Promos). Mobile: the ☰ menu opens a sheet with the same links (currently
  not wired).
- Keep the hide-on-scroll behavior.

### 3.2 Home `/`

1. **Category tiles:** categories with `show_on_home`, in `position` order, using `cover_image`.
   Keep the current 2- and 4-column tile look with the title over the image.
2. **One product row per active collection**, in order: title, first 8–12 products, "See all"
   → `/collections/[slug]`.
3. **"How ordering works" strip** (replaces the current value props): *Browse → Pick size &
   colour → Order on WhatsApp → Pay with MoMo or cash on delivery, or pick up at CHIC Building
   B30A.* Delivery by motard, arranged on WhatsApp.
4. Link to FAQ, then the footer.

Remove: "Ready to bag your favourites?" copy, "Safe Payment / card coming soon", "Track my
order", "How to do a return / free in-store returns", "Welcome back… Let's get shopping!" (it
shows to guests).

### 3.3 Product listing: `/shop`, `/categories/[slug]`, `/occasions/[slug]`, `/collections/[slug]`

- One shared grid: 2 columns on mobile, 3–4 on desktop, 2:3 images.
- **Product card:** image (2nd image on hover on desktop), name, price; on promo the sale price
  in bold with the original **crossed out**; color swatches; a **"Sold out"** badge; a ♥ toggle.
- **Filters** (mobile: "Filter" button → bottom sheet; desktop: sidebar): category, occasion,
  size, color (swatches), price range, on sale, in stock. **Sort:** Newest, Price low→high,
  Price high→low.
- All filter state lives in the URL query string, so any filtered view can be shared.
- Result count ("86 items"); **"Load more"** pagination (24 per page).
- Category, occasion and collection pages = the same grid with that one filter fixed, plus
  their own heading, description (collections), breadcrumb (subcategories show their parent),
  and SEO title/description.
- Empty state: "Nothing matches these filters" plus "Clear filters".

### 3.4 Product detail `/products/[slug]`

- Swipeable image gallery (mobile), thumbnails (desktop). Choosing a color shows that color's
  images first (shared images always shown).
- Name, product code, price (sale price + crossed-out original), material, fit note,
  description, tag chips → `/occasions/[slug]`.
- **Color picker** (swatches with names) and **size picker**. Combinations that are
  unavailable or don't exist are shown crossed out but stay selectable. If there's only one
  size or one color, it's preselected. `?size=&color=` in the URL preselects.
- **Primary CTA:**
  - available variant selected → **"Order on WhatsApp"** (order template);
  - unavailable variant, or the product is sold out → **"Ask if it's coming back"** (restock
    template);
  - nothing selected yet → button prompts "Select a size" / "Select a colour".
- ♥ favorite toggle; share button (Web Share API, falling back to copy link).
- "You may also like": up to 8 products from the same category (sold-out last).
- SEO: title, description, Open Graph image (first photo) so WhatsApp and TikTok link
  previews look good.

### 3.5 Favorites `/favorites` (login required)

- Grid of favorite product cards; ♥ removes. Empty state links to `/shop`.

### 3.6 Auth `/login`, `/register` (exist)

- Keep the current forms. After success, return to `?next=` (already implemented for login;
  add it to register, which currently does nothing on success).
- After auth that started from a ♥ tap, save that favorite automatically.
- No "Forgot password?" link in v1.
- Fix: sessions currently end after ~5 minutes (see ARCHITECTURE §4).

### 3.7 Static pages: `/faq`, `/contact`, `/terms`, `/privacy`

- **FAQ:** how ordering works, payment (MoMo, cash), delivery (motard, pickup), returns/exchanges
  policy (content from owner), sizing help.
- **Contact:** WhatsApp, phone, email, address from `/settings`, plus a map link.
- Terms/Privacy: short plain-language pages (owner to supply content).

### 3.8 Footer (exists; adjust)

- Contact block from `/settings` (WhatsApp, call, email hidden if blank, address).
- Columns: **Shop** (Shop all, New arrivals, Promos, Occasions), **Help** (How to order / FAQ,
  Contact), **Legal** (Terms, Privacy).
- Socials from `/settings` (hidden when blank).
- Bottom: "© Btq. · Kigali, Rwanda · Pay with MoMo · Cash".
- Remove: app-store badges, My orders, Addresses, Notifications, Blog, Return Policy (moved into
  FAQ), "same day delivery" claim (unless the owner confirms), and the "Isokko" aria-labels.
  Internal links must not open in a new tab.

## 4. Cleanup list (code that contradicts v1)

- [ ] Home value props and copy listed in §3.2.
- [ ] Footer items listed in §3.8; all links currently marked `external` (open in a new tab).
- [ ] `proxy.ts` protected routes `/account`, `/checkout`, `/profile` → `/favorites`.
- [ ] Account dropdown Profile/Billing/Settings.
- [ ] Unused: `components/ui/hero.tsx`, `app/playground`, `app/register/_page.tsx`,
      `components/ui/register-form.jsx`, and the unused Login/Register Dialog/Sheet imports in
      `nav-bar.tsx`.
- [ ] Hardcoded `new_arrivals` / tile arrays on home → data layer.
- [ ] Both axios and fetch are used; standardize on `fetch` and drop the axios dependency.
- [ ] Unused icon packages (`react-icons` once the commented-out socials are gone).

## 5. Look & feel

- Inspired by mrp.com: image-led, clean grids, compact category navigation, clear price
  hierarchy, bottom-sheet filters on mobile.
- Existing design tokens in `globals.css` (`ink`, `surface`, `card`, `bone`, `divider`,
  `brand` gold `#d4af37`, `action` green `#16a34a` for the WhatsApp CTA).
- Fonts: Bodoni Moda italic for the logo, Playfair Display for headings, Google Sans/Inter for
  UI. Consolidate to one UI sans.
- Prices formatted `RWF 19,000`.

## 6. Non-functional

- **Fast on mobile data:** catalog pages are statically cached (ISR) and never wait for the
  sleeping Render backend; images go through `next/image` with responsive `sizes`.
- **Fresh:** admin changes appear within seconds (on-demand revalidation), within 1 hour at worst.
- **Accessible:** alt text from admin, labelled icon buttons, keyboard-usable pickers and
  sheets, visible focus.
- **SEO/shareability:** per-page metadata and Open Graph images; shareable filter URLs.
- **No automated tests** in v1 (explicit decision); `pnpm lint` (Biome) and `next build` must pass.

## 7. Delivery approach

The backend is finished first (see the backend PRD). Frontend pages are built against the API
through the data layer described in ARCHITECTURE §3. If an endpoint isn't deployed yet, that
data-layer function temporarily returns fixtures shaped exactly like the API contract.
