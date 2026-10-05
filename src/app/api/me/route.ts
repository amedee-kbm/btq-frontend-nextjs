"use server";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import ApiProxy from "@/lib/api-proxy";
import { NextResponse } from "next/server";

const DJANGO_API_ME_URL = `${DJANGO_API_ENDPOINT}/me/`;

export async function GET() {
  const { data, status } = await ApiProxy.get(DJANGO_API_ME_URL, true);
  return NextResponse.json(data, { status });
}
