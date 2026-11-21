"use client";

import { useI18n } from "@/i18n/provider";
import type { ProductListItem } from "@/lib/catalog/types";
import { formatRWF } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useShowPrices } from "./visibility";

/** Nothing at all when the admin hides prices or the product is unpriced. */
export function Price({
  product,
  className,
}: {
  product: Pick<ProductListItem, "price" | "effective_price" | "is_on_sale">;
  className?: string;
}) {
  const { t } = useI18n();
  const showPrices = useShowPrices();
  if (!showPrices || product.effective_price === null) return null;
  // The struck-through original, when there is one that differs.
  const original =
    product.is_on_sale && product.price !== product.effective_price
      ? product.price
      : null;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span
        className={cn(
          "font-bold",
          original !== null ? "text-danger" : "text-price",
        )}
      >
        {original !== null && <span className="sr-only">{t.price.sale}</span>}
        {formatRWF(product.effective_price)}
      </span>
      {original !== null && (
        <s className="text-[0.85em] text-ink-muted">
          <span className="sr-only">{t.price.original}</span>
          {formatRWF(original)}
        </s>
      )}
    </p>
  );
}
