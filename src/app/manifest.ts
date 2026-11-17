import type { MetadataRoute } from "next";

// Icons and iOS splash screens in public/icons and public/splash are drawn from
// the logo mark; regenerate them together if the mark changes.
// In Kinyarwanda, the default language: the start URL is unprefixed, so the
// proxy still opens English for shoppers who chose it.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Bukiaa — Iduka ry'imyenda y'abagore",
    short_name: "Bukiaa",
    description:
      "Amakanzu, sets, amajinisi na boubou kuri Bukiaa. Reba ibicuruzwa, ubike ibyo ukunda, utumize kuri WhatsApp.",
    lang: "rw-RW",
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
        name: "Ibicuruzwa byose",
        url: "/shop?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Ibishya",
        url: "/collections/new-arrivals?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Ibyo nakunze",
        url: "/favorites?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Uko watumiza",
        url: "/faq?source=pwa-shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
    // Reuse an open window instead of stacking new ones from shortcuts and links.
    launch_handler: { client_mode: ["navigate-existing", "auto"] },
  };
}
