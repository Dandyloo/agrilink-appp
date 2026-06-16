import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, TrendingDown } from "lucide-react";
import { COMMODITY_PRICES, ghs } from "@/lib/seed";

export const Route = createFileRoute("/farmer/prices")({
  head: () => ({ meta: [{ title: "Commodity Prices — AgriLink" }] }),
  component: Prices,
});

function Prices() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="font-display text-2xl font-semibold">Commodity Prices</h1>
          <p className="text-sm text-[#64748B] mt-1">Ghana Commodity Exchange · Daily market rates</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-medium text-[#2E7D32]">
          Updated today, 09:15 AM
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMMODITY_PRICES.map((c) => {
          const up = c.change > 0;
          const max = Math.max(...c.trend);
          return (
            <div key={c.crop} className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <img src={c.image} alt={c.crop} className="w-full h-20 object-cover" />
              <div className="p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display font-semibold text-[#1E293B]">{c.crop}</h3>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-[#DCFCE7] text-[#166534]" : "bg-red-50 text-red-700"}`}>
                    {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {up ? "+" : ""}{c.change}%
                  </span>
                </div>
                <div className="mt-2 font-display text-2xl font-bold text-[#1E293B]">{ghs(c.price)}<span className="text-sm font-normal text-[#64748B]">/kg</span></div>

                <div className="mt-3 flex items-end gap-1 h-10">
                  {c.trend.map((v, i) => (
                    <div key={i} className="flex-1 rounded-t bg-[#4CAF50]" style={{ height: `${(v / max) * 100}%`, opacity: 0.5 + (i / c.trend.length) * 0.5 }} />
                  ))}
                </div>

                <div className="mt-3 text-xs text-[#64748B]">Source region: {c.region}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
