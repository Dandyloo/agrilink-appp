import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/farmer/finance")({
  head: () => ({ meta: [{ title: "Finance Hub — AgriLink" }] }),
  component: FinanceHub,
});

function FinanceHub() {
  const [tab, setTab] = useState<"input" | "invoice" | "insurance">("input");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Finance Hub</h1>
        <p className="text-sm text-[#64748B] mt-1">Access credit, invoice financing and crop insurance</p>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-4 text-sm text-[#1E293B]">
        Powered by <strong>AgriLink Finance</strong> — partnered with BOG-licensed micro-finance institutions
      </div>

      <div className="flex gap-2 border-b border-[#E2E8F0] overflow-x-auto">
        {[
          { id: "input", label: "Input Credit" },
          { id: "invoice", label: "Invoice Financing" },
          { id: "insurance", label: "Crop Insurance" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as "input" | "invoice" | "insurance")} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === t.id ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "input" && <InputCredit />}
      {tab === "invoice" && <InvoiceFinance />}
      {tab === "insurance" && <Insurance />}

      <PastApplications />
    </div>
  );
}

function useSubmitApplication() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { type: "input_credit" | "invoice_financing" | "insurance"; amount: number; crop_type?: string }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase.from("credit_applications").insert({ ...payload, farmer_id: user.id, status: "submitted" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["credit-apps"] }),
  });
}

function InputCredit() {
  const m = useSubmitApplication();
  const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    await m.mutateAsync({ type: "input_credit", amount: Number(f.get("amount") || 0), crop_type: String(f.get("crop") || "") });
    setDone(true); setTimeout(() => setDone(false), 3000);
    (e.target as HTMLFormElement).reset();
  }
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <p className="text-sm text-[#1E293B]">Get seeds, fertilizer and farm inputs now. Repay at harvest.</p>
      </div>
      <form onSubmit={submit} className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
        <h3 className="font-display font-semibold">Apply for input credit</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Field label="Crop type"><select name="crop" className="input"><option>Maize</option><option>Tomatoes</option><option>Yam</option><option>Cocoa</option></select></Field>
          <Field label="Amount needed (GHS)"><input name="amount" type="number" required min={1} className="input" placeholder="1200" /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> My cooperative will guarantee this loan</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Repay at harvest</label>
        {m.error && <div className="text-xs text-red-600">{(m.error as Error).message}</div>}
        {done && <div className="text-xs text-[#2E7D32]">✓ Application submitted</div>}
        <button type="submit" disabled={m.isPending} className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#256528] disabled:opacity-60">
          {m.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Submit application
        </button>
      </form>
    </div>
  );
}

function InvoiceFinance() {
  const m = useSubmitApplication();
  const [amt, setAmt] = useState(5000);
  const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await m.mutateAsync({ type: "invoice_financing", amount: amt });
    setDone(true); setTimeout(() => setDone(false), 3000);
  }
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <p className="text-sm">Sell your invoice to us. Get <strong>80% upfront</strong>, 20% on delivery.</p>
      </div>
      <form onSubmit={submit} className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
        <h3 className="font-display font-semibold">Invoice details</h3>
        <Field label="Invoice amount (GHS)"><input type="number" required className="input" value={amt} onChange={(e) => setAmt(Number(e.target.value) || 0)} /></Field>
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="text-xs text-[#64748B]">You receive within 24 hours</div>
          <div className="font-display text-2xl font-bold text-[#F9A825] mt-1">{ghs(amt * 0.8)}</div>
        </div>
        <Field label="Expected delivery date"><input type="date" className="input" /></Field>
        <Field label="Buyer name"><input className="input" placeholder="e.g. Greenfield Foods" /></Field>
        <p className="text-xs text-[#64748B]">AgriLink retains 5% commission on the remaining 20%</p>
        {done && <div className="text-xs text-[#2E7D32]">✓ Invoice submitted</div>}
        <button type="submit" disabled={m.isPending} className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {m.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Submit invoice
        </button>
      </form>
    </div>
  );
}

function Insurance() {
  const m = useSubmitApplication();
  const [selected, setSelected] = useState("standard");
  const [done, setDone] = useState(false);
  const plans = [
    { id: "basic", name: "Basic", price: 50, desc: "Covers weather damage" },
    { id: "standard", name: "Standard", price: 120, desc: "Covers weather + pests + 10% price drop" },
    { id: "premium", name: "Premium", price: 250, desc: "Full coverage + crop loss guarantee" },
  ];
  const plan = plans.find((p) => p.id === selected)!;
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <p className="text-sm">Protect your harvest from weather, pests, and market price shocks.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {plans.map((p) => (
          <button key={p.id} onClick={() => setSelected(p.id)} className={`text-left rounded-xl border-2 p-5 bg-white transition ${selected === p.id ? "border-[#2E7D32]" : "border-[#E2E8F0] hover:border-[#4CAF50]"}`}>
            <div className="font-display font-semibold">{p.name}</div>
            <div className="mt-2 font-display text-2xl font-bold">{ghs(p.price)}<span className="text-sm font-normal text-[#64748B]">/season</span></div>
            <div className="mt-2 text-xs text-[#64748B]">{p.desc}</div>
          </button>
        ))}
      </div>
      {done && <div className="text-xs text-[#2E7D32]">✓ Insurance application submitted</div>}
      <button onClick={async () => { await m.mutateAsync({ type: "insurance", amount: plan.price, crop_type: plan.name }); setDone(true); setTimeout(() => setDone(false), 3000); }} disabled={m.isPending} className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
        {m.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Apply for insurance
      </button>
    </div>
  );
}

function PastApplications() {
  const { user } = useAuth();
  const { data: apps = [] } = useQuery({
    queryKey: ["credit-apps", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("credit_applications").select("*").eq("farmer_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  if (apps.length === 0) return null;
  const labels: Record<string, string> = { input_credit: "Input Credit", invoice_financing: "Invoice Financing", insurance: "Insurance" };
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <h3 className="font-display font-semibold mb-3">Past applications</h3>
      <div className="space-y-2 text-sm">
        {apps.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-3">
            <div>
              <div className="font-medium">{labels[p.type]} · {ghs(Number(p.amount))}</div>
              <div className="text-xs text-[#64748B]">{p.crop_type ?? ""} · {new Date(p.created_at).toLocaleDateString()}</div>
            </div>
            <span className="text-xs rounded-full px-2 py-0.5 bg-[#FFF8E1] text-[#7A5C0E] font-medium capitalize">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[#1E293B] mb-1.5">{label}</span>
      {children}
      <style>{`.input { width:100%; padding:0.5rem 0.75rem; border:1px solid #E2E8F0; border-radius:0.5rem; background:white; font-size:0.875rem; outline:none } .input:focus { border-color:#2E7D32 }`}</style>
    </label>
  );
}
