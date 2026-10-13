import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/catalog/client";

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const requested: unknown[] = Array.isArray(body?.tags) ? body.tags : [];
  const tags = requested.filter((tag): tag is string =>
    (CACHE_TAGS as readonly unknown[]).includes(tag),
  );

  // Expire immediately (not stale-while-revalidate): the next visitor gets fresh data.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: tags });
}
