import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Inbox } from "lucide-react";
import { ghs } from "@/lib/seed";
import { EscrowPill } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/farmer/orders")({
  head: () => ({ meta: [{ title: "Orders — AgriLink" }] }),
  component: FarmerOrders,
});

function FarmerOrders() {
  const { user } = useAuth();
  const uid = user?.id;
  const qc = useQueryClient();
  const [tab, setTab] = useState<"Incoming" | "Confirmed" | "In Transit" | "Completed">("Incoming");

  const { data: orders = [] } = useQuery({
    queryKey: ["farmer-orders", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, quantity_kg, total, escrow_status, created_at, buyer:profiles!orders_buyer_id_fkey(full_name, region), listing:produce_listings!orders_listing_id_fkey(crop, image_url)")
        .eq("farmer_id", uid!)
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ escrow_status: status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farmer-orders", uid] }),
  });

  const groups = {
    Incoming: orders.filter((o) => o.escrow_status === "funds_held"),
    Confirmed: orders.filter((o) => o.escrow_status === "ready_for_delivery"),
    "In Transit": orders.filter((o) => o.escrow_status === "in_transit"),
    Completed: orders.filter((o) => o.escrow_status === "released_to_farmer" || o.escrow_status === "delivered"),
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
            <div key={o.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
              <img src={o.listing?.image_url || "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400"} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-[#1E293B] truncate">{o.listing?.crop ?? "—"}</div>
                <div className="text-xs text-[#64748B] truncate">Buyer: {o.buyer?.full_name ?? "—"} · {o.quantity_kg}kg · {o.buyer?.region ?? ""}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display font-semibold text-[#1E293B]">{ghs(Number(o.total))}</div>
                <div className="mt-1"><EscrowPill status={o.escrow_status} /></div>
              </div>
              <div className="w-full sm:w-auto sm:shrink-0">
                {tab === "Incoming" && <button onClick={() => updateStatus.mutate({ id: o.id, status: "ready_for_delivery" })} className="w-full sm:w-auto rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-medium text-white hover:bg-[#256528]">Confirm Ready</button>}
                {tab === "Confirmed" && <button onClick={() => updateStatus.mutate({ id: o.id, status: "in_transit" })} className="w-full sm:w-auto rounded-lg border-2 border-[#2E7D32] px-4 py-2 text-xs font-medium text-[#2E7D32]">Mark as Dispatched</button>}
                {tab === "In Transit" && <button disabled className="w-full sm:w-auto rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-400 cursor-not-allowed">Awaiting buyer</button>}
                {tab === "Completed" && <span className="text-xs text-[#64748B]">Escrow released</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
