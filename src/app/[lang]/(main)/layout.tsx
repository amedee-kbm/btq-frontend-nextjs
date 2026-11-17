import { VisibilityProvider } from "@/components/catalog/visibility";
import { AskUsProvider } from "@/components/layout/ask-us";
import { toLocale } from "@/i18n";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import Footer from "./footer";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const lang = toLocale((await params).lang);
  const settings = await getSiteSettingsOrFallback();
  return (
    <VisibilityProvider
      value={{
        prices: settings.show_prices,
        swatches: settings.show_color_swatches,
      }}
    >
      <AskUsProvider number={settings.whatsapp_number}>
        <div className="w-full flex-1">{children}</div>
        <Footer settings={settings} lang={lang} />
      </AskUsProvider>
    </VisibilityProvider>
  );
}
