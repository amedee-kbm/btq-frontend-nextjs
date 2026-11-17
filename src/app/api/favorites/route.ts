import { maskNames } from "@/lib/catalog/products";
import type { ProductListItem } from "@/lib/catalog/types";
import { djangoAuthed, relay } from "@/lib/django-authed";

export async function GET() {
  const res = await djangoAuthed("/me/favorites");
  if (!res.ok) return relay(res);
  const favorites: ProductListItem[] = await res.json();
  return Response.json(await maskNames(favorites));
}
