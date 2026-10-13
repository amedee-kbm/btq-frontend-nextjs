import "server-only";
import { cookies } from "next/headers";

export const TOKEN_NAME = "auth-token";
export const TOKEN_REFRESH_NAME = "auth-refresh-token";

const ACCESS_MAX_AGE = 15 * 60;
const REFRESH_MAX_AGE = 30 * 24 * 60 * 60;

// `lax`, not `strict`: shoppers arrive from TikTok/WhatsApp links, and with
// `strict` the cookies would be missing on that first cross-site navigation.
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV !== "development",
  path: "/",
} as const;

export async function getToken() {
  return (await cookies()).get(TOKEN_NAME)?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get(TOKEN_REFRESH_NAME)?.value;
}

export async function setTokens({
  access,
  refresh,
}: {
  access?: string;
  refresh?: string;
}) {
  const cookieStore = await cookies();
  if (access) {
    cookieStore.set({
      name: TOKEN_NAME,
      value: access,
      maxAge: ACCESS_MAX_AGE,
      ...cookieOptions,
    });
  }
  if (refresh) {
    cookieStore.set({
      name: TOKEN_REFRESH_NAME,
      value: refresh,
      maxAge: REFRESH_MAX_AGE,
      ...cookieOptions,
    });
  }
}

export async function deleteTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_REFRESH_NAME);
  cookieStore.delete(TOKEN_NAME);
}
