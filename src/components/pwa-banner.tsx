// src/components/pwa-banner.tsx
// Drop this inside your root layout (farmer.tsx / buyer.tsx) just above <main>.
// Shows: offline warning strip, and "Add to Home Screen" nudge.
import { WifiOff, Download, X } from "lucide-react";
import { useState } from "react";
import { usePWA } from "@/hooks/use-pwa";

export function PWABanner() {
  const { isOnline, installPrompt, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      {/* Offline strip — always shows when offline */}
      {!isOnline && (
        <div className="flex items-center gap-2 bg-[#FEF3C7] border-b border-[#F59E0B] px-4 py-2.5 text-sm text-[#92400E]">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>
            You're offline. Cached pages are available; new data will sync when
            you reconnect.
          </span>
        </div>
      )}

      {/* Install nudge — shows once, dismissable */}
      {installPrompt && !dismissed && (
        <div className="flex items-center gap-3 bg-[#E8F5E9] border-b border-[#A5D6A7] px-4 py-2.5 text-sm text-[#1B5E20]">
          <Download className="h-4 w-4 shrink-0" />
          <span className="flex-1">
            Install AgriLink on your phone for offline access and faster loading.
          </span>
          <button
            onClick={promptInstall}
            className="rounded-lg bg-[#2E7D32] px-3 py-1 text-xs font-semibold text-white hover:bg-[#256528]"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#64748B] hover:text-[#1E293B]"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  );
}