import { NextResponse } from "next/server";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { setTokens } from "@/lib/auth";

function post(path: string, body: unknown) {
  return fetch(`${DJANGO_API_ENDPOINT}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    const response = await post("/auth/register", {
      email,
      password,
      username: username || undefined,
    });
    const responseData = await response.json();
    if (!response.ok) {
      return NextResponse.json(responseData, { status: response.status });
    }

    // Log the new account straight in.
    const pair = await post("/auth/pair", { email, password });
    if (pair.ok) {
      const { access, refresh } = await pair.json();
      await setTokens({ access, refresh });
    }
    return NextResponse.json({ loggedIn: pair.ok, user: responseData });
  } catch {
    return NextResponse.json(
      { detail: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
