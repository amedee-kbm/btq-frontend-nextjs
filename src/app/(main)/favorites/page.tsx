import type { Metadata } from "next";
import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { FavoritesGrid } from "./favorites-grid";

export const metadata: Metadata = {
  title: "Favorites",
  robots: { index: false },
};

export default function FavoritesPage() {
  return (
    <PageContainer>
      <PageHeader title="Favorites" breadcrumb={[{ label: "Favorites" }]} />
      <FavoritesGrid />
    </PageContainer>
  );
}
