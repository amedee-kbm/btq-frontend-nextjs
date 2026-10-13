import type { Metadata } from "next";
import {
  ProductListing,
  type SearchParams,
} from "@/components/catalog/product-listing";
import { PageContainer, PageHeader } from "@/components/layout/page-header";

type Props = { searchParams: Promise<SearchParams> };

function searchTerm(params: SearchParams) {
  const q = params.q;
  return (Array.isArray(q) ? q[0] : q)?.trim() || undefined;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const q = searchTerm(await searchParams);
  return q
    ? { title: `Search: ${q}`, robots: { index: false } }
    : {
        title: "Shop all",
        description:
          "Browse every dress, matching set, jeans and more at Btq., Kigali. Order on WhatsApp.",
      };
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = searchTerm(params);

  return (
    <PageContainer>
      <PageHeader
        title={q ? `Results for “${q}”` : "Shop all"}
        breadcrumb={[{ label: q ? "Search" : "Shop" }]}
      />
      <ProductListing searchParams={params} />
    </PageContainer>
  );
}
