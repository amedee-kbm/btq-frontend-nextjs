import type { Metadata } from "next";
import { OfflineActions, SavedPages } from "./saved-pages";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false },
};

// Precached by public/sw.js and served for any page that can't load offline.
export default function OfflinePage() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <p className="font-heading text-2xl">You're offline</p>
      <p className="text-sm text-ink-muted">
        This page isn't saved on your phone yet. Check your connection and try
        again. It reloads by itself once you're back online.
      </p>
      <OfflineActions />
      <SavedPages />
    </div>
  );
}
