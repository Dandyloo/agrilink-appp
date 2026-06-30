import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, X, CheckCircle2, Loader2 } from "lucide-react";
import { REGIONS, COMMODITY_PRICES, ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GhanaMap } from "@/components/ghana-map";
import { imageForCrop } from "@/lib/crop-images";

export const Route = createFileRoute("/buyer/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — AgriLink" }] }),
  component: Marketplace,
});

type Listing = {
  id: string;
  farmer_id: string;
  crop: string;
  price_per_kg: number;
  quantity_kg: number;
  region: string;
  availability_date: string | null;
  cold_storage: boolean;
  image_url: string | null;
  farmer: { full_name: string; cooperative_name: string | null } | null;
};

function Marketplace() {
  const [q, setQ] = useState("");
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");
  const [priceRange, setPriceRange] = useState("All");
  const [coldOnly, setColdOnly] = useState(false);
  const [orderFor, setOrderFor] = useState<Listing | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["marketplace", { q, crop, region, priceRange, coldOnly }],
    queryFn: async () => {
      let query = supabase
        .from("produce_listings")
        .select("id, farmer_id, crop, price_per_kg, quantity_kg, region, availability_date, cold_storage, image_url, farmer:profiles!produce_listings_farmer_id_fkey(full_name, cooperative_name)")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (crop) query = query.ilike("crop", crop);
      else if (q) query = query.ilike("crop", `%${q}%`);
      if (region) query = query.eq("region", region);
      if (coldOnly) query = query.eq("cold_storage", true);
      if (priceRange === "Low") query = query.lte("price_per_kg", 10);
      else if (priceRange === "Mid") query = query.gte("price_per_kg", 10).lte("price_per_kg", 50);
      else if (priceRange === "High") query = query.gte("price_per_kg", 50);
      const { data } = await query;
      return (data ?? []) as unknown as Listing[];
    },
  });

  const cropOptions = COMMODITY_PRICES.map((c) => c.crop);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Marketplace</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search crops..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm focus:border-[#2E7D32] outline-none" />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 grid sm:grid-cols-4 gap-3">
        <select value={crop} onChange={(e) => setCrop(e.target.value)} className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm">
          <option value="">All crop types</option>{cropOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm">
          <option value="">All regions</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm">
          <option>All</option><option value="Low">Low (GHS 0–10)</option><option value="Mid">Mid (GHS 10–50)</option><option value="High">High (GHS 50+)</option>
        </select>
        <label className="flex items-center gap-2 text-sm px-2">
          <input type="checkbox" checked={coldOnly} onChange={(e) => setColdOnly(e.target.checked)} /> Cold storage only
        </label>
      </div>
      <GhanaMap onRegionClick={(r) => setRegion(r)} />

      <div className="text-sm text-[#64748B]">{isLoading ? "Loading…" : `Showing ${listings.length} listing${listings.length !== 1 ? "s" : ""}`}</div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((l) => (
          <div key={l.id} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
            <div className="relative">
              <img src={l.image_url || imageForCrop(l.crop)} alt={l.crop} className="w-full h-36 object-cover" />
              <span className="absolute top-2 right-2 text-xs rounded-full px-2 py-0.5 bg-[#2E7D32] text-white font-medium">{l.region}</span>
              {l.cold_storage && <span className="absolute top-2 left-2 text-xs rounded-full px-2 py-0.5 bg-[#DBEAFE] text-[#1E40AF] font-medium">❄ Cold</span>}
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <h3 className="font-display font-semibold text-[#1E293B]">{l.crop}</h3>
              <div className="text-xs text-[#64748B]">{l.farmer?.full_name ?? "Farmer"}{l.farmer?.cooperative_name ? ` · ${l.farmer.cooperative_name}` : ""}</div>
              <div className="text-sm font-semibold text-[#1E293B]">{ghs(Number(l.price_per_kg))} / kg</div>
              <div className="text-xs text-[#64748B]">{l.quantity_kg} kg available</div>
              {l.availability_date && <div className="text-xs text-[#64748B]">Available from {l.availability_date}</div>}
              <button onClick={() => setOrderFor(l)} className="mt-auto w-full rounded-lg bg-[#2E7D32] py-2 text-sm font-medium text-white hover:bg-[#256528]">Place Order</button>
            </div>
          </div>
        ))}
      </div>

      {orderFor && <OrderModal listing={orderFor} onClose={() => setOrderFor(null)} onPlaced={() => { setOrderFor(null); setToast("Order placed! Funds held in escrow."); setTimeout(() => setToast(null), 3500); }} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-[#2E7D32] text-white px-4 py-3 shadow-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" /> {toast}
        </div>
      )}
    </div>
  );
}

