import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, ShoppingCart, HandCoins, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/buyer/notifications")({
  head: () => ({ meta: [{ title: "Notifications — AgriLink" }] }),
  component: BuyerNotifs,
});

const iconFor = (kind: string) => kind === "Orders" ? ShoppingCart : kind === "Finance" ? HandCoins : kind === "Prices" ? TrendingUp : Bell;
const colorFor: Record<string, string> = { Orders: "#2E7D32", Finance: "#F9A825", Prices: "#4CAF50" };

function BuyerNotifs() {
  const { user } = useAuth();
  const uid = user?.id;
  const qc = useQueryClient();
  const [tab, setTab] = useState<"All" | "Orders" | "Finance" | "Prices">("All");

  const { data: list = [] } = useQuery({
    queryKey: ["notifs", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("*").eq("user_id", uid!).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => { await supabase.from("notifications").update({ is_read: true }).eq("id", id); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifs", uid] }); qc.invalidateQueries({ queryKey: ["unread-notifs", uid] }); },
  });
  const markAll = useMutation({
    mutationFn: async () => { await supabase.from("notifications").update({ is_read: true }).eq("user_id", uid!).eq("is_read", false); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifs", uid] }); qc.invalidateQueries({ queryKey: ["unread-notifs", uid] }); },
  });

  const filtered = tab === "All" ? list : list.filter((n) => n.kind === tab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Notifications</h1>
        <button onClick={() => markAll.mutate()} className="text-sm text-[#2E7D32] font-medium hover:underline">Mark all read</button>
      </div>
      <div className="flex gap-2 border-b border-[#E2E8F0]">
        {(["All", "Orders", "Finance", "Prices"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#64748B]"}`}>{t}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-white p-12 text-center text-sm text-[#64748B]">No notifications</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const Icon = iconFor(n.kind);
            const color = colorFor[n.kind] ?? "#64748B";
            return (
              <button key={n.id} onClick={() => !n.is_read && markRead.mutate(n.id)} className={`w-full text-left rounded-xl border border-[#E2E8F0] p-4 flex items-start gap-3 ${!n.is_read ? "bg-white border-l-4 border-l-[#2E7D32]" : "bg-[#F8FAFC]"}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: color + "20", color }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[#1E293B]">{n.title}</div>
                  <div className="text-sm text-[#64748B]">{n.description}</div>
                </div>
                <div className="text-xs text-[#64748B] whitespace-nowrap">{new Date(n.created_at).toLocaleDateString()}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
