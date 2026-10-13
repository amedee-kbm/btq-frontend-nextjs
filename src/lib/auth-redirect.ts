"use client";

// After login/register: save the favorite whose ♥ tap started the flow, then go
// back to where the shopper was. The slug travels in `?fav=` and sessionStorage.

const PENDING_FAVORITE_KEY = "btq:pending-favorite";
const BLOCKED_NEXT = ["/login", "/register"];

export function rememberPendingFavorite(slug: string | null) {
  try {
    if (slug) sessionStorage.setItem(PENDING_FAVORITE_KEY, slug);
    else sessionStorage.removeItem(PENDING_FAVORITE_KEY);
  } catch {
    // Storage can be unavailable (private mode); ?fav= still carries the slug.
  }
}

function takePendingFavorite(fromQuery: string | null) {
  let slug = fromQuery;
  try {
    slug ??= sessionStorage.getItem(PENDING_FAVORITE_KEY);
    sessionStorage.removeItem(PENDING_FAVORITE_KEY);
  } catch {}
  return slug;
}

/** Only same-site paths, never back to an auth page. */
export function safeNext(next: string | null) {
  if (!next?.startsWith("/") || next.startsWith("//")) return "/";
  const path = next.split(/[?#]/)[0];
  return BLOCKED_NEXT.includes(path) ? "/" : next;
}

/** Query string that carries `next` and `fav` between /login and /register. */
export function authQuery(searchParams: URLSearchParams) {
  const params = new URLSearchParams();
  for (const key of ["next", "fav"]) {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export async function finishAuth(searchParams: URLSearchParams) {
  const slug = takePendingFavorite(searchParams.get("fav"));
  if (slug) {
    await fetch(`/api/favorites/${encodeURIComponent(slug)}`, {
      method: "PUT",
    }).catch(() => {});
  }
  return { next: safeNext(searchParams.get("next")), savedFavorite: !!slug };
}
