import { LayoutDashboard, ListChecks, Package, Wallet, TrendingUp, Bell, Settings, Phone, HandCoins } from "lucide-react";
import type { NavItem } from "./layout";

export const FARMER_NAV: NavItem[] = [
  { to: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/farmer/listings", label: "My Listings", icon: ListChecks },
  { to: "/farmer/orders", label: "Orders", icon: Package },
  { to: "/farmer/finance", label: "Finance Hub", icon: HandCoins },
  { to: "/farmer/wallet", label: "Wallet & Earnings", icon: Wallet },
  { to: "/farmer/prices", label: "Commodity Prices", icon: TrendingUp },
  { to: "/farmer/notifications", label: "Notifications", icon: Bell },
  { to: "/ussd", label: "USSD Simulator", icon: Phone },
  { to: "/farmer/settings", label: "Settings", icon: Settings },
];

export const BUYER_NAV: NavItem[] = [
  { to: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/buyer/marketplace", label: "Marketplace", icon: ListChecks },
  { to: "/buyer/orders", label: "My Orders", icon: Package },
  { to: "/buyer/analytics", label: "Procurement Analytics", icon: TrendingUp },
  { to: "/buyer/notifications", label: "Notifications", icon: Bell },
  { to: "/ussd", label: "USSD Simulator", icon: Phone },
  { to: "/buyer/settings", label: "Settings", icon: Settings },
];
