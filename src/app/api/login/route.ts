"use server";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { setRefreshToken, setToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const DJANGO_API_LOGIN_URL = `${DJANGO_API_ENDPOINT}/auth/pair`;

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const payload = {
      email: requestData.email || requestData.username,
      password: requestData.password,
    };

    const response = await fetch(DJANGO_API_LOGIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (response.ok) {
      const { access, refresh, email } = responseData;
      if (access) await setToken(access);
      if (refresh) await setRefreshToken(refresh);

      return NextResponse.json({ loggedIn: true, email }, { status: 200 });
    }

    return NextResponse.json(
      { loggedIn: false, message: responseData.detail || "Invalid credentials", ...responseData },
      { status: response.status || 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { loggedIn: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
