import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

const protectedRoutes = ["/account", "/checkout", "/profile"];
const authRoutes = ["/login", "/register"];
const meEndpoint = `${DJANGO_API_ENDPOINT}/me/`;

async function isValidToken(token: string) {
  try {
    const response = await fetch(meEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const shouldValidateToken = isProtectedRoute || isAuthRoute;

  const hasValidToken =
    shouldValidateToken && token ? await isValidToken(token) : false;

  if (isProtectedRoute && !hasValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete("auth-token");
    return response;
  }

  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();
  if (shouldValidateToken && token && !hasValidToken) {
    response.cookies.delete("auth-token");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
