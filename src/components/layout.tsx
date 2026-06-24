import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ShieldCheck, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState, type ComponentType } from "react";
import { useAuth } from "@/hooks/use-auth";

export type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

function SidebarInner({
  items,
  badge,
  badgeKind = "verified",
  onNavigate,
}: {
  items: NavItem[];
  badge?: string;
  badgeKind?: "verified" | "pro";
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col bg-[#0F172A] text-white">
      <div className="px-6 pt-6 pb-4">
        <Link to="/" onClick={onNavigate} className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-bold text-[#4CAF50]">AgriLink</span>
          <span className="text-[10px] uppercase tracking-widest text-[#F9A825]">Solutions</span>
        </Link>
        {badge && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs"
            style={badgeKind === "verified"
              ? { backgroundColor: "rgba(46,125,50,0.15)", color: "#4CAF50" }
              : { backgroundColor: "rgba(249,168,37,0.15)", color: "#F9A825" }
            }>
            {badgeKind === "verified" && <ShieldCheck className="h-3.5 w-3.5" />}
            {badge}
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
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
        <button
          onClick={async () => {
            onNavigate?.();
            await signOut();
            navigate({ to: "/" });
          }}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function AppSidebar({
  items,
  badge,
  badgeKind = "verified",
  mobileOpen = false,
  onMobileClose,
}: {
  items: NavItem[];
  badge?: string;
  badgeKind?: "verified" | "pro";
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  return (
    <>
      <aside className="hidden md:flex w-64 shrink-0 flex-col min-h-screen sticky top-0">
        <SidebarInner items={items} badge={badge} badgeKind={badgeKind} />
      </aside>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onMobileClose} aria-hidden />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] md:hidden shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={onMobileClose}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarInner items={items} badge={badge} badgeKind={badgeKind} onNavigate={onMobileClose} />
          </aside>
        </>
      )}
    </>
  );
}

export function TopBar({
  greeting,
  initials,
  unread = 0,
  onMenuClick,
}: {
  greeting: string;
  initials: string;
  unread?: number;
  onMenuClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-[#E2E8F0] bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="md:hidden -ml-1 rounded-md p-2 text-[#64748B] hover:bg-[#F1F5F9]"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="font-display text-base sm:text-lg font-semibold text-[#1E293B] truncate">{greeting}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <Link to="/notifications" className="relative">
          <BellIcon />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{unread}</span>
          )}
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
      <div className="flex whitespace-nowrap py-3 animate-ticker text-xs sm:text-sm font-medium text-[#1E293B]">
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

export function useMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => { setOpen(false); }, [pathname]);
  return { open, setOpen, openMenu: () => setOpen(true), closeMenu: () => setOpen(false) };
}

export const ESCROW_LABEL: Record<string, string> = {
  funds_held: "Funds Held",
  ready_for_delivery: "Ready for Delivery",
  in_transit: "In Transit",
  delivered: "Delivered",
  released_to_farmer: "Released to Farmer",
};

export function EscrowPill({ status }: { status: string }) {
  const label = ESCROW_LABEL[status] ?? status;
  const styles: Record<string, string> = {
    funds_held: "bg-[#FFF8E1] text-[#7A5C0E]",
    ready_for_delivery: "bg-[#DBEAFE] text-[#1E40AF]",
    in_transit: "bg-[#FEF3C7] text-[#92400E]",
    delivered: "bg-[#DCFCE7] text-[#166534]",
    released_to_farmer: "bg-[#2E7D32] text-white",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${styles[status] ?? "bg-slate-100"}`}>{label}</span>;
}