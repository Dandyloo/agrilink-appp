import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Inbox } from "lucide-react";
import { FARMER_ORDERS, ghs } from "@/lib/seed";
import { EscrowPill } from "./farmer.dashboard";

export const Route = createFileRoute("/farmer/orders")({
  head: () => ({ meta: [{ title: "Orders — AgriLink" }] }),
  component: FarmerOrders,
});

function FarmerOrders() {
  const [tab, setTab] = useState<"Incoming" | "Confirmed" | "In Transit" | "Completed">("Incoming");

  const groups: Record<string, typeof FARMER_ORDERS> = {
    Incoming: FARMER_ORDERS.filter((o) => o.escrow === "Funds Held"),
    Confirmed: FARMER_ORDERS.filter((o) => o.escrow === "Ready for Delivery"),
    "In Transit": FARMER_ORDERS.filter((o) => o.escrow === "In Transit"),
    Completed: FARMER_ORDERS.filter((o) => o.escrow === "Released to Farmer" || o.escrow === "Delivered"),
  };
  const list = groups[tab];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Orders</h1>

      <div className="flex gap-2 border-b border-[#E2E8F0] overflow-x-auto">
        {(["Incoming", "Confirmed", "In Transit", "Completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === t ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B] hover:text-[#1E293B]"}`}>
            {t}{groups[t].length > 0 && <span className="ml-1.5 text-xs bg-[#E8F5E9] text-[#2E7D32] rounded-full px-1.5">{groups[t].length}</span>}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center">
          <Inbox className="h-10 w-10 text-[#64748B] mx-auto" />
          <p className="mt-3 text-sm text-[#64748B]">No {tab.toLowerCase()} orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((o) => (
            <div key={o.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex items-center gap-4">
              <img src={o.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-[#1E293B]">{o.crop}</div>
                <div className="text-xs text-[#64748B]">Buyer: {o.buyer} · {o.qty}kg · {o.region}</div>
              </div>
              <div className="text-right">
                <div className="font-display font-semibold text-[#1E293B]">{ghs(o.value)}</div>
                <div className="mt-1"><EscrowPill status={o.escrow} /></div>
              </div>
              <ActionButton tab={tab} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionButton({ tab }: { tab: string }) {
  if (tab === "Incoming") return <button className="rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-medium text-white hover:bg-[#256528]">Confirm Ready</button>;
  if (tab === "Confirmed") return <button className="rounded-lg border-2 border-[#2E7D32] px-4 py-2 text-xs font-medium text-[#2E7D32]">Mark as Dispatched</button>;
  if (tab === "In Transit") return <button disabled className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-400 cursor-not-allowed">Awaiting buyer</button>;
  return <button className="rounded-lg px-4 py-2 text-xs font-medium text-[#64748B] hover:bg-[#F1F5F9]">View receipt</button>;
}
