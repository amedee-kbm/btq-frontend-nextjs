"use client";

import Link from "next/link";
import {
  ProductGrid,
  ProductGridSkeleton,
} from "@/components/catalog/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";

export function FavoritesGrid() {
  const { favorites, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <>
        <ProductGridSkeleton count={4} />
        <output className="sr-only">Loading favorites…</output>
      </>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
        <p className="font-heading text-2xl">No favorites yet</p>
        <p className="text-sm text-ink-muted">
          Tap ♥ on anything you like and it will be saved here.
        </p>
        <Link href="/shop" className={buttonVariants({ size: "lg" })}>
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="pb-4 text-sm text-ink-muted">
        {favorites.length} {favorites.length === 1 ? "item" : "items"}
      </p>
      <ProductGrid products={favorites} />
    </>
  );
}
