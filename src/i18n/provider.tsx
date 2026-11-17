"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale, localizePath } from "./config";
import type { Dictionary } from "./dictionaries/en";
import { en } from "./dictionaries/en";
import { rw } from "./dictionaries/rw";

const dictionaries: Record<Locale, Dictionary> = { rw, en };

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Set once in the root layout from the `lang` route param. */
export function I18nProvider({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={lang}>{children}</LocaleContext.Provider>
  );
}

/** The current language, its strings, and `href` to localize a site path. */
export function useI18n() {
  const lang = useContext(LocaleContext);
  return {
    lang,
    t: dictionaries[lang],
    href: (path: string) => localizePath(lang, path),
  };
}
