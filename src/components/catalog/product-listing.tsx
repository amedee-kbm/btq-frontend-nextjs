import { parseFilters, serializeFilters } from "@/lib/catalog/filters";
import { listProducts } from "@/lib/catalog/products";
import {
  listCategories,
  listColors,
  listSizes,
  listTags,
} from "@/lib/catalog/taxonomy";
import type { ProductFilters } from "@/lib/catalog/types";
import { EmptyState } from "./empty-state";
import { FilterSheet, FilterSidebar } from "./filter-panel";
import { ListingProvider, PendingRegion } from "./listing-state";
import { LoadMore } from "./load-more";
import { ProductGrid } from "./product-grid";
import { SortSelect } from "./sort-select";

export type SearchParams = Record<string, string | string[] | undefined>;

/**
 * The one product grid behind /shop, /categories, /occasions: parses filters
 * from the URL (plus the page's fixed filter), and renders filters, sort, the
 * first page and "Load more".
 */
export async function ProductListing({
  searchParams,
  fixed = {},
}: {
  searchParams: SearchParams;
  fixed?: Partial<ProductFilters>;
}) {
  const filters: ProductFilters = {
    ...parseFilters(searchParams),
    ...fixed,
    page: 1,
  };

  const [data, categories, tags, sizes, colors] = await Promise.all([
    listProducts(filters),
    listCategories(),
    listTags(),
    listSizes(),
    listColors(),
  ]);
  const options = { categories, tags, sizes, colors };
  const query = serializeFilters({ ...filters, page: 1 }).toString();

  return (
    <ListingProvider filters={filters} fixed={fixed}>
      <div className="flex gap-8">
        <FilterSidebar options={options} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 pb-4">
            <p className="text-sm text-ink-muted" aria-live="polite">
              {data.count} {data.count === 1 ? "item" : "items"}
            </p>
            <div className="flex items-center gap-2">
              <FilterSheet options={options} count={data.count} />
              <SortSelect />
            </div>
          </div>
          <PendingRegion>
            {data.items.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <ProductGrid products={data.items} priorityCount={4} />
                <LoadMore
                  key={query}
                  query={query}
                  shown={data.items.length}
                  total={data.count}
                />
              </>
            )}
          </PendingRegion>
        </div>
      </div>
    </ListingProvider>
  );
}
