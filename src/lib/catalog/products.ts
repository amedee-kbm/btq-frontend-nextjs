import "server-only";
import { apiGet } from "./client";
import { PAGE_SIZE, serializeFilters } from "./filters";
import { getSiteSettingsOrFallback } from "./settings";
import type {
  Paginated,
  ProductDetail,
  ProductFilters,
  ProductListItem,
} from "./types";

/**
 * When the admin hides product names, names (and image alt texts, which tend
 * to repeat them) are blanked, so none reach the browser. The UI treats an
 * empty name as "show neither name nor code"; the code stays for WhatsApp.
 */
export async function maskNames<T extends ProductListItem>(products: T[]) {
  const { show_product_names } = await getSiteSettingsOrFallback();
  if (show_product_names) return products;
  return products.map((p) => ({
    ...p,
    name: "",
    images: p.images.map((image) => ({ ...image, alt: "" })),
  }));
}

export async function listProducts(filters: Partial<ProductFilters> = {}) {
  const page = await apiGet<Paginated<ProductListItem>>(
    "/products",
    serializeFilters({ page_size: PAGE_SIZE, ...filters }),
  );
  return { ...page, items: await maskNames(page.items) };
}

export async function getProduct(slug: string) {
  const product = await apiGet<ProductDetail>(
    `/products/${encodeURIComponent(slug)}`,
  );
  const [masked] = await maskNames([product]);
  return masked;
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
