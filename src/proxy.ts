import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  localizePath,
  splitLocale,
} from "@/i18n/config";

const protectedRoutes = ["/favorites"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { lang, path } = splitLocale(pathname);
  const prefixed = pathname !== path;

  const redirect = (to: string) =>
    NextResponse.redirect(new URL(`${to}${search}`, request.url));

  // The default language has no prefix: /rw/shop → /shop.
  if (prefixed && lang === DEFAULT_LOCALE) return redirect(path);

  // An unprefixed link opens in the language the shopper last chose. Only for
  // page loads: the service worker precaches each language's pages by URL.
  const preferred = request.cookies.get(LOCALE_COOKIE)?.value;
  const isPageLoad =
    (request.headers.get("sec-fetch-dest") ?? "document") === "document";
  if (
    !prefixed &&
    isPageLoad &&
    isLocale(preferred) &&
    preferred !== DEFAULT_LOCALE
  ) {
    return redirect(localizePath(preferred, path));
  }

  // Only checks that a session cookie exists (no Django round trip, which could
  // hit a cold start). Real validity is enforced by the BFF route handlers.
  const hasSession = request.cookies.has("auth-refresh-token");
  const matches = (routes: string[]) =>
    routes.some((route) => path === route || path.startsWith(`${route}/`));

  if (matches(protectedRoutes) && !hasSession) {
    const loginUrl = new URL(localizePath(lang, "/login"), request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (matches(authRoutes) && hasSession) {
    return NextResponse.redirect(new URL(localizePath(lang, "/"), request.url));
  }

  if (prefixed) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${path === "/" ? "" : path}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Every page; not API routes, Next internals or files (sw.js, icons, images…).
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
