// src/routes/farmer.listings.tsx  — UPGRADED
// Changes from original:
//  • Real Cloudinary image upload (drag-and-drop) via ImageUpload component
//  • Description field added
//  • Better empty state
//  • Availability date picker
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, Loader2, Pencil, Trash2, PackageCheck } from "lucide-react";
import { REGIONS, CROP_TYPES, ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { imageForCrop, CURATED_CROPS } from "@/lib/crop-images";
import { ImageUpload } from "@/components/image-upload";

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

  const filtered =
    tab === "All" ? items : items.filter((i) => i.status.toLowerCase() === tab.toLowerCase());

  const TABS = ["All", "Active", "Pending", "Sold"] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">My Listings</h1>
          <p className="text-sm text-[#64748B] mt-1">{items.length} produce listing{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => { setEditing(null); setOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#256528]"
        >
          <Plus className="h-4 w-4" /> New listing
        </button>
      </div>

      <div className="flex gap-1 border-b border-[#E2E8F0] overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${
              tab === t
                ? "border-[#2E7D32] text-[#2E7D32]"
                : "border-transparent text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            {t}
            {t !== "All" && (
              <span className="ml-1.5 text-xs rounded-full bg-[#F1F5F9] px-1.5 py-0.5">
                {items.filter((i) => i.status.toLowerCase() === t.toLowerCase()).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-[#2E7D32]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#E2E8F0] bg-white p-16 text-center">
          <PackageCheck className="h-10 w-10 text-[#CBD5E1] mx-auto mb-3" />
          <p className="font-medium text-[#1E293B]">No listings here yet</p>
          <p className="text-sm text-[#64748B] mt-1">
            {tab === "All" ? "Create your first listing to start selling." : `No ${tab.toLowerCase()} listings.`}
          </p>
          {tab === "All" && (
            <button
              onClick={() => { setEditing(null); setOpen(true); }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Create listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
              <div className="relative">
                <img
                  src={item.image_url || imageForCrop(item.crop)}
                  alt={item.crop}
                  className="w-full h-36 object-cover"
                />
                <span
                  className={`absolute top-2 right-2 text-xs rounded-full px-2 py-0.5 font-medium ${
                    item.status === "active"
                      ? "bg-[#2E7D32] text-white"
                      : item.status === "sold"
                      ? "bg-[#94A3B8] text-white"
                      : "bg-[#F9A825] text-[#412402]"
                  }`}
                >
                  {item.status}
                </span>
                {item.cold_storage && (
                  <span className="absolute top-2 left-2 text-xs rounded-full px-2 py-0.5 bg-[#DBEAFE] text-[#1E40AF] font-medium">
                    ❄ Cold
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col gap-1.5">
                <h3 className="font-display font-semibold text-[#1E293B]">{item.crop}</h3>
                <div className="text-xs text-[#64748B]">{item.region}</div>
                <div className="text-sm font-semibold text-[#1E293B] mt-0.5">
                  {ghs(Number(item.price_per_kg))} / kg
                </div>
                <div className="text-xs text-[#64748B]">{item.quantity_kg} kg available</div>
                {item.description && (
                  <p className="text-xs text-[#64748B] mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="flex gap-2 mt-auto pt-3">
                  <button
                    onClick={() => { setEditing(item); setOpen(true); }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] py-2 text-xs font-medium text-[#1E293B] hover:bg-[#F8FAFC]"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this listing?")) remove.mutate(item.id); }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#FEE2E2] py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    disabled={remove.isPending}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <ListingModal
          existing={editing}
          uid={uid!}
          onClose={() => { setOpen(false); setEditing(null); }}
          onSaved={() => { setOpen(false); setEditing(null); qc.invalidateQueries({ queryKey: ["my-listings", uid] }); }}
        />
      )}
    </div>
  );
}

function ListingModal({
  existing,
  uid,
  onClose,
  onSaved,
}: {
  existing: Row | null;
  uid: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(existing?.image_url ?? null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState(existing?.crop ?? "Maize");

  const save = useMutation({
    mutationFn: async (payload: Omit<Row, "id" | "status"> & { farmer_id: string }) => {
      if (existing) {
        const { error } = await supabase
          .from("produce_listings")
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("produce_listings")
          .insert({ ...payload, status: "active" });
        if (error) throw error;
      }
    },
    onSuccess: onSaved,
    onError: (e: Error) => setError(e.message),
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const f = new FormData(e.currentTarget);
    save.mutate({
      farmer_id: uid,
      crop,
      region: String(f.get("region") || ""),
      price_per_kg: Number(f.get("price_per_kg") || 0),
      quantity_kg: Number(f.get("quantity_kg") || 0),
      availability_date: String(f.get("availability_date") || "") || null,
      cold_storage: f.get("cold_storage") === "on",
      image_url: imageUrl || imageForCrop(crop),
      description: String(f.get("description") || "") || null,
    });
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] p-6 max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold">
            {existing ? "Edit listing" : "New listing"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-[#64748B]" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Image upload */}
          <ImageUpload value={imageUrl} onChange={setImageUrl} />

          {/* Crop type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Crop type</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm"
            >
              {CURATED_CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Region</label>
            <select
              name="region"
              defaultValue={existing?.region ?? ""}
              required
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm"
            >
              <option value="">Select region</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Price / kg (GHS)</label>
              <input
                name="price_per_kg"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={existing?.price_per_kg ?? ""}
                placeholder="e.g. 4.50"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Quantity (kg)</label>
              <input
                name="quantity_kg"
                type="number"
                min="1"
                required
                defaultValue={existing?.quantity_kg ?? ""}
                placeholder="e.g. 500"
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm"
              />
            </div>
          </div>

          {/* Availability date */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Available from</label>
            <input
              name="availability_date"
              type="date"
              defaultValue={existing?.availability_date ?? ""}
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Description (optional)</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={existing?.description ?? ""}
              placeholder="Grade, variety, harvest notes..."
              className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] text-sm resize-none"
            />
          </div>

          {/* Cold storage */}
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="cold_storage"
              defaultChecked={existing?.cold_storage ?? false}
              className="rounded"
            />
            <span>Cold storage available</span>
          </label>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#E2E8F0] py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={save.isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] py-2.5 text-sm font-medium text-white disabled:opacity-60 hover:bg-[#256528]"
            >
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {existing ? "Save changes" : "Publish listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}