import "server-only";
import { apiGet } from "./client";
import type { SiteSettings } from "./types";

export function getSiteSettings() {
  return apiGet<SiteSettings>("/settings", undefined, ["settings"]);
}

/** The backend's seeded values; only used if the API can't be reached for the page chrome. */
const FALLBACK_SETTINGS: SiteSettings = {
  whatsapp_number: "250781427209",
  whatsapp_template:
    "Hi Btq! I'd like {code} – {name}, size {size}, colour {color} ({price}). Is it available? {url}",
  whatsapp_restock_template:
    "Hi Btq! Is {code} – {name} coming back in size {size}, colour {color}? {url}",
  phone: "+250781427209",
  email: "",
  address: "CHIC Building B30A, Kigali",
  socials: { instagram: "", tiktok: "", x: "", facebook: "" },
};

/** For the header/footer: never let a cold backend break every page. */
export function getSiteSettingsOrFallback() {
  return getSiteSettings().catch(() => FALLBACK_SETTINGS);
}
