import type { Metadata } from "next";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_TAGS,
  LOCALES,
  type Locale,
  localizePath,
} from "./config";
import { type Dictionary, en } from "./dictionaries/en";
import { rw } from "./dictionaries/rw";

export * from "./config";
export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { rw, en };

/** Strings for a language; unknown values (never routed) fall back to the default. */
export function getDictionary(lang: string): Dictionary {
  return dictionaries[isLocale(lang) ? lang : DEFAULT_LOCALE];
}

/** The `lang` route param, narrowed (proxy.ts only ever routes known languages). */
export function toLocale(lang: string): Locale {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/** Canonical URL plus hreflang links to the same page in every language. */
export function languageAlternates(
  lang: string,
  path: string,
): Metadata["alternates"] {
  const languages: Record<string, string> = {
    "x-default": localizePath(DEFAULT_LOCALE, path),
  };
  for (const locale of LOCALES) {
    languages[LOCALE_TAGS[locale]] = localizePath(locale, path);
  }
  return { canonical: localizePath(toLocale(lang), path), languages };
}
