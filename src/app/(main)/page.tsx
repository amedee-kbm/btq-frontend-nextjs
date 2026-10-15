import {
  HandbagIcon,
  RulerIcon,
  WalletIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { ProductGrid } from "@/components/catalog/product-grid";
import { getCollection, listCollections } from "@/lib/catalog/collections";
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

async function CollectionRow({ collection }: { collection: Collection }) {
  const items = await getWholeCollection(collection.slug);
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
        <ProductGrid products={items} />
      </div>
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
