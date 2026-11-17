import { ShowPricesProvider } from "@/components/catalog/show-prices";
import { AskUsProvider } from "@/components/layout/ask-us";
import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import Footer from "./footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettingsOrFallback();
  return (
    <ShowPricesProvider value={settings.show_prices}>
      <AskUsProvider number={settings.whatsapp_number}>
        <div className="w-full flex-1">{children}</div>
        <Footer settings={settings} />
      </AskUsProvider>
    </ShowPricesProvider>
  );
}
