import { createFileRoute } from "@tanstack/react-router";
import { ghs } from "@/lib/seed";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/buyer/analytics")({
  head: () => ({ meta: [{ title: "Procurement Analytics — AgriLink" }] }),
  component: Analytics,
});

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Analytics() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data: orders = [] } = useQuery({
    queryKey: ["buyer-analytics", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("total, created_at, farmer_id, farmer:profiles!orders_farmer_id_fkey(full_name, region), listing:produce_listings!orders_listing_id_fkey(crop)")
        .eq("buyer_id", uid!);
      return (data ?? []) as any[];
    },
  });

  // Last 6 months
  const now = new Date();
  const months: { month: string; v: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i);
    const v = orders.filter((o) => { const od = new Date(o.created_at); return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear(); }).reduce((s, o) => s + Number(o.total), 0);
    months.push({ month: MONTH_LABELS[d.getMonth()], v });
  }
  const max = Math.max(1, ...months.map((m) => m.v));

  // Top crops donut
  const cropTotals = new Map<string, number>();
  orders.forEach((o) => { const c = o.listing?.crop ?? "Other"; cropTotals.set(c, (cropTotals.get(c) ?? 0) + Number(o.total)); });
  const totalAll = [...cropTotals.values()].reduce((s, v) => s + v, 0) || 1;
  const COLORS = ["#2E7D32", "#4CAF50", "#81C784", "#C8E6C9", "#F9A825"];
  const donut = [...cropTotals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([label, v], i) => ({ label, pct: Math.round((v / totalAll) * 100), color: COLORS[i] }));
  if (donut.length === 0) donut.push({ label: "No orders yet", pct: 100, color: "#E2E8F0" });

  let acc = 0;
  const gradStops = donut.map((d) => { const start = acc; acc += d.pct; return `${d.color} ${start * 3.6}deg ${acc * 3.6}deg`; }).join(", ");

  // Top suppliers
  const supMap = new Map<string, { name: string; region: string; orders: number; value: number }>();
  orders.forEach((o) => {
    const key = o.farmer_id;
    const cur = supMap.get(key) ?? { name: o.farmer?.full_name ?? "—", region: o.farmer?.region ?? "—", orders: 0, value: 0 };
    cur.orders += 1; cur.value += Number(o.total);
    supMap.set(key, cur);
  });
  const suppliers = [...supMap.values()].sort((a, b) => b.value - a.value).slice(0, 5);

  const thisMonthSpend = months[months.length - 1]?.v ?? 0;
  const uniqueFarmers = supMap.size;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Procurement analytics</h1>

      <div className="grid sm:grid-cols-3 gap-4">
        <Metric label="Total spent this month" value={ghs(thisMonthSpend)} />
        <Metric label="Orders placed" value={String(orders.length)} />
        <Metric label="Unique farmers" value={String(uniqueFarmers)} />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="font-display font-semibold mb-4">Monthly spend — last 6 months</h3>
        <div className="flex items-end gap-3 h-48 border-b border-[#E2E8F0] pb-2">
          {months.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-xs font-medium text-[#1E293B]">{s.v > 0 ? ghs(s.v).replace(".00", "") : ""}</div>
              <div className="w-full rounded-t bg-[#2E7D32]" style={{ height: `${(s.v / max) * 100}%`, minHeight: s.v > 0 ? 4 : 0 }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          {months.map((s, i) => <div key={i} className="flex-1 text-center text-xs text-[#64748B]">{s.month}</div>)}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="font-display font-semibold mb-4">Top crops</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-36 w-36 shrink-0 rounded-full relative" style={{ background: `conic-gradient(${gradStops})` }}>
              <div className="absolute inset-6 rounded-full bg-white" />
            </div>
            <div className="space-y-2 text-sm w-full sm:w-auto">
              {donut.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-[#1E293B]">{d.label}</span>
                  <span className="text-[#64748B] ml-1">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="font-display font-semibold mb-4">Top suppliers</h3>
          {suppliers.length === 0 ? (
            <div className="text-sm text-[#64748B] py-4">No suppliers yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
                  <tr><th className="pb-2 font-medium">Farmer</th><th className="pb-2 font-medium">Region</th><th className="pb-2 font-medium">Orders</th><th className="pb-2 font-medium text-right">Total</th></tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {suppliers.map((s, i) => (
                    <tr key={i}><td className="py-2 font-medium">{s.name}</td><td className="py-2 text-[#64748B]">{s.region}</td><td className="py-2">{s.orders}</td><td className="py-2 text-right">{ghs(s.value)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
