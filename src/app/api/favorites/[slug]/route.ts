import { djangoAuthed, relay } from "@/lib/django-authed";

type Context = { params: Promise<{ slug: string }> };

async function forward(method: "PUT" | "DELETE", { params }: Context) {
  const { slug } = await params;
  return relay(
    await djangoAuthed(`/me/favorites/${encodeURIComponent(slug)}`, { method }),
  );
}

export function PUT(_request: Request, context: Context) {
  return forward("PUT", context);
}

export function DELETE(_request: Request, context: Context) {
  return forward("DELETE", context);
}
