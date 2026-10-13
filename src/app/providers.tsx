"use client";

import { AuthSheetProvider } from "@/components/layout/auth-sheet";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthSheetProvider>{children}</AuthSheetProvider>;
}
