"use client";

import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/catalog/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";

export function FavoritesGrid() {
  const { favorites, isLoading } = useFavorites();
  const { lang, t } = useI18n();

  if (isLoading) {
    return (
      <>
        <ProductGridSkeleton count={4} />
        <output className="sr-only">{t.favorites.loading}</output>
      </>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="font-heading text-2xl">{t.favorites.emptyTitle}</p>
        <p className="text-sm text-ink-muted">{t.favorites.emptyText}</p>
        <Link href="/shop" className={buttonVariants({ size: "lg" })}>
          {t.favorites.startShopping}
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="pb-4 text-sm text-ink-muted">
        {t.common.items(favorites.length)}
      </p>
      <ProductGrid products={favorites} lang={lang} />
    </>
  );
}
