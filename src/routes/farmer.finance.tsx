import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ghs } from "@/lib/seed";

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
    </div>
  );
}

function InputCredit() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <p className="text-sm text-[#1E293B]">Get seeds, fertilizer and farm inputs now. Repay at harvest.</p>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
        <h3 className="font-display font-semibold">Apply for input credit</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <Field label="Crop type"><select className="input"><option>Maize</option><option>Tomatoes</option><option>Yam</option><option>Cocoa</option></select></Field>
          <Field label="Amount needed (GHS)"><input type="number" className="input" placeholder="1200" /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> My cooperative will guarantee this loan</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Repay at harvest</label>
        <button className="rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#256528]">Submit application</button>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="font-display font-semibold mb-4">Application status</h3>
        <Stepper steps={["Submitted", "Under Review", "Approved", "Disbursed"]} active={2} />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="font-display font-semibold mb-3">Past applications</h3>
        <div className="space-y-2 text-sm">
          {[
            { date: "10 May 2026", amount: 1200, crop: "Maize", status: "Disbursed" },
            { date: "3 Mar 2026", amount: 800, crop: "Tomatoes", status: "Repaid" },
          ].map((p) => (
            <div key={p.date} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] p-3">
              <div>
                <div className="font-medium">{p.crop} · {ghs(p.amount)}</div>
                <div className="text-xs text-[#64748B]">{p.date}</div>
              </div>
              <span className="text-xs rounded-full px-2 py-0.5 bg-[#DCFCE7] text-[#166534] font-medium">{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InvoiceFinance() {
  const [amt, setAmt] = useState(5000);
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <p className="text-sm">Sell your invoice to us. Get <strong>80% upfront</strong>, 20% on delivery.</p>
      </div>
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
        <h3 className="font-display font-semibold">Invoice details</h3>
        <Field label="Invoice amount (GHS)"><input type="number" className="input" value={amt} onChange={(e) => setAmt(Number(e.target.value) || 0)} /></Field>
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-4">
          <div className="text-xs text-[#64748B]">You receive within 24 hours</div>
          <div className="font-display text-2xl font-bold text-[#F9A825] mt-1">{ghs(amt * 0.8)}</div>
        </div>
        <Field label="Expected delivery date"><input type="date" className="input" /></Field>
        <Field label="Buyer name"><input className="input" placeholder="e.g. Greenfield Foods" /></Field>
        <p className="text-xs text-[#64748B]">AgriLink retains 5% commission on the remaining 20%</p>
        <button className="rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white">Submit invoice</button>
      </div>
    </div>
  );
}

function Insurance() {
  const [selected, setSelected] = useState("standard");
  const plans = [
    { id: "basic", name: "Basic", price: 50, desc: "Covers weather damage" },
    { id: "standard", name: "Standard", price: 120, desc: "Covers weather + pests + 10% price drop" },
    { id: "premium", name: "Premium", price: 250, desc: "Full coverage + crop loss guarantee" },
  ];
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
      <button className="rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white">Apply for insurance</button>
    </div>
  );
}

function Stepper({ steps, active }: { steps: string[]; active: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${i <= active ? "bg-[#2E7D32] text-white" : "bg-slate-100 text-slate-400"}`}>{i + 1}</div>
          <span className={`text-xs flex-1 ${i <= active ? "text-[#1E293B] font-medium" : "text-[#64748B]"}`}>{s}</span>
          {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < active ? "bg-[#2E7D32]" : "bg-slate-200"}`} />}
        </div>
      ))}
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
