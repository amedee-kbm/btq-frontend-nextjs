import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import type { NavCategory, NavLink } from "@/components/layout/nav-types";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/config/defaults";
import { getDictionary, LOCALE_TAGS, LOCALES, toLocale } from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import { listCollections } from "@/lib/catalog/collections";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import { listCategories } from "@/lib/catalog/taxonomy";
import type { Category } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";
import NavBar from "./nav-bar";
import Providers from "./providers";
import TopBar from "./top-bar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-bodoni-moda",
});

// [CSS width, CSS height, pixel ratio] of the iPhones and iPads with a splash
// screen in public/splash.
const SPLASH_SCREENS = [
  [440, 956, 3],
  [402, 874, 3],
  [430, 932, 3],
  [393, 852, 3],
  [428, 926, 3],
  [390, 844, 3],
  [375, 812, 3],
  [414, 896, 3],
  [414, 896, 2],
  [414, 736, 3],
  [375, 667, 2],
  [320, 568, 2],
  [1024, 1366, 2],
  [834, 1194, 2],
  [820, 1180, 2],
  [810, 1080, 2],
  [768, 1024, 2],
] as const;

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const t = getDictionary((await params).lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.meta.title,
      template: "%s | Bukiaa",
    },
    description: t.meta.description,
    openGraph: {
      siteName: "Bukiaa",
      locale: t.meta.ogLocale,
      type: "website",
    },
    applicationName: "Bukiaa",
    appleWebApp: {
      capable: true,
      title: "Bukiaa",
      statusBarStyle: "default",
      startupImage: SPLASH_SCREENS.map(([width, height, ratio]) => ({
        url: `/splash/${width * ratio}x${height * ratio}.png`,
        media: `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
      })),
    },
    // Next only emits the standard tag; iOS still reads this one for splash screens.
    other: { "apple-mobile-web-app-capable": "yes" },
    // Stop iOS from turning prices and product codes into phone links.
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#f8f6f0",
  // Lets content reach the screen edges; globals.css pads for notches.
  viewportFit: "cover",
};

async function getNavData() {
  // The header must render even if the backend is asleep or unreachable.
  const [categories, collections, settings] = await Promise.all([
    listCategories().catch(() => []),
    listCollections().catch(() => []),
    getSiteSettingsOrFallback(),
  ]);
  const link = (c: Category) => ({
    label: c.name,
    href: `/categories/${c.slug}`,
    image: c.cover_image,
    count: c.product_count,
  });
  const navCategories: NavCategory[] = categories.map((c) => ({
    ...link(c),
    children: c.children.map(link),
  }));
  const navCollections: NavLink[] = collections.map((c) => ({
    label: c.name,
    href: `/collections/${c.slug}`,
  }));
  return { navCategories, navCollections, settings };
}

export default async function RootLayout({ children, params }: Props) {
  const lang = toLocale((await params).lang);
  const { navCategories, navCollections, settings } = await getNavData();

  return (
    <html
      lang={LOCALE_TAGS[lang]}
      className={cn(
        "antialiased",
        inter.variable,
        playfairDisplay.variable,
        bodoniModa.variable,
      )}
    >
      <body className="flex min-h-screen flex-col bg-surface font-sans">
        <I18nProvider lang={lang}>
          <Providers>
            <TopBar settings={settings} lang={lang} />
            <NavBar categories={navCategories} collections={navCollections} />
            <main className="flex w-full flex-1 flex-col items-center">
              {children}
            </main>
            <BottomNav
              categories={navCategories}
              collections={navCollections}
            />
            <Toaster />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
