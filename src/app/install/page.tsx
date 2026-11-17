import type { Metadata } from "next";
import Image from "next/image";
import { InstallPanel } from "./install-panel";

export const metadata: Metadata = {
  title: "Get the app",
  description:
    "Install Bukiaa on your phone: it opens full screen, loads faster and keeps the pieces you've viewed for when you're offline.",
  openGraph: {
    title: "Get the Bukiaa app",
    description: "Add Bukiaa to your home screen in one tap.",
  },
};

// The link to share for installing: bukiaa.com/install. Browsers only install
// from a tap or the Share menu, so this page puts the right one front and center.
export default function InstallPage() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
      <Image
        src="/icons/icon-192.png"
        alt=""
        width={96}
        height={96}
        priority
        className="size-24"
      />
      <h1 className="font-heading text-3xl">Get the Bukiaa app</h1>
      <p className="text-sm text-ink-muted">
        It opens full screen from your home screen, loads faster and keeps the
        pieces you've viewed for when you're offline. Free, and no app store
        needed.
      </p>
      <InstallPanel />
    </div>
  );
}
