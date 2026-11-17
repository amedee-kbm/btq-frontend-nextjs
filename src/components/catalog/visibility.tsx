"use client";

import { createContext, useContext } from "react";

/** The admin's storefront switches, read once in the layout. Default: shown. */
export type Visibility = { prices: boolean; swatches: boolean };

const VisibilityContext = createContext<Visibility>({
  prices: true,
  swatches: true,
});

export function VisibilityProvider({
  value,
  children,
}: {
  value: Visibility;
  children: React.ReactNode;
}) {
  return (
    <VisibilityContext.Provider value={value}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useShowPrices() {
  return useContext(VisibilityContext).prices;
}

export function useShowSwatches() {
  return useContext(VisibilityContext).swatches;
}

/** Renders its children only while prices are shown; for server components. */
export function IfPricesShown({ children }: { children: React.ReactNode }) {
  return useShowPrices() ? children : null;
}
