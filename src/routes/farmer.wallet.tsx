import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";
import { FARMER, FARMER_TRANSACTIONS, ghs } from "@/lib/seed";

export const Route = createFileRoute("/farmer/wallet")({
  head: () => ({ meta: [{ title: "Wallet & Earnings — AgriLink" }] }),
  component: Wallet,
});

function Wallet() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Wallet & Earnings</h1>

      <div className="rounded-xl bg-[#0F172A] text-white p-6">
        <div className="text-xs text-white/60">Available balance</div>
        <div className="mt-2 font-display text-4xl font-bold text-[#F9A825]">{ghs(FARMER.wallet)}</div>
        <div className="mt-2 text-xs text-white/60">Last payout: 12 Jun 2026 via MTN MoMo</div>
        <button onClick={() => setOpen(true)} className="mt-5 w-full rounded-lg bg-[#F9A825] px-4 py-3 text-sm font-semibold text-[#412402] hover:bg-[#e89c1a]">
          Withdraw to MoMo
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard label="This month" value={ghs(4200)} />
        <SummaryCard label="Last month" value={ghs(3100)} />
        <SummaryCard label="Total earned" value={ghs(FARMER.earnings)} />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="font-display font-semibold mb-4">Transaction history</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-right">Amount</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {FARMER_TRANSACTIONS.map((t, i) => (
                <tr key={i}>
                  <td className="py-3 text-[#64748B]">{t.date}</td>
                  <td className="py-3">{t.desc}</td>
                  <td className={`py-3 text-right font-medium ${t.amount > 0 ? "text-[#2E7D32]" : "text-red-600"}`}>{t.amount > 0 ? "+" : ""}{ghs(Math.abs(t.amount))}</td>
                  <td className="py-3 text-[#64748B]">{t.type}</td>
                  <td className="py-3"><span className="text-xs rounded-full px-2 py-0.5 bg-[#DCFCE7] text-[#166534] font-medium">{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && <WithdrawModal onClose={() => setOpen(false)} />}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="text-xs text-[#64748B]">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold text-[#1E293B]">{value}</div>
    </div>
  );
}

function WithdrawModal({ onClose }: { onClose: () => void }) {
  const [provider, setProvider] = useState<"MTN" | "Vodafone">("MTN");
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Withdraw to MoMo</h2>
          <button onClick={onClose} className="text-[#64748B]"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex rounded-lg bg-[#F1F5F9] p-1 mb-4">
          {(["MTN", "Vodafone"] as const).map((p) => (
            <button key={p} onClick={() => setProvider(p)} className={`flex-1 py-2 text-sm font-medium rounded-md ${provider === p ? "bg-white shadow-sm" : "text-[#64748B]"}`}>{p === "MTN" ? "MTN MoMo" : "Vodafone Cash"}</button>
          ))}
        </div>
        <Field label="Phone number"><input className="input" defaultValue={FARMER.phone} /></Field>
        <Field label={`Amount (max ${ghs(FARMER.wallet)})`}><input type="number" max={FARMER.wallet} className="input" placeholder="0.00" /></Field>
        <p className="mt-3 text-xs text-[#64748B]">No withdrawal fee · Arrives within 5 minutes</p>
        <button onClick={onClose} className="mt-5 w-full rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white">Confirm withdrawal</button>
        <style>{`.input { width:100%; padding:0.5rem 0.75rem; border:1px solid #E2E8F0; border-radius:0.5rem; background:white; font-size:0.875rem; outline:none } .input:focus { border-color:#2E7D32 }`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block mb-3"><span className="block text-sm font-medium text-[#1E293B] mb-1.5">{label}</span>{children}</label>;
}
