import type { Metadata } from "next";
import { LoadMore } from "@/components/catalog/load-more";
import { ProductGrid } from "@/components/catalog/product-grid";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getCollection } from "@/lib/catalog/collections";

// Rendered on first visit, then cached until the catalog is revalidated.
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollection((await params).slug);
  const image = collection.items[0]?.images[0]?.url;
  return {
    title: collection.name,
    description:
      collection.description || `${collection.name} at Btq., Kigali.`,
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  return (
    <PageContainer>
      <PageHeader
        title={collection.name}
        description={collection.description}
        breadcrumb={[
          { label: "Shop", href: "/shop" },
          { label: collection.name },
        ]}
      />
      <p className="pb-4 text-sm text-ink-muted">
        {collection.count} {collection.count === 1 ? "item" : "items"}
      </p>
      {collection.items.length === 0 ? (
        <p className="py-20 text-center text-ink-muted">
          Nothing here yet — check back soon.
        </p>
      ) : (
        <>
          <ProductGrid products={collection.items} priorityCount={4} />
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
