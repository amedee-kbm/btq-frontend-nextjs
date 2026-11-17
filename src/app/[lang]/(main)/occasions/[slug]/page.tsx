import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ProductListing,
  type SearchParams,
} from "@/components/catalog/product-listing";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getDictionary, languageAlternates, toLocale } from "@/i18n";
import { listTags } from "@/lib/catalog/taxonomy";

type Props = {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<SearchParams>;
};

async function loadTag(slug: string) {
  const tag = (await listTags()).find((t) => t.slug === slug);
  if (!tag) notFound();
  return tag;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const t = getDictionary(lang);
  const tag = await loadTag(slug);
  return {
    title: t.occasions.pageTitle(tag.name),
    description: t.occasions.pageDescription(tag.name),
    alternates: languageAlternates(lang, `/occasions/${slug}`),
  };
}

export default async function OccasionPage({ params, searchParams }: Props) {
  const { lang: param, slug } = await params;
  const lang = toLocale(param);
  const t = getDictionary(lang);
  const tag = await loadTag(slug);

  return (
    <PageContainer>
      <PageHeader
        title={tag.name}
        breadcrumb={[
          { label: t.common.shop, href: "/shop" },
          { label: tag.name },
        ]}
      />
      <ProductListing
        lang={lang}
        searchParams={await searchParams}
        fixed={{ tag: [slug] }}
      />
    </PageContainer>
  );
}
