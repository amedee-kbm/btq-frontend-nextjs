"use client";

import { toast } from "sonner";
import useSWR from "swr";
import { useAuthSheet } from "@/components/layout/auth-sheet";
import { useUser } from "@/hooks/use-user";
import type { ProductListItem } from "@/lib/catalog/types";
import fetcher from "@/lib/fetcher";

export const FAVORITES_KEY = "/api/favorites";

export async function saveFavorite(slug: string) {
  const res = await fetch(`/api/favorites/${encodeURIComponent(slug)}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error(`Could not save favorite (${res.status})`);
}

async function removeFavorite(slug: string) {
  const res = await fetch(`/api/favorites/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Could not remove favorite (${res.status})`);
}

export function useFavorites() {
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const { openAuthSheet } = useAuthSheet();
  const { data, isLoading, mutate } = useSWR<ProductListItem[]>(
    isAuthenticated ? FAVORITES_KEY : null,
    fetcher,
    { revalidateOnFocus: false },
  );

  const favorites = data ?? [];
  const isFavorite = (slug: string) => favorites.some((p) => p.slug === slug);

  /** Optimistic add/remove; guests get the auth sheet instead. */
  const toggle = async (product: ProductListItem) => {
    if (!isAuthenticated) {
      openAuthSheet(product.slug);
      return;
    }
    const adding = !isFavorite(product.slug);
    try {
      await mutate(
        async (current = []) => {
          if (adding) await saveFavorite(product.slug);
          else await removeFavorite(product.slug);
          return adding
            ? [product, ...current]
            : current.filter((p) => p.slug !== product.slug);
        },
        {
          optimisticData: (current = []) =>
            adding
              ? [product, ...current]
              : current.filter((p) => p.slug !== product.slug),
          rollbackOnError: true,
          revalidate: false,
        },
      );
    } catch {
      toast.error(
        adding
          ? "Couldn't save this favorite"
          : "Couldn't remove this favorite",
      );
    }
  };

  return {
    favorites,
    isLoading: userLoading || (isAuthenticated && isLoading),
    isFavorite,
    toggle,
  };
}
