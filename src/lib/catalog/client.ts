import "server-only";
import { notFound } from "next/navigation";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

/** Cache tags the backend webhook may revalidate. */
export const CACHE_TAGS = ["catalog", "settings"] as const;
export type CacheTag = (typeof CACHE_TAGS)[number];

/** Server-only GET against the public API, cached with tags (+1 h safety net). */
export async function apiGet<T>(
  path: string,
  params?: URLSearchParams,
  tags: CacheTag[] = ["catalog"],
): Promise<T> {
  const query = params?.toString();
  const res = await fetch(
    `${DJANGO_API_ENDPOINT}${path}${query ? `?${query}` : ""}`,
    { next: { tags, revalidate: 3600 } },
  );
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
