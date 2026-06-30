import { LayoutDashboard, ListChecks, Package, Wallet, TrendingUp, Bell, Settings, HandCoins, Store } from "lucide-react";
import type { NavItem, BottomNavItem } from "./layout";

export const FARMER_NAV: NavItem[] = [
  { to: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/farmer/listings", label: "My Listings", icon: ListChecks },
  { to: "/farmer/orders", label: "Orders", icon: Package },
  { to: "/farmer/finance", label: "Finance Hub", icon: HandCoins },
  { to: "/farmer/wallet", label: "Wallet & Earnings", icon: Wallet },
  { to: "/farmer/prices", label: "Commodity Prices", icon: TrendingUp },
  { to: "/farmer/notifications", label: "Notifications", icon: Bell },
  { to: "/farmer/settings", label: "Settings", icon: Settings },
];

// Bottom nav: 5 most important for mobile
export const FARMER_BOTTOM_NAV: BottomNavItem[] = [
  { to: "/farmer/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/farmer/listings", label: "Listings", icon: ListChecks },
  { to: "/farmer/orders", label: "Orders", icon: Package },
  { to: "/farmer/wallet", label: "Wallet", icon: Wallet },
  { to: "/farmer/finance", label: "Finance", icon: HandCoins },
];

export const BUYER_NAV: NavItem[] = [
  { to: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/buyer/marketplace", label: "Marketplace", icon: Store },
  { to: "/buyer/orders", label: "My Orders", icon: Package },
  { to: "/buyer/analytics", label: "Procurement Analytics", icon: TrendingUp },
  { to: "/buyer/notifications", label: "Notifications", icon: Bell },
  { to: "/buyer/settings", label: "Settings", icon: Settings },
];

// Bottom nav: 5 most important for mobile
export const BUYER_BOTTOM_NAV: BottomNavItem[] = [
  { to: "/buyer/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/buyer/marketplace", label: "Market", icon: Store },
  { to: "/buyer/orders", label: "Orders", icon: Package },
  { to: "/buyer/analytics", label: "Analytics", icon: TrendingUp },
  { to: "/buyer/notifications", label: "Alerts", icon: Bell },
];