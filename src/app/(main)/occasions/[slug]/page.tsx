import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductListing,
  type SearchParams,
} from "@/components/catalog/product-listing";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { listTags } from "@/lib/catalog/taxonomy";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

async function loadTag(slug: string) {
  const tag = (await listTags()).find((t) => t.slug === slug);
  if (!tag) notFound();
  return tag;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await loadTag((await params).slug);
  return {
    title: `${tag.name} outfits`,
    description: `${tag.name} looks at Btq., Kigali: dresses and sets for the occasion. Order on WhatsApp.`,
  };
}

export default async function OccasionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const tag = await loadTag(slug);

  return (
    <PageContainer>
      <PageHeader
        title={tag.name}
        breadcrumb={[{ label: "Shop", href: "/shop" }, { label: tag.name }]}
      />
      <ProductListing
        searchParams={await searchParams}
        fixed={{ tag: [slug] }}
      />
    </PageContainer>
  );
}
