import {
  HandbagIcon,
  RulerIcon,
  WalletIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CategoryTileContent } from "@/components/layout/category-tile";
import {
  getDictionary,
  type Locale,
  languageAlternates,
  toLocale,
} from "@/i18n";
import { Link } from "@/i18n/link";
import { getCollection, listCollections } from "@/lib/catalog/collections";
import { listCategories } from "@/lib/catalog/taxonomy";
import type { Collection } from "@/lib/catalog/types";

// The API's maximum page size; any further pages are fetched together.
const PAGE_SIZE = 48;

/** Every product in a collection, across as many pages as it takes. */
async function getWholeCollection(slug: string) {
  const first = await getCollection(slug, 1, PAGE_SIZE);
  const pages = Math.ceil(first.count / first.page_size);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, pages - 1) }, (_, i) =>
      getCollection(slug, i + 2, first.page_size),
    ),
  );
  return [first, ...rest].flatMap((page) => page.items);
}

/** Shown as a tile among the categories rather than as a product row. */
const NEW_ARRIVALS = "new-arrivals";

/** The new-arrivals collection, enough of it for a tile; none when it's empty. */
async function getNewArrivalsTile() {
  const collection = await getCollection(NEW_ARRIVALS, 1, 1).catch(() => null);
  if (!collection || collection.count === 0) return null;
  return { name: collection.name, image: "/new-arrivals.jpg" };
}

const STEP_ICONS = [HandbagIcon, RulerIcon, WhatsappLogoIcon, WalletIcon];

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { alternates: languageAlternates((await params).lang, "/") };
}

async function CollectionRow({
  collection,
  lang,
}: {
  collection: Collection;
  lang: Locale;
}) {
  // A failing row is dropped rather than taking the whole home page down.
  const items = await getWholeCollection(collection.slug).catch(() => []);
  if (items.length === 0) return null;

  return (
    <section className="w-full" aria-labelledby={`row-${collection.slug}`}>
      <div className="mx-auto flex max-w-7xl items-end justify-between gap-4 px-4 pb-4">
        <div>
          <h2
            id={`row-${collection.slug}`}
            className="font-heading text-2xl md:text-3xl"
          >
            {collection.name}
          </h2>
          {collection.description && (
            <p className="mt-1 text-sm text-ink-muted">
              {collection.description}
            </p>
          )}
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl px-4">
        <ProductGrid products={items} lang={lang} />
      </div>
    </section>
  );
}

/** Photo tiles of the categories, first thing on the page, so browsing starts with a tap. */
async function CategoryTiles({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const [all, newArrivals] = await Promise.all([
    listCategories().catch(() => []),
    getNewArrivalsTile(),
  ]);
  const featured = all.filter((c) => c.show_on_home);
  const categories = (featured.length > 0 ? featured : all).toSorted(
    (a, b) => a.position - b.position,
  );
  if (categories.length === 0 && !newArrivals) return null;
  const sizes = "(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw";

  return (
    <section
      aria-labelledby="categories-heading"
      className="mx-auto w-full max-w-7xl px-4 pt-6"
    >
      <div className="flex items-baseline justify-between gap-4 pb-4">
        <h2
          id="categories-heading"
          className="font-heading text-2xl md:text-3xl"
        >
          {t.browse.shopByCategory}
        </h2>
        <Link
          href="/shop"
          className="shrink-0 text-sm font-semibold text-action underline underline-offset-4"
        >
          {t.common.shopAll}
        </Link>
      </div>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 lg:grid-cols-6">
        {newArrivals && (
          <li>
            <Link href={`/collections/${NEW_ARRIVALS}`} className="group block">
              <CategoryTileContent
                label={newArrivals.name || t.footer.newArrivals}
                image={newArrivals.image}
                sizes={sizes}
              />
            </Link>
          </li>
        )}
        {categories.map((c) => (
          <li key={c.slug}>
            <Link href={`/categories/${c.slug}`} className="group block">
              <CategoryTileContent
                label={c.name}
                image={c.cover_image}
                sizes={sizes}
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function CollectionRows({ lang }: { lang: Locale }) {
  const collections = await listCollections().catch(() => []);
  return (
    <>
      {collections
        .filter((c) => c.slug !== NEW_ARRIVALS)
        .map((collection) => (
          <CollectionRow
            key={collection.slug}
            collection={collection}
            lang={lang}
          />
        ))}
    </>
  );
}

function HowOrderingWorks({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section
      aria-labelledby="how-heading"
      className="w-full border-y border-divider bg-card px-4 py-12"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="how-heading"
          className="text-center font-heading text-2xl md:text-3xl"
        >
          {t.home.howItWorks}
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.steps.map(({ title, text }, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li
                key={title}
                className="flex flex-col items-center gap-2 text-center"
              >
                <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
                  <Icon size={28} aria-hidden="true" />
                </span>
                <span className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                  {t.home.step(i + 1)}
                </span>
                <span className="font-bold">{title}</span>
                <span className="max-w-60 text-sm text-ink-soft">{text}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-center text-sm text-ink-muted">
          {t.home.delivery}
        </p>
      </div>
    </section>
  );
}

export default async function Home({ params }: Props) {
  const lang = toLocale((await params).lang);
  const t = getDictionary(lang);
  return (
    <div className="flex w-full flex-col items-center gap-12 pb-2">
      <h1 className="sr-only">{t.home.heading}</h1>
      <CategoryTiles lang={lang} />
      <CollectionRows lang={lang} />
      <HowOrderingWorks lang={lang} />
      <p className="text-sm">
        {t.home.moreQuestions}{" "}
        <Link href="/faq" className="font-bold underline underline-offset-4">
          {t.home.visitFaq}
        </Link>
      </p>
    </div>
  );
}
