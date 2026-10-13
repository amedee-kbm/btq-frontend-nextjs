import { NextResponse } from "next/server";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { setTokens } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const response = await fetch(`${DJANGO_API_ENDPOINT}/auth/pair`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: requestData.email,
        password: requestData.password,
      }),
      cache: "no-store",
    });
    const responseData = await response.json();

    if (response.ok) {
      const { access, refresh, email } = responseData;
      await setTokens({ access, refresh });
      return NextResponse.json({ loggedIn: true, email });
    }

    return NextResponse.json(
      {
        loggedIn: false,
        message: responseData.detail || "Invalid credentials",
      },
      { status: response.status || 400 },
    );
  } catch {
    return NextResponse.json(
      { loggedIn: false, message: "An error occurred during login" },
      { status: 500 },
    );
  }
}
