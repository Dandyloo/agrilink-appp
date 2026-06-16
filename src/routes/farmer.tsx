import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar, TopBar } from "@/components/layout";
import { FARMER_NAV } from "@/components/nav-items";
import { FARMER } from "@/lib/seed";

export const Route = createFileRoute("/farmer")({
  component: FarmerLayout,
});

function FarmerLayout() {
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <AppSidebar items={FARMER_NAV} badge="Verified Farmer" badgeKind="verified" />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar greeting={`Good morning, ${FARMER.name.split(" ")[0]}`} initials={FARMER.initials} />
        <main className="flex-1 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
