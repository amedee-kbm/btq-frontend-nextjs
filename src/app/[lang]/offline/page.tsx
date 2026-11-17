import type { Metadata } from "next";
import { getDictionary } from "@/i18n";
import { OfflineActions, SavedPages } from "./saved-pages";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getDictionary((await params).lang);
  return { title: t.pwa.offlineTitle, robots: { index: false } };
}

// Precached by public/sw.js (in each language) and served for any page that
// can't load offline.
export default async function OfflinePage({ params }: Props) {
  const t = getDictionary((await params).lang);
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <p className="font-heading text-2xl">{t.pwa.offlineTitle}</p>
      <p className="text-sm text-ink-muted">{t.offline.text}</p>
      <OfflineActions />
      <SavedPages />
    </div>
  );
}
