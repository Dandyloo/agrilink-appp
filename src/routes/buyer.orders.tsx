import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ghs } from "@/lib/seed";
import { EscrowPill } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/buyer/orders")({
  head: () => ({ meta: [{ title: "My Orders — AgriLink" }] }),
  component: BuyerOrders,
});

function BuyerOrders() {
  const { user } = useAuth();
  const uid = user?.id;
  const qc = useQueryClient();
  const [tab, setTab] = useState<"Active" | "In Transit" | "Completed">("Active");
  const [banner, setBanner] = useState<string | null>(null);

  const { data: orders = [] } = useQuery({
    queryKey: ["buyer-orders", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, quantity_kg, total, escrow_status, created_at, farmer_id, farmer:profiles!orders_farmer_id_fkey(full_name, region), listing:produce_listings!orders_listing_id_fkey(crop, image_url)")
        .eq("buyer_id", uid!)
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const confirmDelivery = useMutation({
    mutationFn: async (o: any) => {
      const { error } = await supabase.from("orders").update({ escrow_status: "released_to_farmer" }).eq("id", o.id);
      if (error) throw error;
      await supabase.from("wallet_transactions").insert({
        farmer_id: o.farmer_id,
        description: `${o.listing?.crop ?? "Order"} sale (${o.quantity_kg}kg)`,
        amount: Number(o.total),
        type: "credit",
        status: "completed",
      });
      await supabase.from("notifications").insert([
        { user_id: o.farmer_id, title: "Escrow released", description: `Payment of ${ghs(Number(o.total))} for ${o.listing?.crop ?? "your order"} has been released to your wallet.`, kind: "Finance" },
        { user_id: uid!, title: "Delivery confirmed", description: `You confirmed delivery for ${o.listing?.crop ?? "an order"}. Escrow released.`, kind: "Orders" },
      ]);
    },
    onSuccess: () => { qc.invalidateQueries(); setBanner("Escrow released — funds sent to farmer"); setTimeout(() => setBanner(null), 3500); },
  });

  const groups = {
    Active: orders.filter((o) => o.escrow_status === "funds_held" || o.escrow_status === "ready_for_delivery"),
    "In Transit": orders.filter((o) => o.escrow_status === "in_transit"),
    Completed: orders.filter((o) => o.escrow_status === "released_to_farmer" || o.escrow_status === "delivered"),
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">My Orders</h1>

      {banner && (
        <div className="rounded-xl border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-4 text-sm flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#2E7D32]" /> {banner}
        </div>
      )}

      <div className="flex gap-2 border-b border-[#E2E8F0] overflow-x-auto">
        {(["Active", "In Transit", "Completed"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap ${tab === t ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B]"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-3">
        {groups[tab].length === 0 && <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B]">No {tab.toLowerCase()} orders</div>}
        {groups[tab].map((o) => (
          <div key={o.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4">
            <img src={o.listing?.image_url || "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400"} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold truncate">{o.listing?.crop ?? "—"}</div>
              <div className="text-xs text-[#64748B] truncate">{o.farmer?.full_name ?? ""} · {o.quantity_kg}kg · {o.farmer?.region ?? ""} · {new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display font-semibold">{ghs(Number(o.total))}</div>
              <div className="mt-1"><EscrowPill status={o.escrow_status} /></div>
            </div>
            {tab === "In Transit" && (
              <button onClick={() => confirmDelivery.mutate(o)} disabled={confirmDelivery.isPending} className="w-full sm:w-auto rounded-lg bg-[#2E7D32] px-4 py-2 text-xs font-medium text-white disabled:opacity-60">Confirm Delivery</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
