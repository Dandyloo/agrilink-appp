import { createFileRoute } from "@tanstack/react-router";
import { ghs } from "@/lib/seed";

export const Route = createFileRoute("/buyer/analytics")({
  head: () => ({ meta: [{ title: "Procurement Analytics — AgriLink" }] }),
  component: Analytics,
});

const SPEND = [
  { month: "Jan", v: 1200 }, { month: "Feb", v: 1800 }, { month: "Mar", v: 2400 },
  { month: "Apr", v: 1900 }, { month: "May", v: 2800 }, { month: "Jun", v: 3200 },
];
const DONUT = [
  { label: "Maize", pct: 35, color: "#2E7D32" },
  { label: "Tomatoes", pct: 25, color: "#4CAF50" },
  { label: "Yam", pct: 20, color: "#81C784" },
  { label: "Other", pct: 20, color: "#C8E6C9" },
];
const SUPPLIERS = [
  { name: "Kwame Asante", region: "Brong-Ahafo", orders: 3, value: 2700 },
  { name: "Abena Mensah", region: "Ashanti", orders: 2, value: 2400 },
  { name: "Ama Owusu", region: "Central", orders: 2, value: 1300 },
  { name: "Kofi Boateng", region: "Volta", orders: 1, value: 1200 },
  { name: "Akosua Frimpong", region: "Eastern", orders: 2, value: 1150 },
];

function Analytics() {
  const max = Math.max(...SPEND.map((s) => s.v));
  // build donut
  let acc = 0;
  const gradStops = DONUT.map((d) => {
    const start = acc; acc += d.pct;
    return `${d.color} ${start * 3.6}deg ${acc * 3.6}deg`;
  }).join(", ");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Procurement analytics</h1>

      <div className="rounded-xl border border-[#E2E8F0] border-l-4 border-l-[#F9A825] bg-white p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="font-display font-semibold">Pro Buyer plan · GHS 500/month</div>
          <div className="text-xs text-[#64748B] mt-0.5">Next renewal: 1 Aug 2026</div>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#FFF8E1] px-3 py-1 text-xs font-semibold text-[#F9A825]">Active subscription</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Metric label="Total spent this month" value={ghs(3200)} />
        <Metric label="Orders placed" value="8" />
        <Metric label="Unique farmers" value="5" />
      </div>

      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
        <h3 className="font-display font-semibold mb-4">Monthly spend — Jan to Jun 2026</h3>
        <div className="flex items-end gap-3 h-48 border-b border-[#E2E8F0] pb-2">
          {SPEND.map((s) => (
            <div key={s.month} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="text-xs font-medium text-[#1E293B]">{ghs(s.v).replace(".00", "")}</div>
              <div className="w-full rounded-t bg-[#2E7D32]" style={{ height: `${(s.v / max) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          {SPEND.map((s) => <div key={s.month} className="flex-1 text-center text-xs text-[#64748B]">{s.month}</div>)}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
          <h3 className="font-display font-semibold mb-4">Top crops</h3>
          <div className="flex items-center gap-6">
            <div className="h-36 w-36 rounded-full relative" style={{ background: `conic-gradient(${gradStops})` }}>
              <div className="absolute inset-6 rounded-full bg-white" />
            </div>
            <div className="space-y-2 text-sm">
              {DONUT.map((d) => (
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
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-[#64748B] border-b border-[#E2E8F0]">
              <tr><th className="pb-2 font-medium">Farmer</th><th className="pb-2 font-medium">Region</th><th className="pb-2 font-medium">Orders</th><th className="pb-2 font-medium text-right">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {SUPPLIERS.map((s) => (
                <tr key={s.name}><td className="py-2 font-medium">{s.name}</td><td className="py-2 text-[#64748B]">{s.region}</td><td className="py-2">{s.orders}</td><td className="py-2 text-right">{ghs(s.value)}</td></tr>
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
