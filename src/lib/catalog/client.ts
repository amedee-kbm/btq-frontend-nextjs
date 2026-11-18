import "server-only";
import { notFound } from "next/navigation";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

/** Cache tags the backend webhook may revalidate. */
export const CACHE_TAGS = ["catalog", "settings"] as const;
export type CacheTag = (typeof CACHE_TAGS)[number];

/** A sleeping backend can hold a request open forever; fail instead so callers can fall back. */
const TIMEOUT_MS = 10_000;

/** Server-only GET against the public API, cached with tags (+1 h safety net). */
export async function apiGet<T>(
  path: string,
  params?: URLSearchParams,
  tags: CacheTag[] = ["catalog"],
): Promise<T> {
  const query = params?.toString();
  let res: Response;
  try {
    res = await fetch(
      `${DJANGO_API_ENDPOINT}${path}${query ? `?${query}` : ""}`,
      {
        next: { tags, revalidate: 3600 },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );
  } catch (err) {
    // AbortSignal.timeout rejects with a DOMException whose `message` is a
    // read-only getter; Next/React try to rewrite error messages and crash
    // ("Cannot set property message ... which has only a getter"). Rethrow
    // a plain Error so callers' fallbacks and error boundaries work.
    if (err instanceof DOMException) {
      throw new Error(`API ${path} ${err.name}: ${err.message}`, { cause: err });
    }
    throw err;
  }
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`API ${path} ${res.status}`);
  return res.json() as Promise<T>;
}
