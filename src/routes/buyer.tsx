import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppSidebar, TopBar, useMobileNav } from "@/components/layout";
import { BUYER_NAV } from "@/components/nav-items";
import { useAuth, initials } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { timeGreeting } from "@/lib/crop-images";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";
import { PWABanner } from "@/components/pwa-banner";

export const Route = createFileRoute("/buyer")({
  component: BuyerLayout,
});

function BuyerLayout() {
  const nav = useMobileNav();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/signin" });
    else if (profile && profile.role !== "buyer") navigate({ to: "/farmer/dashboard" });
  }, [user, profile, loading, navigate]);

  const { data: unread = 0 } = useQuery({
    queryKey: ["unread-notifs", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      return count ?? 0;
    },
    refetchInterval: 30000,
  });

  useRealtimeNotifications(user?.id);

  if (loading || !user || !profile) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-sm text-[#64748B]">Loading…</div>;
  }

  const badge = profile.verification_status === "verified" ? "Verified Buyer" : "Pending verification";

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <AppSidebar
        items={BUYER_NAV}
        badge={badge}
        badgeKind="pro"
        mobileOpen={nav.open}
        onMobileClose={nav.closeMenu}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          greeting={timeGreeting(profile.full_name, "Buyer")}
          initials={initials(profile.full_name)}
          unread={unread}
          onMenuClick={nav.openMenu}
        />
        <PWABanner />
        <main className="flex-1 p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
