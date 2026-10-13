import type { ProductListItem } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
}: {
  products: ProductListItem[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-0.5 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <li key={product.slug}>
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul
      className="grid grid-cols-2 gap-x-0.5 md:grid-cols-3 lg:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders
        <li key={i} className="flex flex-col">
          <div className="aspect-2/3 w-full animate-pulse bg-bone" />
          <div className="flex flex-col gap-2 px-2 pt-3 pb-6">
            <div className="h-3.5 w-3/4 animate-pulse bg-bone" />
            <div className="h-3.5 w-1/3 animate-pulse bg-bone" />
          </div>
        </li>
      ))}
    </ul>
  );
}
