import type { ProductFilters, ProductSort } from "./types";

// Shared by server pages, the /api/products route and the filter UI.
// URL parameter names are the API's own, so a query string passes straight through.

export const PAGE_SIZE = 24;

export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

type ParamsLike =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function getAll(params: ParamsLike, key: string): string[] {
  if (params instanceof URLSearchParams) return params.getAll(key);
  const value = params[key];
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function getOne(params: ParamsLike, key: string): string | undefined {
  return getAll(params, key)[0] || undefined;
}

function toInt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseFilters(params: ParamsLike): ProductFilters {
  const sort = getOne(params, "sort");
  return {
    category: getOne(params, "category"),
    tag: getAll(params, "tag"),
    size: getAll(params, "size"),
    color: getAll(params, "color"),
    min_price: toInt(getOne(params, "min_price")),
    max_price: toInt(getOne(params, "max_price")),
    on_sale: getOne(params, "on_sale") === "true",
    in_stock: getOne(params, "in_stock") === "true",
    q: getOne(params, "q")?.trim() || undefined,
    sort: SORT_OPTIONS.some((o) => o.value === sort)
      ? (sort as ProductSort)
      : "newest",
    page: toInt(getOne(params, "page")) || 1,
  };
}

/** Serializes filters; defaults (page 1, newest, false flags) are omitted. */
export function serializeFilters(filters: Partial<ProductFilters>) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  for (const tag of filters.tag ?? []) params.append("tag", tag);
  for (const size of filters.size ?? []) params.append("size", size);
  for (const color of filters.color ?? []) params.append("color", color);
  if (filters.min_price !== undefined)
    params.set("min_price", String(filters.min_price));
  if (filters.max_price !== undefined)
    params.set("max_price", String(filters.max_price));
  if (filters.on_sale) params.set("on_sale", "true");
  if (filters.in_stock) params.set("in_stock", "true");
  if (filters.sort && filters.sort !== "newest")
    params.set("sort", filters.sort);
  if (filters.page && filters.page > 1)
    params.set("page", String(filters.page));
  if (filters.page_size) params.set("page_size", String(filters.page_size));
  return params;
}

/** Number of user-chosen filters (not search, sort or the page's fixed filter). */
export function countActiveFilters(
  filters: ProductFilters,
  fixed: Partial<ProductFilters> = {},
) {
  return (
    (filters.category && !fixed.category ? 1 : 0) +
    filters.tag.filter((t) => !fixed.tag?.includes(t)).length +
    filters.size.length +
    filters.color.length +
    (filters.min_price !== undefined || filters.max_price !== undefined
      ? 1
      : 0) +
    (filters.on_sale ? 1 : 0) +
    (filters.in_stock ? 1 : 0)
  );
}
