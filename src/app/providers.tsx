"use client";

import { AuthSheetProvider } from "@/components/layout/auth-sheet";
import { InstallBanner } from "@/components/pwa/install-banner";
import { PwaProvider } from "@/components/pwa/pwa-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PwaProvider>
      <AuthSheetProvider>{children}</AuthSheetProvider>
      <InstallBanner />
    </PwaProvider>
  );
}
