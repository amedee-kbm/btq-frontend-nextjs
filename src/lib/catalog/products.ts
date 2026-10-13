import "server-only";
import { apiGet } from "./client";
import { PAGE_SIZE, serializeFilters } from "./filters";
import type {
  Paginated,
  ProductDetail,
  ProductFilters,
  ProductListItem,
} from "./types";

export function listProducts(filters: Partial<ProductFilters> = {}) {
  return apiGet<Paginated<ProductListItem>>(
    "/products",
    serializeFilters({ page_size: PAGE_SIZE, ...filters }),
  );
}

export function getProduct(slug: string) {
  return apiGet<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
}

/** Up to `limit` products from the same category, sold-out last (API ordering). */
export async function listRelatedProducts(product: ProductDetail, limit = 8) {
  const category = product.categories[0];
  if (!category) return [];
  const { items } = await listProducts({
    category: category.slug,
    page_size: limit + 1,
  });
  return items.filter((p) => p.slug !== product.slug).slice(0, limit);
}
