import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary, languageAlternates } from "@/i18n";
import { InstallPanel } from "./install-panel";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang);
  return {
    title: t.install.metaTitle,
    description: t.install.metaDescription,
    alternates: languageAlternates(lang, "/install"),
    openGraph: {
      title: t.pwa.getTheApp,
      description: t.install.ogDescription,
    },
  };
}

// The link to share for installing: bukiaa.com/install. Browsers only install
// from a tap or the Share menu, so this page puts the right one front and center.
export default async function InstallPage({ params }: Props) {
  const t = getDictionary((await params).lang);
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
      <h1 className="font-heading text-3xl">{t.pwa.getTheApp}</h1>
      <p className="text-sm text-ink-muted">{t.install.text}</p>
      <InstallPanel />
    </div>
  );
}
