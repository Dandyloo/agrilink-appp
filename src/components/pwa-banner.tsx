// src/components/pwa-banner.tsx
import { WifiOff, Download, X, Share, ArrowDown } from "lucide-react";
import { useState } from "react";
import { usePWA } from "@/hooks/use-pwa";

export function PWABanner() {
  const { isOnline, installPrompt, promptInstall, isInstalled, isIOS } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Don't show nudge if already installed as standalone
  const showNudge = !isInstalled && !dismissed;

  return (
    <>
      {/* ── Offline strip ── */}
      {!isOnline && (
        <div className="flex items-center gap-2 bg-[#FEF3C7] border-b border-[#F59E0B] px-4 py-2.5 text-sm text-[#92400E]">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>You're offline — cached pages available. Data syncs when reconnected.</span>
        </div>
      )}

      {/* ── Android/Chrome install nudge ── */}
      {showNudge && installPrompt && (
        <div className="flex items-center gap-3 bg-[#E8F5E9] border-b border-[#A5D6A7] px-4 py-2.5 text-sm text-[#1B5E20]">
          <Download className="h-4 w-4 shrink-0" />
          <span className="flex-1">Install AgriLink on your phone for offline access.</span>
          <button
            onClick={promptInstall}
            className="rounded-lg bg-[#2E7D32] px-3 py-1 text-xs font-semibold text-white hover:bg-[#256528]"
          >
            Install
          </button>
          <button onClick={() => setDismissed(true)} className="text-[#64748B]" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── iOS install nudge ── */}
      {showNudge && isIOS && !installPrompt && (
        <div className="flex items-center gap-3 bg-[#E8F5E9] border-b border-[#A5D6A7] px-4 py-2.5 text-sm text-[#1B5E20]">
          <Download className="h-4 w-4 shrink-0" />
          <span className="flex-1">Add AgriLink to your Home Screen for the best experience.</span>
          <button
            onClick={() => setShowIOSGuide(true)}
            className="rounded-lg bg-[#2E7D32] px-3 py-1 text-xs font-semibold text-white hover:bg-[#256528]"
          >
            How?
          </button>
          <button onClick={() => setDismissed(true)} className="text-[#64748B]" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── iOS step-by-step modal ── */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center p-4"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold">Add AgriLink to Home Screen</h2>
              <button onClick={() => setShowIOSGuide(false)}>
                <X className="h-5 w-5 text-[#64748B]" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Share className="h-5 w-5 text-[#007AFF]" />,
                  step: "1",
                  text: 'Tap the Share button at the bottom of your Safari browser',
                },
                {
                  icon: <ArrowDown className="h-5 w-5 text-[#2E7D32]" />,
                  step: "2",
                  text: 'Scroll down and tap "Add to Home Screen"',
                },
                {
                  icon: <span className="text-lg">✅</span>,
                  step: "3",
                  text: 'Tap "Add" — AgriLink will appear on your Home Screen like a native app',
                },
              ].map(({ icon, step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1F5F9]">
                    {icon}
                  </div>
                  <p className="text-sm text-[#1E293B] pt-1">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs text-[#64748B]">
              💡 Works in <strong>Safari</strong> only — not Chrome or Firefox on iOS.
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-lg bg-[#2E7D32] py-2.5 text-sm font-semibold text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}