import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, X, CheckCircle2 } from "lucide-react";
import { LISTINGS, REGIONS, CROP_TYPES, ghs, type Listing } from "@/lib/seed";

export const Route = createFileRoute("/buyer/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace — AgriLink" }] }),
  component: Marketplace,
});

function Marketplace() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [priceRange, setPriceRange] = useState("All");
  const [coldOnly, setColdOnly] = useState(false);
  const [orderFor, setOrderFor] = useState<Listing | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = LISTINGS.filter((l) => {
    if (q && !l.crop.toLowerCase().includes(q.toLowerCase())) return false;
    if (region && l.region !== region) return false;
    if (coldOnly && !l.cold) return false;
    if (priceRange === "Low" && l.price > 10) return false;
    if (priceRange === "Mid" && (l.price < 10 || l.price > 50)) return false;
    if (priceRange === "High" && l.price < 50) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Marketplace</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search crops..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-sm focus:border-[#2E7D32] outline-none" />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 grid sm:grid-cols-4 gap-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm">
          <option value="">All crop types</option>{CROP_TYPES.map((c) => <option key={c}>{c}</option>)}
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

      <div className="text-sm text-[#64748B]">Showing {filtered.length} listing{filtered.length !== 1 && "s"}</div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((l) => (
          <div key={l.id} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
            <div className="relative">
              <img src={l.image} alt={l.crop} className="w-full h-36 object-cover" />
              <span className="absolute top-2 right-2 text-xs rounded-full px-2 py-0.5 bg-[#2E7D32] text-white font-medium">{l.region}</span>
              {l.cold && <span className="absolute top-2 left-2 text-xs rounded-full px-2 py-0.5 bg-[#DBEAFE] text-[#1E40AF] font-medium">❄ Cold</span>}
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <h3 className="font-display font-semibold text-[#1E293B]">{l.crop}</h3>
              <div className="text-xs text-[#64748B]">{l.farmer}</div>
              <div className="text-sm font-semibold text-[#1E293B]">{ghs(l.price)} / kg</div>
              <div className="text-xs text-[#64748B]">{l.qty} kg available</div>
              <div className="text-xs text-[#64748B]">Available from {l.available}</div>
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
  const [qty, setQty] = useState(50);
  const [pay, setPay] = useState<"Paystack" | "MTN" | "Vodafone">("MTN");
  const subtotal = qty * listing.price;
  const fee = subtotal * 0.025;
  const total = subtotal + fee;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold">Place Order — {listing.crop}</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-[#64748B]" /></button>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-sm mb-4">
          <div><strong>{listing.farmer}</strong> · {listing.region}</div>
          <div className="text-[#64748B]">{ghs(listing.price)}/kg · {listing.qty}kg available</div>
        </div>
        <label className="block mb-3">
          <span className="block text-sm font-medium mb-1.5">Quantity (kg, max {listing.qty})</span>
          <input type="number" min={1} max={listing.qty} value={qty} onChange={(e) => setQty(Math.min(listing.qty, Math.max(1, Number(e.target.value) || 0)))} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm" />
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
        <button onClick={onPlaced} className="w-full rounded-lg bg-[#2E7D32] py-2.5 text-sm font-medium text-white">Confirm Order</button>
      </div>
    </div>
  );
}
