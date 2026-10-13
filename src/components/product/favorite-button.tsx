"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { useFavorites } from "@/hooks/use-favorites";
import type { ProductListItem } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  product,
  className,
  size = 20,
}: {
  product: ProductListItem;
  className?: string;
  size?: number;
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(product.slug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(product);
      }}
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${product.name} from favorites`
          : `Save ${product.name} to favorites`
      }
      className={cn(
        "grid place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        active ? "text-brand" : "text-ink hover:text-brand",
        className,
      )}
    >
      <HeartIcon size={size} weight={active ? "fill" : "regular"} />
    </button>
  );
}
