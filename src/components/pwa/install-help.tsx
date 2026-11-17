"use client";

import {
  DotsThreeIcon,
  ExportIcon,
  PlusSquareIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

type Method = "ios" | "in-app";
type Step = { id: number; Icon: typeof ExportIcon; text: React.ReactNode };

// Button names follow what each browser shows, which is usually in English.
const STEPS: Record<Locale, Record<Method, Step[]>> = {
  en: {
    ios: [
      {
        id: 1,
        Icon: ExportIcon,
        text: (
          <>
            Tap <strong>Share</strong> in the browser bar
          </>
        ),
      },
      {
        id: 2,
        Icon: PlusSquareIcon,
        text: (
          <>
            Scroll down and tap <strong>Add to Home Screen</strong>
          </>
        ),
      },
    ],
    "in-app": [
      {
        id: 3,
        Icon: DotsThreeIcon,
        text: (
          <>
            Tap the <strong>⋯</strong> menu at the top of this screen
          </>
        ),
      },
      {
        id: 4,
        Icon: ExportIcon,
        text: (
          <>
            Choose <strong>Open in browser</strong>, then install from there
          </>
        ),
      },
    ],
  },
  rw: {
    ios: [
      {
        id: 1,
        Icon: ExportIcon,
        text: (
          <>
            Kanda <strong>Share</strong> mu murongo wa mushakisha
          </>
        ),
      },
      {
        id: 2,
        Icon: PlusSquareIcon,
        text: (
          <>
            Manuka, ukande <strong>Add to Home Screen</strong>
          </>
        ),
      },
    ],
    "in-app": [
      {
        id: 3,
        Icon: DotsThreeIcon,
        text: (
          <>
            Kanda menu ya <strong>⋯</strong> iri hejuru kuri iyi ecran
          </>
        ),
      },
      {
        id: 4,
        Icon: ExportIcon,
        text: (
          <>
            Hitamo <strong>Open in browser</strong>, hanyuma uyishyiremo uhereye
            aho
          </>
        ),
      },
    ],
  },
};

/** The by-hand steps for browsers with no install dialog. */
export function InstallSteps({
  method,
  className,
}: {
  method: Method;
  className?: string;
}) {
  const { lang } = useI18n();
  return (
    <ol className={cn("flex flex-col gap-3", className)}>
      {STEPS[lang][method].map(({ id, Icon, text }) => (
        <li key={id} className="flex items-center gap-3 text-sm">
          <span className="grid size-9 shrink-0 place-items-center bg-bone text-action">
            <Icon size={20} aria-hidden="true" />
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  );
}

/** Where browsers have no install dialog: how to add the app by hand. */
export function InstallHelpSheet({
  method,
  open,
  onOpenChange,
}: {
  method: Method;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-md pb-[env(safe-area-inset-bottom)] md:bottom-4 md:border"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">
            {t.pwa.getTheApp}
          </SheetTitle>
          <SheetDescription>
            {method === "ios" ? t.pwa.iosHelp : t.pwa.inAppHelp}
          </SheetDescription>
        </SheetHeader>
        <InstallSteps method={method} className="px-4" />
        <SheetFooter>
          <SheetClose render={<Button size="lg">{t.pwa.gotIt}</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
