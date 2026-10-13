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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Btq. — Women's fashion boutique in Kigali",
    template: "%s | Btq.",
  },
  description:
    "Dresses, matching sets, jeans and boubous from Btq., Kigali. Browse the whole catalog, then order on WhatsApp. Pay with MoMo or cash.",
  openGraph: { siteName: "Btq.", locale: "en_RW", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#fbf8f7",
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
