import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticker } from "@/components/layout";
import { BUYER, BUYER_ORDERS, LISTINGS, TICKER, ghs } from "@/lib/seed";
import { EscrowPill } from "./farmer.dashboard";

export const Route = createFileRoute("/buyer/dashboard")({
  head: () => ({ meta: [{ title: "Buyer Dashboard — AgriLink" }] }),
  component: BuyerDashboard,
});

function BuyerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric label="Active Orders" value={String(BUYER.active)} />
        <Metric label="Total Spent" value={ghs(BUYER.totalSpent)} />
        <Metric label="Completed Orders" value={String(BUYER.completed)} />
      </div>

      <Ticker text={TICKER} />

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Featured produce</h3>
          <Link to="/buyer/marketplace" className="text-sm text-[#2E7D32] font-medium hover:underline">Browse all →</Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {LISTINGS.slice(0, 3).map((l) => (
            <div key={l.id} className="rounded-lg border border-[#E2E8F0] overflow-hidden">
              <img src={l.image} alt={l.crop} className="w-full h-24 object-cover" />
              <div className="p-3">
                <div className="font-display font-semibold text-sm">{l.crop}</div>
                <div className="text-xs text-[#64748B]">{l.farmer} · {l.region}</div>
                <div className="text-sm font-medium mt-1">{ghs(l.price)}/kg</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">Recent orders</h3>
          <Link to="/buyer/orders" className="text-sm text-[#2E7D32] font-medium hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
              <tr><th className="pb-2 font-medium">Crop</th><th className="pb-2 font-medium">Farmer</th><th className="pb-2 font-medium">Qty</th><th className="pb-2 font-medium">Value</th><th className="pb-2 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {BUYER_ORDERS.map((o) => (
                <tr key={o.id}>
                  <td className="py-3 font-medium">{o.crop}</td>
                  <td className="py-3">{o.farmer}</td>
                  <td className="py-3">{o.qty}kg</td>
                  <td className="py-3">{ghs(o.value)}</td>
                  <td className="py-3"><EscrowPill status={o.escrow} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
