import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticker, EscrowBanner } from "@/components/layout";
import { FARMER, FARMER_ORDERS, TICKER, ghs } from "@/lib/seed";

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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Active Listings" value="6" />
        <MetricCard label="Pending Orders" value="3" />
        <MetricCard label="Total Earnings" value={ghs(FARMER.earnings)} gold />
        <MetricCard label="Finance Balance" value={ghs(FARMER.finance)} gold />
      </div>

      <Ticker text={TICKER} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="font-display font-semibold mb-4">Recent orders</h3>
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
                {FARMER_ORDERS.map((o) => (
                  <tr key={o.id} className="text-[#1E293B]">
                    <td className="py-3 font-medium">{o.crop}</td>
                    <td className="py-3">{o.buyer}</td>
                    <td className="py-3">{o.qty}kg</td>
                    <td className="py-3">{ghs(o.value)}</td>
                    <td className="py-3"><EscrowPill status={o.escrow} /></td>
                    <td className="py-3 text-[#64748B]">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export function EscrowPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Funds Held": "bg-[#FFF8E1] text-[#7A5C0E]",
    "Ready for Delivery": "bg-[#DBEAFE] text-[#1E40AF]",
    "In Transit": "bg-[#FEF3C7] text-[#92400E]",
    "Delivered": "bg-[#DCFCE7] text-[#166534]",
    "Released to Farmer": "bg-[#2E7D32] text-white",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-slate-100"}`}>{status}</span>;
}
