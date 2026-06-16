import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/ussd")({
  head: () => ({ meta: [{ title: "USSD Simulator — AgriLink" }] }),
  component: USSD,
});

const SCREENS: Record<string, string> = {
  main: `AGRILINK *789#\n─────────────\n1. Check prices\n2. List produce\n3. My balance\n4. Apply credit\n5. Exit`,
  "1": `CROP PRICES\n──────────\n1. Maize: GHS4.50\n2. Tomato: GHS12.00\n3. Yam: GHS8.00\n0. Back`,
  "2": `LIST PRODUCE\n────────────\nEnter crop name:\n[_____________]\n0. Back`,
  "3": `MY BALANCE\n──────────\nWallet: GHS2,450\nEarnings: GHS12,450\n1. Withdraw\n0. Back`,
  "4": `APPLY CREDIT\n────────────\n1. Input credit\n2. Invoice finance\n3. Insurance\n0. Back`,
};

function USSD() {
  const [screen, setScreen] = useState("main");

  function press(k: string) {
    if (k === "0" || k === "#") return setScreen("main");
    if (screen === "main" && SCREENS[k]) setScreen(k);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl text-center mb-6">
        <h1 className="font-display text-2xl font-semibold">USSD Access</h1>
        <p className="text-sm text-[#64748B] mt-1">For farmers without smartphones</p>
      </div>

      <div className="w-full max-w-2xl rounded-xl border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-4 text-sm text-[#1E293B] mb-6">
        AgriLink works on <strong>ANY</strong> phone. Dial <span className="font-mono font-semibold text-[#2E7D32]">*789#</span> to access prices, list produce, check your balance, and apply for credit — no internet needed.
      </div>

      <div className="w-64 rounded-3xl bg-[#0F172A] border-4 border-slate-700 p-3 shadow-2xl">
        <div className="h-52 rounded-xl bg-[#0a2818] p-3 font-mono text-[11px] leading-snug text-[#4CAF50] whitespace-pre-wrap overflow-hidden">
          {SCREENS[screen]}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {["1","2","3","4","5","6","7","8","9","*","0","#"].map((k) => (
            <button key={k} onClick={() => press(k)} className="aspect-square rounded-full bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 active:bg-[#2E7D32] transition">{k}</button>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#64748B] mt-3"># to go back</p>

      <Link to="/farmer/dashboard" className="mt-6 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#256528]">
        Switch to full app →
      </Link>
    </div>
  );
}
