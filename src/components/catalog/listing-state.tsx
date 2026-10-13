"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useTransition } from "react";
import { serializeFilters } from "@/lib/catalog/filters";
import type { ProductFilters } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

// Filter UI state is the URL. Changing a filter pushes a new query string, which
// re-renders the listing on the server; the transition dims the grid meanwhile.

type ListingContextValue = {
  filters: ProductFilters;
  fixed: Partial<ProductFilters>;
  isPending: boolean;
  apply: (next: Partial<ProductFilters>) => void;
  clear: () => void;
};

const ListingContext = createContext<ListingContextValue | null>(null);

export function useListing() {
  const value = useContext(ListingContext);
  if (!value)
    throw new Error("useListing must be used inside <ListingProvider>");
  return value;
}

export function ListingProvider({
  filters,
  fixed,
  children,
}: {
  filters: ProductFilters;
  fixed: Partial<ProductFilters>;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const navigate = (next: ProductFilters) => {
    // The page's fixed filter lives in the path, not the query string.
    const params = serializeFilters({
      ...next,
      category: fixed.category ? undefined : next.category,
      tag: next.tag.filter((t) => !fixed.tag?.includes(t)),
      page: 1,
    });
    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  return (
    <ListingContext.Provider
      value={{
        filters,
        fixed,
        isPending,
        apply: (next) => navigate({ ...filters, ...next }),
        clear: () =>
          navigate({
            ...fixed,
            tag: fixed.tag ?? [],
            size: [],
            color: [],
            on_sale: false,
            in_stock: false,
            q: filters.q,
            sort: filters.sort,
            page: 1,
          }),
      }}
    >
      {children}
    </ListingContext.Provider>
  );
}

export function PendingRegion({ children }: { children: React.ReactNode }) {
  const { isPending } = useListing();
  return (
    <div
      aria-busy={isPending}
      className={cn(
        "transition-opacity",
        isPending && "pointer-events-none opacity-50",
      )}
    >
      {children}
    </div>
  );
}
