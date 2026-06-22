import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticker, EscrowPill } from "@/components/layout";
import { TICKER, ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/buyer/dashboard")({
  head: () => ({ meta: [{ title: "Buyer Dashboard — AgriLink" }] }),
  component: BuyerDashboard,
});

function BuyerDashboard() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data: orders = [] } = useQuery({
    queryKey: ["buyer-orders-summary", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, total, quantity_kg, escrow_status, created_at, farmer:profiles!orders_farmer_id_fkey(full_name, region), listing:produce_listings!orders_listing_id_fkey(crop)")
        .eq("buyer_id", uid!)
        .order("created_at", { ascending: false });
      return (data ?? []) as any[];
    },
  });

  const { data: featured = [] } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("produce_listings")
        .select("id, crop, price_per_kg, region, image_url, farmer:profiles!produce_listings_farmer_id_fkey(full_name)")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);
      return (data ?? []) as any[];
    },
  });

  const active = orders.filter((o) => o.escrow_status !== "released_to_farmer").length;
  const completed = orders.filter((o) => o.escrow_status === "released_to_farmer").length;
  const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric label="Active Orders" value={String(active)} />
        <Metric label="Total Spent" value={ghs(totalSpent)} />
        <Metric label="Completed Orders" value={String(completed)} />
      </div>

      <Ticker text={TICKER} />

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Featured produce</h3>
          <Link to="/buyer/marketplace" className="text-sm text-[#2E7D32] font-medium hover:underline">Browse all →</Link>
        </div>
        {featured.length === 0 ? (
          <div className="text-sm text-[#64748B] py-4">No active listings yet.</div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {featured.map((l) => (
              <div key={l.id} className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                <img src={l.image_url || "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400"} alt={l.crop} className="w-full h-24 object-cover" />
                <div className="p-3">
                  <div className="font-display font-semibold text-sm">{l.crop}</div>
                  <div className="text-xs text-[#64748B]">{l.farmer?.full_name ?? ""} · {l.region}</div>
                  <div className="text-sm font-medium mt-1">{ghs(Number(l.price_per_kg))}/kg</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Recent orders</h3>
          <Link to="/buyer/orders" className="text-sm text-[#2E7D32] font-medium hover:underline">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-sm text-[#64748B] py-4">No orders yet. Visit the marketplace to place your first order.</div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="rounded-lg border border-[#E2E8F0] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display font-semibold truncate">{o.listing?.crop ?? "—"}</div>
                      <div className="text-xs text-[#64748B] truncate">{o.farmer?.full_name ?? "—"} · {o.quantity_kg}kg</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display font-semibold text-sm">{ghs(Number(o.total))}</div>
                      <div className="mt-1"><EscrowPill status={o.escrow_status} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
                  <tr><th className="pb-2 font-medium">Crop</th><th className="pb-2 font-medium">Farmer</th><th className="pb-2 font-medium">Qty</th><th className="pb-2 font-medium">Value</th><th className="pb-2 font-medium">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id}>
                      <td className="py-3 font-medium">{o.listing?.crop ?? "—"}</td>
                      <td className="py-3">{o.farmer?.full_name ?? "—"}</td>
                      <td className="py-3">{o.quantity_kg}kg</td>
                      <td className="py-3">{ghs(Number(o.total))}</td>
                      <td className="py-3"><EscrowPill status={o.escrow_status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="text-xs text-[#64748B]">{label}</div>
      <div className="mt-2 font-display text-2xl font-bold text-[#1E293B]">{value}</div>
    </div>
  );
}
