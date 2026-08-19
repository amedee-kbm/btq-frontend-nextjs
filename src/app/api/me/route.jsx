"use server";

import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { NextResponse } from "next/server";
import ApiProxy from "@/lib/api-proxy";

const DJANGO_API_ME_URL = `${DJANGO_API_ENDPOINT}/me/`;

export async function GET(request) {
  const { data, status } = await ApiProxy.get(DJANGO_API_ME_URL, true);
  return NextResponse.json(data, { status: status });
}
