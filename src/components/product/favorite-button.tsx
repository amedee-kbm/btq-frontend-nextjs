"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { useFavorites } from "@/hooks/use-favorites";
import { useI18n } from "@/i18n/provider";
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
  const { t } = useI18n();
  const active = isFavorite(product.slug);
  const name = product.name || t.common.thisItem;

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
        active ? t.product.removeFavorite(name) : t.product.saveFavorite(name)
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
