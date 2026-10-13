import {
  HandbagIcon,
  RulerIcon,
  WalletIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { getCollection, listCollections } from "@/lib/catalog/collections";
import { listProducts } from "@/lib/catalog/products";
import { listCategories } from "@/lib/catalog/taxonomy";
import type { Category, Collection } from "@/lib/catalog/types";

const ROW_SIZE = 12;

const STEPS = [
  { Icon: HandbagIcon, title: "Browse", text: "Find a look you love." },
  {
    Icon: RulerIcon,
    title: "Pick size & colour",
    text: "See what's available right away.",
  },
  {
    Icon: WhatsappLogoIcon,
    title: "Order on WhatsApp",
    text: "One tap sends us the exact item.",
  },
  {
    Icon: WalletIcon,
    title: "Pay & receive",
    text: "MoMo or cash on delivery, or pick up at CHIC Building B30A.",
  },
];

/** A tile's image: the category cover, else its first product's photo. */
async function tileImage(category: Category) {
  if (category.cover_image) return category.cover_image;
  const { items } = await listProducts({
    category: category.slug,
    page_size: 1,
  });
  return items[0]?.images[0]?.url ?? null;
}

/** A single home category: portrait photo + call to action (product photos are portrait, so no wide crop). */
function CategoryBanner({
  category,
  image,
}: {
  category: Category;
  image: string | null;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group grid w-full bg-brand-soft md:grid-cols-2"
    >
      <div className="relative aspect-4/5 w-full overflow-hidden bg-bone md:aspect-auto md:h-[min(70vh,640px)]">
        {image && (
          <Image
            src={image}
            fill
            alt=""
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-black/15 md:hidden" />
        <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl font-extrabold text-white drop-shadow md:hidden">
          {category.name}
        </h2>
      </div>
      <div className="hidden flex-col items-start justify-center gap-4 px-12 md:flex lg:px-20">
        <p className="text-xs font-bold tracking-wider text-brand uppercase">
          {category.product_count} styles
        </p>
        <h2 className="font-heading text-5xl text-ink">{category.name}</h2>
        <span className="inline-flex h-11 items-center gap-1 bg-ink px-6 text-sm font-bold text-surface transition-colors group-hover:bg-brand">
          Shop {category.name.toLowerCase()}
          <ChevronRight size={16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

async function CategoryTiles() {
  const categories = (await listCategories())
    .filter((c) => c.show_on_home)
    .sort((a, b) => a.position - b.position);
  if (categories.length === 0) return null;
  const images = await Promise.all(categories.map(tileImage));

  // The owner picks how many categories show on home, so the layout adapts:
  // one becomes a banner, two or three fill the row, four+ tile.
  const count = categories.length;
  if (count === 1) {
    return <CategoryBanner category={categories[0]} image={images[0]} />;
  }
  const layout =
    count === 2
      ? {
          grid: "grid-cols-2",
          tile: "aspect-479/565 lg:aspect-4/3",
          sizes: "50vw",
          item: () => "",
        }
      : count === 3
        ? {
            grid: "grid-cols-2 lg:grid-cols-3",
            tile: "aspect-479/565",
            sizes: "(min-width: 1024px) 33vw, 50vw",
            // Mobile: first tile full width, then two side by side.
            item: (i: number) => (i === 0 ? "col-span-2 lg:col-span-1" : ""),
          }
        : {
            grid: "grid-cols-2 lg:grid-cols-4",
            tile: "aspect-479/565",
            sizes: "(min-width: 1024px) 25vw, 50vw",
            // An odd last tile spans the row on mobile instead of leaving a gap.
            item: (i: number) =>
              count % 2 === 1 && i === count - 1
                ? "col-span-2 lg:col-span-1"
                : "",
          };

  return (
    <ul className={`grid w-full ${layout.grid}`}>
      {categories.map((category, i) => (
        <li key={category.slug} className={`overflow-hidden ${layout.item(i)}`}>
          <Link
            className="group relative block"
            href={`/categories/${category.slug}`}
          >
            <div
              className={`relative w-full overflow-hidden bg-bone ${layout.tile}`}
            >
              {images[i] && (
                <Image
                  src={images[i]}
                  fill
                  alt=""
                  priority={i < 4}
                  sizes={layout.sizes}
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/25" />
            </div>
            <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-xl font-extrabold text-white drop-shadow md:text-2xl">
              {category.name}
            </h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function CollectionRow({ collection }: { collection: Collection }) {
  const { items, count } = await getCollection(collection.slug, 1, ROW_SIZE);
  if (items.length === 0) return null;
  const href = `/collections/${collection.slug}`;

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
        <Link
          href={href}
          className="flex shrink-0 items-center gap-0.5 text-sm font-bold underline-offset-4 hover:underline"
        >
          See all{count > items.length && ` ${count}`}
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="mx-auto flex max-w-7xl snap-x snap-mandatory gap-0.5 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:thin]">
        {items.map((product) => (
          <li
            key={product.slug}
            className="w-[44vw] shrink-0 snap-start md:w-[30vw] lg:w-[calc((min(100vw,80rem)-2rem)/5)]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

async function CollectionRows() {
  const collections = await listCollections();
  return (
    <>
      {collections.map((collection) => (
        <CollectionRow key={collection.slug} collection={collection} />
      ))}
    </>
  );
}

function HowOrderingWorks() {
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
          How ordering works
        </h2>
        <ol className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li
              key={title}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="grid size-14 place-items-center rounded-full bg-brand-soft text-brand">
                <Icon size={28} aria-hidden="true" />
              </span>
              <span className="text-xs font-bold tracking-wider text-ink-muted uppercase">
                Step {i + 1}
              </span>
              <span className="font-bold">{title}</span>
              <span className="max-w-60 text-sm text-ink-soft">{text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center text-sm text-ink-muted">
          Delivery by motard across Kigali, arranged with you on WhatsApp.
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center gap-12 pb-2">
      <h1 className="sr-only">Btq. — women's fashion boutique in Kigali</h1>
      <CategoryTiles />
      <CollectionRows />
      <HowOrderingWorks />
      <p className="text-sm">
        Got more questions?{" "}
        <Link href="/faq" className="font-bold underline underline-offset-4">
          Visit our FAQ
        </Link>
      </p>
    </div>
  );
}
