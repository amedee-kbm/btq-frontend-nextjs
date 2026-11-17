import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import type { NavCategory, NavLink } from "@/components/layout/nav-types";
import { Toaster } from "@/components/ui/sonner";
import { SITE_URL } from "@/config/defaults";
import { listCollections } from "@/lib/catalog/collections";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import { listCategories } from "@/lib/catalog/taxonomy";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bukiaa — Women's fashion boutique",
    template: "%s | Bukiaa",
  },
  description:
    "Dresses, matching sets, jeans and boubous from Bukiaa. Browse the whole catalog, then order on WhatsApp. Pay with MoMo or cash.",
  openGraph: {
    siteName: "Bukiaa",
    locale: "en_RW",
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
  const navCategories: NavCategory[] = categories.map((c) => ({
    label: c.name,
    href: `/categories/${c.slug}`,
    children: c.children.map((child) => ({
      label: child.name,
      href: `/categories/${child.slug}`,
    })),
  }));
  const navCollections: NavLink[] = collections.map((c) => ({
    label: c.name,
    href: `/collections/${c.slug}`,
  }));
  return { navCategories, navCollections, settings };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navCategories, navCollections, settings } = await getNavData();

  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        inter.variable,
        playfairDisplay.variable,
        bodoniModa.variable,
      )}
    >
      <body className="flex min-h-screen flex-col bg-surface font-sans">
        <Providers>
          <TopBar settings={settings} />
          <NavBar categories={navCategories} collections={navCollections} />
          <main className="flex w-full flex-1 flex-col items-center">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
