"use client";

import { createContext, useContext } from "react";

// The admin's "show prices" switch, read once in the layout. Defaults to shown.
const ShowPricesContext = createContext(true);

export function ShowPricesProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <ShowPricesContext.Provider value={value}>
      {children}
    </ShowPricesContext.Provider>
  );
}

export function useShowPrices() {
  return useContext(ShowPricesContext);
}

/** Renders its children only while prices are shown; for server components. */
export function IfPricesShown({ children }: { children: React.ReactNode }) {
  return useShowPrices() ? children : null;
}