function OrderModal({ listing, onClose, onPlaced }: { listing: Listing; onClose: () => void; onPlaced: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [qty, setQty] = useState(50);
  const [pay, setPay] = useState<"Paystack" | "MTN" | "Vodafone">("MTN");
  const [error, setError] = useState<string | null>(null);
  const subtotal = qty * Number(listing.price_per_kg);
  const fee = subtotal * 0.025;
  const total = subtotal + fee;

  const place = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase.from("orders").insert({
        buyer_id: user.id,
        listing_id: listing.id,
        farmer_id: listing.farmer_id,
        quantity_kg: qty,
        subtotal,
        platform_fee: fee,
        total,
        payment_method: pay,
        escrow_status: "funds_held",
      });
      if (error) throw error;
      await supabase.from("notifications").insert([
        { user_id: listing.farmer_id, title: "New order received", description: `${user.email ?? "A buyer"} placed an order for ${qty}kg of ${listing.crop}`, kind: "Orders" },
        { user_id: user.id, title: "Order placed", description: `Your order for ${qty}kg of ${listing.crop} has been placed. Funds are held in escrow.`, kind: "Orders" },
      ]);
    },
    onSuccess: () => { qc.invalidateQueries(); onPlaced(); },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold">Place Order — {listing.crop}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-[#64748B]" /></button>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-sm mb-4">
          <div><strong>{listing.farmer?.full_name ?? "Farmer"}</strong> · {listing.region}</div>
          <div className="text-[#64748B]">{ghs(Number(listing.price_per_kg))}/kg · {listing.quantity_kg}kg available</div>
        </div>
        <label className="block mb-3">
          <span className="block text-sm font-medium mb-1.5">Quantity (kg, max {listing.quantity_kg})</span>
          <input type="number" min={1} max={listing.quantity_kg} value={qty} onChange={(e) => setQty(Math.min(Number(listing.quantity_kg), Math.max(1, Number(e.target.value) || 0)))} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
        </label>
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-sm space-y-1.5 mb-4">
          <div className="flex justify-between"><span className="text-[#64748B]">Subtotal</span><span>{ghs(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-[#64748B]">AgriLink fee (2.5%)</span><span>{ghs(fee)}</span></div>
          <div className="flex justify-between font-semibold pt-1.5 border-t border-[#E2E8F0]"><span>Total payable</span><span>{ghs(total)}</span></div>
        </div>
        <div className="mb-4">
          <span className="block text-sm font-medium mb-1.5">Payment method</span>
          <div className="flex rounded-lg bg-[#F1F5F9] p-1">
            {(["Paystack", "MTN", "Vodafone"] as const).map((p) => (
              <button key={p} onClick={() => setPay(p)} className={`flex-1 py-2 text-xs font-medium rounded-md ${pay === p ? "bg-white shadow-sm" : "text-[#64748B]"}`}>
                {p === "Paystack" ? "Paystack Card" : p === "MTN" ? "MTN MoMo" : "Vodafone Cash"}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-3 text-xs text-[#1E293B] mb-4">
          🔒 Your payment will be held in escrow until delivery is confirmed
        </div>
        {error && <div className="mb-3 text-xs text-red-600">{error}</div>}
        <button onClick={() => place.mutate()} disabled={place.isPending} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#2E7D32] py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {place.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Confirm Order
        </button>
      </div>
    </div>
  );
}