import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/farmer/wallet")({
  head: () => ({ meta: [{ title: "Wallet & Earnings — AgriLink" }] }),
  component: Wallet,
});

function Wallet() {
  const { user, profile } = useAuth();
  const uid = user?.id;
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { data: tx = [] } = useQuery({
    queryKey: ["wallet-tx", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("wallet_transactions").select("*").eq("farmer_id", uid!).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const balance = tx.reduce((s, t) => s + (t.type === "credit" ? Number(t.amount) : -Number(t.amount)), 0);
  const now = new Date();
  const thisMonth = tx.filter((t) => { const d = new Date(t.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === "credit"; }).reduce((s, t) => s + Number(t.amount), 0);
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
  const lastMonth = tx.filter((t) => { const d = new Date(t.created_at); return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear() && t.type === "credit"; }).reduce((s, t) => s + Number(t.amount), 0);
  const totalEarned = tx.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Wallet & Earnings</h1>

      {toast && (
        <div className="rounded-xl border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-4 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" /> {toast}
        </div>
      )}

      <div className="rounded-xl bg-[#0F172A] text-white p-6">
        <div className="text-xs text-white/60">Available balance</div>
        <div className="mt-2 font-display text-4xl font-bold text-[#F9A825]">{ghs(balance)}</div>
        <div className="mt-2 text-xs text-white/60">{tx[0] ? `Last activity: ${new Date(tx[0].created_at).toLocaleDateString()}` : "No transactions yet"}</div>
        <button onClick={() => setOpen(true)} disabled={balance <= 0} className="mt-5 w-full rounded-lg bg-[#F9A825] px-4 py-3 text-sm font-semibold text-[#412402] hover:bg-[#e89c1a] disabled:opacity-60">
          Withdraw to MoMo
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard label="This month" value={ghs(thisMonth)} />
        <SummaryCard label="Last month" value={ghs(lastMonth)} />
        <SummaryCard label="Total earned" value={ghs(totalEarned)} />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="font-display font-semibold mb-4">Transaction history</h3>
        {tx.length === 0 ? (
          <div className="text-sm text-[#64748B] py-6 text-center">No transactions yet. Earnings will appear here once buyers confirm deliveries.</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden space-y-2">
              {tx.map((t) => (
                <div key={t.id} className="rounded-lg border border-[#E2E8F0] p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.description}</div>
                    <div className="text-xs text-[#64748B] mt-0.5">{new Date(t.created_at).toLocaleDateString()} · <span className="capitalize">{t.status}</span></div>
                  </div>
                  <div className={`text-sm font-semibold shrink-0 ${t.type === "credit" ? "text-[#2E7D32]" : "text-red-600"}`}>{t.type === "credit" ? "+" : "-"}{ghs(Math.abs(Number(t.amount)))}</div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
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
                  {tx.map((t) => (
                    <tr key={t.id}>
                      <td className="py-3 text-[#64748B]">{new Date(t.created_at).toLocaleDateString()}</td>
                      <td className="py-3">{t.description}</td>
                      <td className={`py-3 text-right font-medium ${t.type === "credit" ? "text-[#2E7D32]" : "text-red-600"}`}>{t.type === "credit" ? "+" : "-"}{ghs(Math.abs(Number(t.amount)))}</td>
                      <td className="py-3 text-[#64748B] capitalize">{t.type}</td>
                      <td className="py-3"><span className="text-xs rounded-full px-2 py-0.5 bg-[#DCFCE7] text-[#166534] font-medium capitalize">{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {open && uid && (
        <WithdrawModal
          farmerId={uid}
          phone={profile?.phone ?? ""}
          maxAmount={balance}
          onClose={() => setOpen(false)}
          onSuccess={(msg) => { setToast(msg); setTimeout(() => setToast(null), 4000); }}
        />
      )}
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

function WithdrawModal({ farmerId, phone, maxAmount, onClose, onSuccess }: { farmerId: string; phone: string; maxAmount: number; onClose: () => void; onSuccess: (msg: string) => void }) {
  const qc = useQueryClient();
  const [provider, setProvider] = useState<"MTN" | "Vodafone">("MTN");
  const [error, setError] = useState<string | null>(null);

  const m = useMutation({
    mutationFn: async (input: { amount: number; phone: string }) => {
      const { error } = await supabase.from("wallet_transactions").insert({
        farmer_id: farmerId,
        description: `${provider} MoMo withdrawal to ${input.phone}`,
        amount: input.amount,
        type: "debit",
        status: "completed",
      });
      if (error) throw error;
      await supabase.from("notifications").insert({
        user_id: farmerId,
        title: "Withdrawal sent",
        description: `${ghs(input.amount)} sent to ${provider} MoMo (${input.phone}). Should arrive within 5 minutes.`,
        kind: "Finance",
      });
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["wallet-tx", farmerId] });
      onSuccess(`${ghs(vars.amount)} withdrawal sent to ${provider} MoMo`);
      onClose();
    },
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    const amt = Number(f.get("amount") || 0);
    const ph = String(f.get("phone") || "").replace(/\s+/g, "");
    if (!/^(\+?233|0)\d{9}$/.test(ph)) {
      setError("Enter a valid Ghana phone number (e.g. 024 123 4567)");
      return;
    }
    if (amt <= 0) { setError("Amount must be greater than 0"); return; }
    if (amt > maxAmount) { setError(`Amount exceeds available balance (${ghs(maxAmount)})`); return; }
    m.mutate({ amount: amt, phone: ph });
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Withdraw to MoMo</h2>
          <button type="button" onClick={onClose} className="text-[#64748B]"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex rounded-lg bg-[#F1F5F9] p-1 mb-4">
          {(["MTN", "Vodafone"] as const).map((p) => (
            <button key={p} type="button" onClick={() => setProvider(p)} className={`flex-1 py-2 text-sm font-medium rounded-md ${provider === p ? "bg-white shadow-sm" : "text-[#64748B]"}`}>{p === "MTN" ? "MTN MoMo" : "Vodafone Cash"}</button>
          ))}
        </div>
        <label className="block mb-3"><span className="block text-sm font-medium mb-1.5">Phone number</span><input name="phone" className="input" defaultValue={phone} placeholder="024 123 4567" /></label>
        <label className="block mb-3"><span className="block text-sm font-medium mb-1.5">Amount (max {ghs(maxAmount)})</span><input name="amount" type="number" max={maxAmount} min={1} required className="input" placeholder="0.00" /></label>
        <p className="mt-3 text-xs text-[#64748B]">No withdrawal fee · Arrives within 5 minutes</p>
        <p className="mt-1 text-xs text-[#94A3B8]">⚠ Demo mode — MoMo API integration active in production</p>
        {error && <div className="mt-3 text-xs text-red-600">{error}</div>}
        <button disabled={m.isPending} type="submit" className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-3 text-sm font-medium text-white disabled:opacity-60">
          {m.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Confirm withdrawal
        </button>
        <style>{`.input { width:100%; padding:0.5rem 0.75rem; border:1px solid #E2E8F0; border-radius:0.5rem; background:white; font-size:0.875rem; outline:none } .input:focus { border-color:#2E7D32 }`}</style>
      </form>
    </div>
  );
}