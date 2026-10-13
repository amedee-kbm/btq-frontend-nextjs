import { NextResponse } from "next/server";
import { deleteTokens } from "@/lib/auth";

export async function POST() {
  await deleteTokens();
  return NextResponse.json({ loggedIn: false });
}
