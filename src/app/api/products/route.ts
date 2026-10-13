import type { NextRequest } from "next/server";
import { getCollection } from "@/lib/catalog/collections";
import { parseFilters } from "@/lib/catalog/filters";
import { listProducts } from "@/lib/catalog/products";

/** Pass-through for client-side "Load more". Cached like any catalog read. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Number(params.get("page")) || 1);
  const collection = params.get("collection");

  try {
    const data = collection
      ? await getCollection(collection, page)
      : await listProducts({ ...parseFilters(params), page });
    return Response.json(data);
  } catch {
    return Response.json(
      { detail: "Could not load products" },
      { status: 502 },
    );
  }
}
