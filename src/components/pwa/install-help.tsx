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
import { cn } from "@/lib/utils";

const STEPS = {
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
};

/** The by-hand steps for browsers with no install dialog. */
export function InstallSteps({
  method,
  className,
}: {
  method: keyof typeof STEPS;
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col gap-3", className)}>
      {STEPS[method].map(({ id, Icon, text }) => (
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
  method: keyof typeof STEPS;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-w-md pb-[env(safe-area-inset-bottom)] md:bottom-4 md:border"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">
            Get the Bukiaa app
          </SheetTitle>
          <SheetDescription>
            {method === "ios"
              ? "Add Bukiaa to your home screen. It opens full screen, loads faster and keeps the pieces you've viewed for when you're offline."
              : "This app's built-in browser can't install apps. Open Bukiaa in your phone's browser first."}
          </SheetDescription>
        </SheetHeader>
        <InstallSteps method={method} className="px-4" />
        <SheetFooter>
          <SheetClose render={<Button size="lg">Got it</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
