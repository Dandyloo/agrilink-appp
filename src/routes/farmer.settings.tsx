import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FARMER, REGIONS } from "@/lib/seed";

export const Route = createFileRoute("/farmer/settings")({
  head: () => ({ meta: [{ title: "Settings — AgriLink" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>

      <Card title="Profile">
        <div className="flex items-center gap-4 mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2E7D32] text-xl font-semibold text-white">{FARMER.initials}</div>
          <div>
            <div className="font-display font-semibold">{FARMER.name}</div>
            <div className="text-xs text-[#64748B]">{FARMER.region} · Verified</div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Full name"><input className="input" defaultValue={FARMER.name} /></Field>
          <Field label="Phone"><input className="input" defaultValue={FARMER.phone} /></Field>
          <Field label="Email"><input className="input" placeholder="optional" /></Field>
          <Field label="Region"><select className="input" defaultValue={FARMER.region}>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
          <Field label="Cooperative"><input className="input" defaultValue={FARMER.coop} /></Field>
        </div>
        <button className="mt-4 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white">Save changes</button>
      </Card>

      <Card title="Notifications">
        {[
          { label: "Order alerts", on: true },
          { label: "Price alerts", on: true },
          { label: "Finance updates", on: true },
          { label: "Marketing emails", on: false },
        ].map((t) => <Toggle key={t.label} {...t} />)}
      </Card>

      <Card title="Mobile Money">
        <div className="text-sm mb-3">Current MoMo: <strong>{FARMER.phone}</strong> (MTN)</div>
        <ProviderToggle />
        <Field label="MoMo number"><input className="input" defaultValue={FARMER.phone} /></Field>
        <button className="mt-3 rounded-lg border-2 border-[#2E7D32] px-5 py-2 text-sm font-medium text-[#2E7D32]">Update MoMo number</button>
      </Card>

      <Card title="Security">
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Current password"><input type="password" className="input" /></Field>
          <Field label="New password"><input type="password" className="input" /></Field>
          <Field label="Confirm new password"><input type="password" className="input" /></Field>
        </div>
        <button className="mt-3 rounded-lg bg-[#2E7D32] px-5 py-2.5 text-sm font-medium text-white">Update password</button>
      </Card>

      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h3 className="font-display font-semibold text-red-700">Danger zone</h3>
        <p className="text-sm text-red-600 mt-1">Signing out will end your current session</p>
        <Link to="/" className="mt-4 inline-block rounded-lg border-2 border-red-500 px-5 py-2 text-sm font-medium text-red-600 hover:bg-red-100">Sign out</Link>
      </div>

      <style>{`.input { width:100%; padding:0.5rem 0.75rem; border:1px solid #E2E8F0; border-radius:0.5rem; background:white; font-size:0.875rem; outline:none } .input:focus { border-color:#2E7D32 }`}</style>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-[#E2E8F0] bg-white p-5"><h3 className="font-display font-semibold mb-4">{title}</h3>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block mb-3"><span className="block text-sm font-medium text-[#1E293B] mb-1.5">{label}</span>{children}</label>;
}

function Toggle({ label, on }: { label: string; on: boolean }) {
  const [v, setV] = useState(on);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm">{label}</span>
      <button onClick={() => setV(!v)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${v ? "bg-[#2E7D32]" : "bg-slate-300"}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${v ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    </div>
  );
}

function ProviderToggle() {
  const [p, setP] = useState<"MTN" | "Vodafone">("MTN");
  return (
    <div className="flex rounded-lg bg-[#F1F5F9] p-1 mb-3 w-fit">
      {(["MTN", "Vodafone"] as const).map((x) => (
        <button key={x} onClick={() => setP(x)} className={`px-4 py-1.5 text-sm rounded-md ${p === x ? "bg-white shadow-sm font-medium" : "text-[#64748B]"}`}>{x}</button>
      ))}
    </div>
  );
}
