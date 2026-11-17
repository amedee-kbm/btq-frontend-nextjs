"use client";

import { HeartIcon } from "@phosphor-icons/react";
import { createContext, useCallback, useContext, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/link";
import { useI18n } from "@/i18n/provider";
import { rememberPendingFavorite } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

type AuthSheetContextValue = {
  /** Opens the "create an account" sheet; `slug` is saved after auth. */
  openAuthSheet: (slug?: string, next?: string) => void;
};

const AuthSheetContext = createContext<AuthSheetContextValue>({
  openAuthSheet: () => {},
});

export function useAuthSheet() {
  return useContext(AuthSheetContext);
}

export function AuthSheetProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { t } = useI18n();

  // Reads the current URL at tap time (not via useSearchParams, which would
  // force every static page to render on the client).
  const openAuthSheet = useCallback((slug?: string, next?: string) => {
    rememberPendingFavorite(slug ?? null);
    const params = new URLSearchParams({
      next: next ?? `${window.location.pathname}${window.location.search}`,
    });
    if (slug) params.set("fav", slug);
    setQuery(params.toString());
    setOpen(true);
  }, []);

  return (
    <AuthSheetContext.Provider value={{ openAuthSheet }}>
      {children}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="mx-auto w-full max-w-md pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:bottom-6 sm:border"
        >
          <SheetHeader className="items-center pt-8 text-center">
            <HeartIcon size={32} weight="fill" className="text-brand" />
            <SheetTitle className="text-xl font-bold">
              {t.authSheet.title}
            </SheetTitle>
            <SheetDescription>{t.authSheet.description}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            <Link
              href={`/login?${query}`}
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              {t.common.signIn}
            </Link>
            <Link
              href={`/register?${query}`}
              onClick={() => setOpen(false)}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full",
              )}
            >
              {t.common.register}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </AuthSheetContext.Provider>
  );
}
