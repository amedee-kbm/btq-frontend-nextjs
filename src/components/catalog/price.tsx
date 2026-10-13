import type { ProductListItem } from "@/lib/catalog/types";
import { formatRWF } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  product,
  className,
}: {
  product: Pick<ProductListItem, "price" | "effective_price" | "is_on_sale">;
  className?: string;
}) {
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span
        className={cn(
          "font-bold",
          product.is_on_sale ? "text-danger" : "text-price",
        )}
      >
        {product.is_on_sale && <span className="sr-only">Sale price </span>}
        {formatRWF(product.effective_price)}
      </span>
      {product.is_on_sale && (
        <s className="text-[0.85em] text-ink-muted">
          <span className="sr-only">Original price </span>
          {formatRWF(product.price)}
        </s>
      )}
    </p>
  );
}
