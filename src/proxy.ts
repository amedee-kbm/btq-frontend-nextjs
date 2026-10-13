import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/favorites"];
const authRoutes = ["/login", "/register"];

// Only checks that a session cookie exists (no Django round trip, which could
// hit a cold start). Real validity is enforced by the BFF route handlers.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.has("auth-refresh-token");

  const matches = (routes: string[]) =>
    routes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

  if (matches(protectedRoutes) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (matches(authRoutes) && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/favorites/:path*", "/login", "/register"],
};
