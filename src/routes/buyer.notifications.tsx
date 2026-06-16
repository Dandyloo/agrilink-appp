import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, ShoppingCart, HandCoins, TrendingUp } from "lucide-react";
import { BUYER_NOTIFICATIONS } from "@/lib/seed";

export const Route = createFileRoute("/buyer/notifications")({
  head: () => ({ meta: [{ title: "Notifications — AgriLink" }] }),
  component: BuyerNotifs,
});

const iconFor = (kind: string) => kind === "Orders" ? ShoppingCart : kind === "Finance" ? HandCoins : kind === "Prices" ? TrendingUp : Bell;

function BuyerNotifs() {
  const [tab, setTab] = useState<"All" | "Orders" | "Finance" | "Prices">("All");
  const list = tab === "All" ? BUYER_NOTIFICATIONS : BUYER_NOTIFICATIONS.filter((n) => n.kind === tab);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        <button className="text-sm text-[#2E7D32] font-medium hover:underline">Mark all read</button>
      </div>
      <div className="flex gap-2 border-b border-[#E2E8F0]">
        {(["All", "Orders", "Finance", "Prices"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B]"}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-2">
        {list.map((n) => {
          const Icon = iconFor(n.kind);
          return (
            <div key={n.id} className={`rounded-xl border border-[#E2E8F0] p-4 flex items-start gap-3 ${n.unread ? "bg-white border-l-4 border-l-[#2E7D32]" : "bg-[#F8FAFC]"}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: n.color + "20", color: n.color }}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-[#1E293B]">{n.title}</div>
                <div className="text-sm text-[#64748B]">{n.desc}</div>
              </div>
              <div className="text-xs text-[#64748B] whitespace-nowrap">{n.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
