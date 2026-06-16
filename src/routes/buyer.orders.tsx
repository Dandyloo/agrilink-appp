import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { BUYER_ORDERS, ghs } from "@/lib/seed";
import { EscrowPill } from "./farmer.dashboard";

export const Route = createFileRoute("/buyer/orders")({
  head: () => ({ meta: [{ title: "My Orders — AgriLink" }] }),
  component: BuyerOrders,
});

function BuyerOrders() {
  const [tab, setTab] = useState<"Active" | "In Transit" | "Completed">("Active");
  const [banner, setBanner] = useState<string | null>(null);

  const groups: Record<string, typeof BUYER_ORDERS> = {
    Active: BUYER_ORDERS.filter((o) => o.escrow === "Funds Held" || o.escrow === "Ready for Delivery"),
    "In Transit": BUYER_ORDERS.filter((o) => o.escrow === "In Transit"),
    Completed: BUYER_ORDERS.filter((o) => o.escrow === "Released to Farmer" || o.escrow === "Delivered"),
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">My Orders</h1>

      {banner && (
        <div className="rounded-xl border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-4 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" /> {banner}
        </div>
      )}

      <div className="flex gap-2 border-b border-[#E2E8F0]">
        {(["Active", "In Transit", "Completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B]"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {groups[tab].length === 0 && <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B]">No {tab.toLowerCase()} orders</div>}
        {groups[tab].map((o) => (
          <div key={o.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex items-center gap-4">
            <img src={o.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold">{o.crop}</div>
              <div className="text-xs text-[#64748B]">{o.farmer} · {o.qty}kg · {o.region} · {o.date}</div>
            </div>
            <div className="text-right">
              <div className="font-display font-semibold">{ghs(o.value)}</div>
              <div className="mt-1"><EscrowPill status={o.escrow} /></div>
            </div>
            {tab === "In Transit" && (
              <button onClick={() => setBanner("Escrow released — funds sent to farmer")} className="rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-medium text-white">Confirm Delivery</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
