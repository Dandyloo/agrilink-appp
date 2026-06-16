import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar, TopBar } from "@/components/layout";
import { BUYER_NAV } from "@/components/nav-items";
import { BUYER } from "@/lib/seed";

export const Route = createFileRoute("/buyer")({
  component: BuyerLayout,
});

function BuyerLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <AppSidebar items={BUYER_NAV} badge="Pro Buyer · GHS 500/mo" badgeKind="pro" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar greeting={`Good morning, ${BUYER.name.split(" ")[0]}`} initials={BUYER.initials} />
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
