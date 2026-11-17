// Kinyarwanda is the default and lives at the unprefixed URLs (/shop), so links
// already shared on TikTok and WhatsApp keep working. English is under /en.
// proxy.ts rewrites unprefixed paths to /rw internally; /rw itself is never public.

export const LOCALES = ["rw", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "rw";

/** Cookie holding the shopper's last chosen language. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_NAMES: Record<Locale, string> = {
  rw: "Kinyarwanda",
  en: "English",
};

/** BCP 47 tags, for <html lang>, hreflang and the like. */
export const LOCALE_TAGS: Record<Locale, string> = { rw: "rw-RW", en: "en-RW" };

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Splits "/en/shop" into { lang: "en", path: "/shop" }; unprefixed paths are the default. */
export function splitLocale(pathname: string): { lang: Locale; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return { lang: first, path: `/${rest.join("/")}` };
  return { lang: DEFAULT_LOCALE, path: pathname || "/" };
}

/** The public URL of a site path in a language: ("en", "/shop") → "/en/shop". */
export function localizePath(lang: Locale, path: string) {
  // Leave external, protocol-relative and already-localized links alone.
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const { path: bare } = splitLocale(path);
  if (lang === DEFAULT_LOCALE) return bare;
  return bare === "/" ? `/${lang}` : `/${lang}${bare}`;
}
