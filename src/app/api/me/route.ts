import { djangoAuthed, relay } from "@/lib/django-authed";

export async function GET() {
  return relay(await djangoAuthed("/me"));
}
