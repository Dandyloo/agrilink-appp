import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { LISTINGS, REGIONS, CROP_TYPES, ghs, type Listing } from "@/lib/seed";

export const Route = createFileRoute("/farmer/listings")({
  head: () => ({ meta: [{ title: "My Listings — AgriLink" }] }),
  component: MyListings,
});

function MyListings() {
  const [tab, setTab] = useState<"All" | "Active" | "Pending" | "Sold">("All");
  const [items, setItems] = useState<Listing[]>(LISTINGS);
  const [open, setOpen] = useState(false);

  const filtered = tab === "All" ? items : items.filter((i) => i.status === tab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">My Listings</h1>
        <button onClick={() => setOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#256528]">
          <Plus className="h-4 w-4" /> Create new listing
        </button>
      </div>

      <div className="flex gap-2 border-b border-[#E2E8F0] overflow-x-auto">
        {(["All", "Active", "Pending", "Sold"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === t ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}>{t}</button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((l) => (
          <div key={l.id} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
            <img src={l.image} alt={l.crop} className="w-full h-36 object-cover" />
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold text-[#1E293B]">{l.crop}</h3>
                <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                  l.status === "Active" ? "bg-[#DCFCE7] text-[#166534]" :
                  l.status === "Pending" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-slate-100 text-slate-600"
                }`}>{l.status}</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-xs rounded-full px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] font-medium">{l.region}</span>
                {l.cold && <span className="text-xs rounded-full px-2 py-0.5 bg-[#DBEAFE] text-[#1E40AF] font-medium">❄ Cold storage</span>}
              </div>
              <div className="text-sm text-[#1E293B] font-medium">{ghs(l.price)}/kg · {l.qty}kg available</div>
              <div className="text-xs text-[#64748B]">Available from {l.available}</div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 rounded-lg border-2 border-[#2E7D32] px-3 py-1.5 text-xs font-medium text-[#2E7D32] hover:bg-[#E8F5E9]">Edit</button>
                <button className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-[#64748B] hover:bg-[#F1F5F9]">View orders</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && <CreateModal onClose={() => setOpen(false)} onSave={(l) => { setItems([l, ...items]); setOpen(false); }} />}
    </div>
  );
}

function CreateModal({ onClose, onSave }: { onClose: () => void; onSave: (l: Listing) => void }) {
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSave({
      id: "L" + Math.random().toString(36).slice(2, 6),
      crop: String(f.get("crop") || "New crop"),
      farmer: "Kwame Asante",
      region: String(f.get("region") || "Brong-Ahafo"),
      price: Number(f.get("price") || 0),
      qty: Number(f.get("qty") || 0),
      available: String(f.get("available") || "2026-07-01"),
      status: "Active",
      cold: f.get("cold") === "on",
      image: String(f.get("image") || "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400"),
    });
  }
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Create listing</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#1E293B]"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3 text-sm">
          <Field label="Crop name"><input name="crop" required className="input" /></Field>
          <Field label="Crop type">
            <select name="cropType" className="input">
              {CROP_TYPES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity (kg)"><input name="qty" type="number" required className="input" /></Field>
            <Field label="Price per kg (GHS)"><input name="price" type="number" step="0.01" required className="input" /></Field>
          </div>
          <Field label="Availability date"><input name="available" type="date" required className="input" /></Field>
          <Field label="Region">
            <select name="region" className="input">{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
          </Field>
          <Field label="Description"><textarea name="desc" className="input" rows={3} /></Field>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="cold" /> <span>Cold storage required</span>
          </label>
          <Field label="Produce photo URL"><input name="image" className="input" placeholder="https://..." /></Field>
          <button type="submit" className="w-full rounded-lg bg-[#2E7D32] py-2.5 text-sm font-medium text-white">Save listing</button>
        </form>
        <style>{`.input { width:100%; padding:0.5rem 0.75rem; border:1px solid #E2E8F0; border-radius:0.5rem; background:white; font-size:0.875rem; outline:none } .input:focus { border-color:#2E7D32 }`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block font-medium mb-1.5 text-[#1E293B]">{label}</span>{children}</label>;
}
