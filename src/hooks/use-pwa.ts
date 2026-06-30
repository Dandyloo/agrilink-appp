// src/hooks/use-pwa.ts
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function detectIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS 13+ reports as MacIntel but has touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function detectAndroid() {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

export function usePWA() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swReady, setSwReady] = useState(false);
  const [isIOS] = useState(detectIOS);
  const [isAndroid] = useState(detectAndroid);

  useEffect(() => {
    // ── Register service worker ──
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(() => setSwReady(true))
        .catch(console.error);
    }

    // ── Online / offline ──
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    // ── Install prompt (Android / Chrome only) ──
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Already installed (standalone / display-mode)
    const mq = window.matchMedia("(display-mode: standalone)");
    if (mq.matches) setIsInstalled(true);
    const mqHandler = (e: MediaQueryListEvent) => { if (e.matches) setIsInstalled(true); };
    mq.addEventListener("change", mqHandler);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("beforeinstallprompt", handler);
      mq.removeEventListener("change", mqHandler);
    };
  }, []);

  async function promptInstall() {
    if (!installPrompt) return false;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
    return outcome === "accepted";
  }

  return {
    isOnline,
    isInstalled,
    installPrompt: !!installPrompt,
    promptInstall,
    swReady,
    isIOS,
    isAndroid,
  };
}