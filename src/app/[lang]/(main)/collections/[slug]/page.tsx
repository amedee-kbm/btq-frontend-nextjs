import type { Metadata } from "next";
import { LoadMore } from "@/components/catalog/load-more";
import { ProductGrid } from "@/components/catalog/product-grid";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getDictionary, languageAlternates, toLocale } from "@/i18n";
import { getCollection } from "@/lib/catalog/collections";

// Rendered on first visit, then cached until the catalog is revalidated.
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getDictionary(lang);
  const collection = await getCollection(slug);
  const image = collection.items[0]?.images[0]?.url;
  return {
    title: collection.name,
    description:
      collection.description || t.collection.description(collection.name),
    alternates: languageAlternates(lang, `/collections/${slug}`),
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { lang: param, slug } = await params;
  const lang = toLocale(param);
  const t = getDictionary(lang);
  const collection = await getCollection(slug);

  return (
    <PageContainer>
      <PageHeader
        title={collection.name}
        description={collection.description}
        breadcrumb={[
          { label: t.common.shop, href: "/shop" },
          { label: collection.name },
        ]}
      />
      <p className="pb-4 text-sm text-ink-muted">
        {t.common.items(collection.count)}
      </p>
      {collection.items.length === 0 ? (
        <p className="py-20 text-center text-ink-muted">{t.collection.empty}</p>
      ) : (
        <>
          <ProductGrid
            products={collection.items}
            lang={lang}
            priorityCount={4}
          />
          <LoadMore
            query={new URLSearchParams({ collection: slug }).toString()}
            shown={collection.items.length}
            total={collection.count}
          />
        </>
      )}
    </PageContainer>
  );
}
