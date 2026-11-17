"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useI18n } from "@/i18n/provider";
import { InstallHelpSheet } from "./install-help";

/** Chromium's install event; not in the DOM typings. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * How this browser can install the app:
 * - "prompt": Chromium, which gives us a native install dialog
 * - "ios": Safari and friends, where the user adds it from the Share menu
 * - "in-app": Instagram/TikTok/Facebook browsers, which can't install at all
 */
export type InstallMethod = "prompt" | "ios" | "in-app";

type Pwa = {
  /** Running as the installed app. */
  isStandalone: boolean;
  /** Null when the app is installed or this browser can't install it. */
  installMethod: InstallMethod | null;
  /** Opens the native dialog, or instructions where there is none. */
  install: () => Promise<void>;
};

const PwaContext = createContext<Pwa>({
  isStandalone: false,
  installMethod: null,
  install: async () => {},
});

export const usePwa = () => useContext(PwaContext);

const IN_APP_BROWSER =
  /FBAN|FBAV|FB_IAB|Instagram|BytedanceWebview|musical_ly|TikTok|Snapchat|Line\//i;

function detectStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function detectIOS() {
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac.
  return (
    /iPhone|iPad|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)
  );
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [fallback, setFallback] = useState<"ios" | "in-app" | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const { t } = useI18n();

  // biome-ignore lint/correctness/useExhaustiveDependencies: listeners are set up once; the language is fixed per page load
  useEffect(() => {
    setIsStandalone(detectStandalone());
    if (IN_APP_BROWSER.test(navigator.userAgent)) setFallback("in-app");
    else if (detectIOS()) setFallback("ios");

    const standalone = window.matchMedia("(display-mode: standalone)");
    const onDisplayChange = () => setIsStandalone(detectStandalone());
    const onPrompt = (event: Event) => {
      // Keep Chrome's mini-infobar away; we offer install at a better moment.
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setPromptEvent(null);
      toast.success(t.pwa.installedTitle, {
        description: t.pwa.installedText,
      });
    };

    standalone.addEventListener("change", onDisplayChange);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      standalone.removeEventListener("change", onDisplayChange);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useServiceWorker();
  useNetworkStatus();

  const installMethod: InstallMethod | null = isStandalone
    ? null
    : promptEvent
      ? "prompt"
      : fallback;

  const install = useCallback(async () => {
    if (!promptEvent) {
      setHelpOpen(true);
      return;
    }
    await promptEvent.prompt();
    await promptEvent.userChoice;
    // The event can only be used once.
    setPromptEvent(null);
  }, [promptEvent]);

  const value = useMemo(
    () => ({ isStandalone, installMethod, install }),
    [isStandalone, installMethod, install],
  );

  return (
    <PwaContext.Provider value={value}>
      {children}
      {fallback && (
        <InstallHelpSheet
          method={fallback}
          open={helpOpen}
          onOpenChange={setHelpOpen}
        />
      )}
    </PwaContext.Provider>
  );
}

// Check for a new version at most this often while the app stays open.
const UPDATE_CHECK_MS = 60 * 60 * 1000;

function useServiceWorker() {
  const { t } = useI18n();
  // biome-ignore lint/correctness/useExhaustiveDependencies: register once; the language is fixed per page load
  useEffect(() => {
    // In dev the worker would serve stale bundles over hot reload.
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;
    let lastCheck = Date.now();
    // Only reload for an update the user asked for, not the first install's
    // clients.claim().
    let updateRequested = false;

    const offerUpdate = (worker: ServiceWorker) => {
      toast(t.pwa.updateReady, {
        id: "sw-update",
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: t.pwa.refresh,
          onClick: () => {
            updateRequested = true;
            worker.postMessage({ type: "SKIP_WAITING" });
          },
        },
      });
    };

    const watch = (reg: ServiceWorkerRegistration) => {
      if (reg.waiting && navigator.serviceWorker.controller) {
        offerUpdate(reg.waiting);
      }
      reg.addEventListener("updatefound", () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", () => {
          // No controller yet means a first install, not an update.
          if (
            worker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            offerUpdate(worker);
          }
        });
      });
    };

    const onControllerChange = () => {
      if (!updateRequested) return;
      updateRequested = false;
      window.location.reload();
    };

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastCheck < UPDATE_CHECK_MS) return;
      lastCheck = Date.now();
      registration?.update().catch(() => {});
    };

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((reg) => {
        registration = reg;
        watch(reg);
      })
      .catch(() => {});
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
}

function useNetworkStatus() {
  const { t } = useI18n();
  // biome-ignore lint/correctness/useExhaustiveDependencies: listen once; the language is fixed per page load
  useEffect(() => {
    const onOffline = () =>
      toast.warning(t.pwa.offlineTitle, {
        id: "network",
        description: t.pwa.offlineText,
        duration: Number.POSITIVE_INFINITY,
      });
    const onOnline = () =>
      toast.success(t.pwa.backOnline, { id: "network", duration: 3000 });

    if (!navigator.onLine) onOffline();
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);
}
