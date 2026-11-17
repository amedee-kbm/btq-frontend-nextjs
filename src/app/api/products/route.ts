import type { NextRequest } from "next/server";
import { getCollection } from "@/lib/catalog/collections";
import { parseFilters, withoutPriceFilters } from "@/lib/catalog/filters";
import { listProducts } from "@/lib/catalog/products";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";

/** Pass-through for client-side "Load more". Cached like any catalog read. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const collection = params.get("collection");

  try {
    const filters = { ...parseFilters(params), page };
    const { show_prices } = await getSiteSettingsOrFallback();
    const data = collection
      ? await getCollection(collection, page)
      : await listProducts(
          show_prices ? filters : withoutPriceFilters(filters),
        );
    return Response.json(data);
  } catch {
    return Response.json(
      { detail: "Could not load products" },
      { status: 502 },
    );
  }
}
