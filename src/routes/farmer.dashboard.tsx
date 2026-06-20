import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticker, EscrowBanner, EscrowPill } from "@/components/layout";
import { TICKER, ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/farmer/dashboard")({
  head: () => ({ meta: [{ title: "Farmer Dashboard — AgriLink" }] }),
  component: FarmerDashboard,
});

function MetricCard({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className={`text-xs font-medium ${gold ? "text-[#F9A825]" : "text-[#64748B]"}`}>{label}</div>
      <div className={`mt-2 font-display text-2xl font-bold ${gold ? "text-[#F9A825]" : "text-[#1E293B]"}`}>{value}</div>
    </div>
  );
}

function FarmerDashboard() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data: stats } = useQuery({
    queryKey: ["farmer-stats", uid],
    enabled: !!uid,
    queryFn: async () => {
      const [listings, pendingOrders, allOrders, walletTx] = await Promise.all([
        supabase.from("produce_listings").select("id", { count: "exact", head: true }).eq("farmer_id", uid!).eq("status", "active"),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("farmer_id", uid!).in("escrow_status", ["funds_held", "ready_for_delivery", "in_transit"]),
        supabase.from("orders").select("total").eq("farmer_id", uid!).eq("escrow_status", "released_to_farmer"),
        supabase.from("wallet_transactions").select("amount,type").eq("farmer_id", uid!),
      ]);
      const earnings = (allOrders.data ?? []).reduce((s, o) => s + Number(o.total), 0);
      const balance = (walletTx.data ?? []).reduce((s, t) => s + (t.type === "credit" ? Number(t.amount) : -Number(t.amount)), 0);
      return { active: listings.count ?? 0, pending: pendingOrders.count ?? 0, earnings, balance };
    },
  });

  const { data: recent = [] } = useQuery({
    queryKey: ["farmer-recent-orders", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, quantity_kg, total, escrow_status, created_at, buyer:profiles!orders_buyer_id_fkey(full_name), listing:produce_listings!orders_listing_id_fkey(crop)")
        .eq("farmer_id", uid!)
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Listings" value={String(stats?.active ?? 0)} />
        <MetricCard label="Pending Orders" value={String(stats?.pending ?? 0)} />
        <MetricCard label="Total Earnings" value={ghs(stats?.earnings ?? 0)} gold />
        <MetricCard label="Wallet Balance" value={ghs(stats?.balance ?? 0)} gold />
      </div>

      <Ticker text={TICKER} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="font-display font-semibold mb-4">Recent orders</h3>
          {recent.length === 0 ? (
            <div className="text-sm text-[#64748B] py-6 text-center">No orders yet. Once buyers place orders, they'll appear here.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="pb-2 font-medium">Crop</th>
                    <th className="pb-2 font-medium">Buyer</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Value</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {recent.map((o: any) => (
                    <tr key={o.id} className="text-[#1E293B]">
                      <td className="py-3 font-medium">{o.listing?.crop ?? "—"}</td>
                      <td className="py-3">{o.buyer?.full_name ?? "—"}</td>
                      <td className="py-3">{o.quantity_kg}kg</td>
                      <td className="py-3">{ghs(Number(o.total))}</td>
                      <td className="py-3"><EscrowPill status={o.escrow_status} /></td>
                      <td className="py-3 text-[#64748B]">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="font-display font-semibold mb-4">Quick actions</h3>
          <div className="space-y-2">
            <Link to="/farmer/listings" className="block w-full text-center rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#256528]">List New Produce</Link>
            <Link to="/farmer/finance" className="block w-full text-center rounded-lg border-2 border-[#2E7D32] px-4 py-2.5 text-sm font-medium text-[#2E7D32] hover:bg-[#E8F5E9]">Apply for Finance</Link>
            <Link to="/farmer/prices" className="block w-full text-center rounded-lg border-2 border-[#2E7D32] px-4 py-2.5 text-sm font-medium text-[#2E7D32] hover:bg-[#E8F5E9]">Check Prices</Link>
          </div>
        </div>
      </div>

      <EscrowBanner>
        🔒 <strong>Escrow protected</strong> — All payments are held securely until delivery is confirmed.
      </EscrowBanner>
    </div>
  );
}
