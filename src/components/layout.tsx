import { Link, useRouterState } from "@tanstack/react-router";
import { ShieldCheck, LogOut } from "lucide-react";
import type { ComponentType } from "react";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export function AppSidebar({
  items,
  badge,
  badgeKind = "verified",
}: {
  items: NavItem[];
  badge?: string;
  badgeKind?: "verified" | "pro";
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[#0F172A] text-white min-h-screen sticky top-0">
      <div className="px-6 pt-6 pb-4">
        <Link to="/" className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold text-[#4CAF50]">AgriLink</span>
          <span className="text-[10px] uppercase tracking-widest text-[#F9A825]">Solutions</span>
        </Link>
        {badge && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={ badgeKind === "verified"
              ? { backgroundColor: "rgba(46,125,50,0.15)", color: "#4CAF50" }
              : { backgroundColor: "rgba(249,168,37,0.15)", color: "#F9A825" }
            }>
            {badgeKind === "verified" && <ShieldCheck className="h-3.5 w-3.5" />}
            {badge}
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-[#2E7D32] text-white font-medium"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}

export function TopBar({ greeting, initials }: { greeting: string; initials: string }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E2E8F0] bg-white px-6">
      <h1 className="font-display text-lg font-semibold text-[#1E293B]">{greeting}</h1>
      <div className="flex items-center gap-4">
        <Link to="/notifications" className="relative">
          <BellIcon />
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">3</span>
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2E7D32] text-sm font-semibold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  );
}

export function Ticker({ text }: { text: string }) {
  const doubled = `📊 ${text}     📊 ${text}     `;
  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="flex whitespace-nowrap py-3 animate-ticker text-sm font-medium text-[#1E293B]">
        <span className="px-4">{doubled}</span>
        <span className="px-4">{doubled}</span>
      </div>
    </div>
  );
}

export function EscrowBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#E8F5E9] border-l-4 border-l-[#2E7D32] p-4 text-sm text-[#1E293B]">
      {children}
    </div>
  );
}
