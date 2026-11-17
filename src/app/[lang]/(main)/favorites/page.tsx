import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { getDictionary } from "@/i18n";
import { FavoritesGrid } from "./favorites-grid";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary((await params).lang);
  return { title: t.common.favorites, robots: { index: false } };
}

export default async function FavoritesPage({ params }: Props) {
  const t = getDictionary((await params).lang);
  return (
    <PageContainer>
      <PageHeader
        title={t.common.favorites}
        breadcrumb={[{ label: t.common.favorites }]}
      />
      <FavoritesGrid />
    </PageContainer>
  );
}
