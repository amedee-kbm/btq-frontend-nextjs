import { getSiteSettingsOrFallback } from "@/lib/catalog/settings";
import Footer from "./footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettingsOrFallback();
  return (
    <>
      <div className="w-full flex-1">{children}</div>
      <Footer settings={settings} />
    </>
  );
}
