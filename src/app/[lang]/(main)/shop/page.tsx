import type { Metadata } from "next";
import {
  ProductListing,
  type SearchParams,
} from "@/components/catalog/product-listing";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getDictionary, languageAlternates, toLocale } from "@/i18n";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
};

function searchTerm(params: SearchParams) {
  const q = params.q;
  return (Array.isArray(q) ? q[0] : q)?.trim() || undefined;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  const q = searchTerm(await searchParams);
  return q
    ? { title: t.shop.searchTitle(q), robots: { index: false } }
    : {
        title: t.common.shopAll,
        description: t.shop.description,
        alternates: languageAlternates(lang, "/shop"),
      };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const lang = toLocale((await params).lang);
  const t = getDictionary(lang);
  const query = await searchParams;
  const q = searchTerm(query);

  return (
    <PageContainer>
      <PageHeader
        title={q ? t.shop.resultsFor(q) : t.common.shopAll}
        breadcrumb={[{ label: q ? t.shop.search : t.common.shop }]}
      />
      <ProductListing lang={lang} searchParams={query} />
    </PageContainer>
  );
}
