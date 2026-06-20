import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { REGIONS, CROP_TYPES, ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/farmer/listings")({
  head: () => ({ meta: [{ title: "My Listings — AgriLink" }] }),
  component: MyListings,
});

type Row = {
  id: string;
  crop: string;
  region: string;
  price_per_kg: number;
  quantity_kg: number;
  availability_date: string | null;
  status: "active" | "pending" | "sold";
  cold_storage: boolean;
  image_url: string | null;
  description: string | null;
};

const DEFAULT_IMG = "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400";

function MyListings() {
  const { user } = useAuth();
  const uid = user?.id;
  const qc = useQueryClient();
  const [tab, setTab] = useState<"All" | "Active" | "Pending" | "Sold">("All");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["my-listings", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("produce_listings")
        .select("*")
        .eq("farmer_id", uid!)
        .order("created_at", { ascending: false });
      return (data ?? []) as Row[];
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("produce_listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-listings", uid] }),
  });

  const filtered = tab === "All" ? items : items.filter((i) => i.status.toLowerCase() === tab.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">My Listings</h1>
        <button onClick={() => { setEditing(null); setOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#256528]">
          <Plus className="h-4 w-4" /> Create new listing
        </button>
      </div>

      <div className="flex gap-2 border-b border-[#E2E8F0] overflow-x-auto">
        {(["All", "Active", "Pending", "Sold"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === t ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}>{t}</button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-[#64748B]">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B]">
          No {tab.toLowerCase()} listings yet. Click "Create new listing" to add your first produce.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((l) => (
            <div key={l.id} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <img src={l.image_url || DEFAULT_IMG} alt={l.crop} className="w-full h-36 object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-[#1E293B]">{l.crop}</h3>
                  <span className={`text-xs rounded-full px-2 py-0.5 font-medium capitalize ${
                    l.status === "active" ? "bg-[#DCFCE7] text-[#166534]" :
                    l.status === "pending" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-slate-100 text-slate-600"
                  }`}>{l.status}</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-xs rounded-full px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] font-medium">{l.region}</span>
                  {l.cold_storage && <span className="text-xs rounded-full px-2 py-0.5 bg-[#DBEAFE] text-[#1E40AF] font-medium">❄ Cold storage</span>}
                </div>
                <div className="text-sm text-[#1E293B] font-medium">{ghs(Number(l.price_per_kg))}/kg · {l.quantity_kg}kg available</div>
                {l.availability_date && <div className="text-xs text-[#64748B]">Available from {l.availability_date}</div>}
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setEditing(l); setOpen(true); }} className="flex-1 rounded-lg border-2 border-[#2E7D32] px-3 py-1.5 text-xs font-medium text-[#2E7D32] hover:bg-[#E8F5E9]">Edit</button>
                  <button onClick={() => { if (confirm("Delete this listing?")) remove.mutate(l.id); }} className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && uid && <ListingModal farmerId={uid} initial={editing} onClose={() => { setOpen(false); setEditing(null); }} onSaved={() => { qc.invalidateQueries({ queryKey: ["my-listings", uid] }); setOpen(false); setEditing(null); }} />}
    </div>
  );
}

function ListingModal({ farmerId, initial, onClose, onSaved }: { farmerId: string; initial: Row | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const f = new FormData(e.currentTarget);
    const payload = {
      farmer_id: farmerId,
      crop: String(f.get("crop") || ""),
      region: String(f.get("region") || ""),
      price_per_kg: Number(f.get("price") || 0),
      quantity_kg: Number(f.get("qty") || 0),
      availability_date: String(f.get("available") || "") || null,
      cold_storage: f.get("cold") === "on",
      description: String(f.get("desc") || ""),
      image_url: String(f.get("image") || "") || DEFAULT_IMG,
      status: "active" as const,
    };
    const res = initial
      ? await supabase.from("produce_listings").update(payload).eq("id", initial.id)
      : await supabase.from("produce_listings").insert(payload);
    setSaving(false);
    if (res.error) { setError(res.error.message); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">{initial ? "Edit listing" : "Create listing"}</h2>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#1E293B]"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-3 text-sm">
          <Field label="Crop name"><input name="crop" required defaultValue={initial?.crop} className="input" /></Field>
          <Field label="Crop type">
            <select name="cropType" className="input">{CROP_TYPES.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity (kg)"><input name="qty" type="number" required defaultValue={initial?.quantity_kg} className="input" /></Field>
            <Field label="Price per kg (GHS)"><input name="price" type="number" step="0.01" required defaultValue={initial?.price_per_kg} className="input" /></Field>
          </div>
          <Field label="Availability date"><input name="available" type="date" required defaultValue={initial?.availability_date ?? ""} className="input" /></Field>
          <Field label="Region">
            <select name="region" required defaultValue={initial?.region} className="input"><option value="">Select region</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
          </Field>
          <Field label="Description"><textarea name="desc" defaultValue={initial?.description ?? ""} className="input" rows={3} /></Field>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="cold" defaultChecked={initial?.cold_storage} /> <span>Cold storage required</span>
          </label>
          <Field label="Produce photo URL"><input name="image" defaultValue={initial?.image_url ?? ""} className="input" placeholder="https://..." /></Field>
          {error && <div className="rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-700">{error}</div>}
          <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} {initial ? "Save changes" : "Save listing"}
          </button>
        </form>
        <style>{`.input { width:100%; padding:0.5rem 0.75rem; border:1px solid #E2E8F0; border-radius:0.5rem; background:white; font-size:0.875rem; outline:none } .input:focus { border-color:#2E7D32 }`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block font-medium mb-1.5 text-[#1E293B]">{label}</span>{children}</label>;
}
