"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Paginated, ProductListItem } from "@/lib/catalog/types";
import { ProductGrid } from "./product-grid";

/**
 * Appends further pages below the server-rendered first page. Remount it (via
 * `key`) whenever the query changes so it starts over.
 */
export function LoadMore({
  query,
  shown,
  total,
}: {
  /** Query for /api/products, without `page`. */
  query: string;
  shown: number;
  total: number;
}) {
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const count = shown + items.length;

  const loadMore = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const params = new URLSearchParams(query);
      params.set("page", String(page + 1));
      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error(String(res.status));
      const data: Paginated<ProductListItem> = await res.json();
      setItems((current) => {
        const seen = new Set(current.map((p) => p.slug));
        return [...current, ...data.items.filter((p) => !seen.has(p.slug))];
      });
      setPage(data.page);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {items.length > 0 && <ProductGrid products={items} />}
      <div className="flex flex-col items-center gap-3 py-8">
        <p className="text-sm text-ink-muted" aria-live="polite">
          Showing {count} of {total}
        </p>
        {failed && (
          <p className="text-sm text-danger">
            Couldn't load more items. Please try again.
          </p>
        )}
        {count < total && (
          <Button
            variant="outline"
            size="lg"
            className="min-w-48"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading…" : "Load more"}
          </Button>
        )}
      </div>
    </>
  );
}
