"use client";

import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_NAMES,
  LOCALE_TAGS,
  LOCALES,
  type Locale,
  localizePath,
  splitLocale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Links to this page in each language. The choice is remembered, so later
 * visits to unprefixed links (a TikTok bio, a shared product) open in it too.
 */
export function LanguageSwitcher({
  full = false,
  className,
}: {
  /** "Kinyarwanda · English" instead of "RW · EN". */
  full?: boolean;
  className?: string;
}) {
  const { lang, t } = useI18n();
  const { path } = splitLocale(usePathname());

  const choose = (locale: Locale, link: HTMLAnchorElement) => {
    // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is too new for older phones
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    // Keep filters, search and the picked size/colour.
    link.href = `${localizePath(locale, path)}${window.location.search}`;
  };

  return (
    <ul
      aria-label={t.language.label}
      className={cn("flex items-center", className)}
    >
      {LOCALES.map((locale, i) => (
        <li key={locale} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="px-1.5 opacity-50">
              ·
            </span>
          )}
          {/* A full page load, so <html lang> and cached pages follow. */}
          <a
            href={localizePath(locale, path)}
            hrefLang={LOCALE_TAGS[locale]}
            lang={locale}
            aria-label={full ? undefined : LOCALE_NAMES[locale]}
            aria-current={locale === lang ? "true" : undefined}
            onClick={(event) => choose(locale, event.currentTarget)}
            className={cn(
              "transition-colors hover:text-brand",
              locale === lang ? "font-bold" : "opacity-75",
            )}
          >
            {full ? LOCALE_NAMES[locale] : locale.toUpperCase()}
          </a>
        </li>
      ))}
    </ul>
  );
}
