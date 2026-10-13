import "server-only";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { deleteTokens, getRefreshToken, getToken, setTokens } from "@/lib/auth";

function unauthorized() {
  return Response.json({ detail: "Not authenticated" }, { status: 401 });
}

/** Exchanges the refresh cookie for a new token pair (rotation) and stores both. */
async function refreshTokens(refresh: string): Promise<string | null> {
  try {
    const res = await fetch(`${DJANGO_API_ENDPOINT}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: { access?: string; refresh?: string } = await res.json();
    if (!data.access) return null;
    await setTokens({ access: data.access, refresh: data.refresh });
    return data.access;
  } catch {
    return null;
  }
}

/**
 * Calls an authenticated Django endpoint on behalf of the browser, refreshing
 * the access token (once) when it is missing or rejected. Only for route handlers.
 */
export async function djangoAuthed(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const refresh = await getRefreshToken();
  let access = await getToken();
  let refreshed = false;

  if (!access) {
    if (!refresh) return unauthorized();
    access = (await refreshTokens(refresh)) ?? undefined;
    refreshed = true;
    if (!access) {
      await deleteTokens();
      return unauthorized();
    }
  }

  const call = (token: string) =>
    fetch(`${DJANGO_API_ENDPOINT}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

  let res: Response;
  try {
    res = await call(access);
    if (res.status === 401 && refresh && !refreshed) {
      const renewed = await refreshTokens(refresh);
      if (!renewed) {
        await deleteTokens();
        return unauthorized();
      }
      res = await call(renewed);
    }
  } catch {
    return Response.json(
      { detail: "Cannot reach the server. Please try again." },
      { status: 503 },
    );
  }

  if (res.status === 401) await deleteTokens();
  return res;
}

/** Re-wraps a Django response so it can be returned from a route handler. */
export async function relay(res: Response) {
  if (res.status === 204) return new Response(null, { status: 204 });
  const body = await res.text();
  return new Response(body || "{}", {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
