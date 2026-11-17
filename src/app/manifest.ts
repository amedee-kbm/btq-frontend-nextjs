import type { MetadataRoute } from "next";

// Icons and iOS splash screens in public/icons and public/splash are drawn from
// the logo mark; regenerate them together if the mark changes.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Bukiaa — Women's fashion boutique",
    short_name: "Bukiaa",
    description:
      "Dresses, matching sets, jeans and boubous from Bukiaa. Browse the catalog, save favorites and order on WhatsApp.",
    lang: "en-RW",
    dir: "ltr",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#f8f6f0",
    theme_color: "#f8f6f0",
    categories: ["shopping", "lifestyle"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/monochrome-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "monochrome",
      },
    ],
    shortcuts: [
      {
        name: "Shop all",
        url: "/shop?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "New arrivals",
        url: "/collections/new-arrivals?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Favorites",
        url: "/favorites?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "How to order",
        url: "/faq?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
    // Reuse an open window instead of stacking new ones from shortcuts and links.
    launch_handler: { client_mode: ["navigate-existing", "auto"] },
  };
}
