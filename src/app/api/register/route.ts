"use server";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { NextResponse } from "next/server";

const DJANGO_API_REGISTER_URL = `${DJANGO_API_ENDPOINT}/auth/register`;

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const payload = {
      email: requestData.email,
      password: requestData.password,
      username: requestData.username || undefined,
    };

    const response = await fetch(DJANGO_API_REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
