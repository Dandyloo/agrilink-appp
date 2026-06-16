// Static seed data for AgriLink demo

export const REGIONS = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Central", "Volta",
  "Northern", "Upper East", "Upper West", "Brong-Ahafo", "Oti",
  "Savannah", "North East", "Western North", "Ahafo", "Bono East",
];

export type Listing = {
  id: string;
  crop: string;
  farmer: string;
  region: string;
  price: number;
  qty: number;
  available: string;
  status: "Active" | "Pending" | "Sold";
  cold: boolean;
  image: string;
};

export const LISTINGS: Listing[] = [
  { id: "L1", crop: "Maize", farmer: "Kwame Asante", region: "Brong-Ahafo", price: 4.5, qty: 500, available: "2026-07-01", status: "Active", cold: false, image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400" },
  { id: "L2", crop: "Tomatoes", farmer: "Abena Mensah", region: "Ashanti", price: 12.0, qty: 200, available: "2026-06-25", status: "Active", cold: true, image: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400" },
  { id: "L3", crop: "Yam", farmer: "Kofi Boateng", region: "Volta", price: 8.0, qty: 350, available: "2026-07-10", status: "Active", cold: false, image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400" },
  { id: "L4", crop: "Plantain", farmer: "Ama Owusu", region: "Central", price: 6.5, qty: 400, available: "2026-06-30", status: "Active", cold: false, image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400" },
  { id: "L5", crop: "Cocoa", farmer: "Yaw Darko", region: "Western", price: 45.0, qty: 150, available: "2026-08-01", status: "Active", cold: false, image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400" },
  { id: "L6", crop: "Cassava", farmer: "Akosua Frimpong", region: "Eastern", price: 3.2, qty: 600, available: "2026-07-15", status: "Active", cold: false, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
];

export type EscrowStatus = "Funds Held" | "Ready for Delivery" | "In Transit" | "Delivered" | "Released to Farmer";

export type Order = {
  id: string;
  crop: string;
  buyer: string;
  farmer: string;
  region: string;
  qty: number;
  value: number;
  escrow: EscrowStatus;
  date: string;
  image: string;
};

export const FARMER_ORDERS: Order[] = [
  { id: "AG-101", crop: "Maize", buyer: "Ama Buyer", farmer: "Kwame Asante", region: "Brong-Ahafo", qty: 200, value: 900, escrow: "Funds Held", date: "2026-06-14", image: LISTINGS[0].image },
  { id: "AG-102", crop: "Tomatoes", buyer: "Greenfield Foods", farmer: "Abena Mensah", region: "Ashanti", qty: 100, value: 1200, escrow: "In Transit", date: "2026-06-10", image: LISTINGS[1].image },
  { id: "AG-103", crop: "Yam", buyer: "Akwaaba Markets", farmer: "Kofi Boateng", region: "Volta", qty: 150, value: 1200, escrow: "Released to Farmer", date: "2026-06-05", image: LISTINGS[2].image },
];

export const BUYER_ORDERS: Order[] = [
  { id: "AG-201", crop: "Maize", buyer: "Ama Buyer", farmer: "Kwame Asante", region: "Brong-Ahafo", qty: 200, value: 900, escrow: "Funds Held", date: "2026-06-14", image: LISTINGS[0].image },
  { id: "AG-202", crop: "Plantain", buyer: "Ama Buyer", farmer: "Ama Owusu", region: "Central", qty: 80, value: 520, escrow: "In Transit", date: "2026-06-11", image: LISTINGS[3].image },
  { id: "AG-203", crop: "Cassava", buyer: "Ama Buyer", farmer: "Akosua Frimpong", region: "Eastern", qty: 300, value: 960, escrow: "Released to Farmer", date: "2026-06-02", image: LISTINGS[5].image },
];

export const COMMODITY_PRICES = [
  { crop: "Maize", price: 4.5, change: 2.3, region: "Brong-Ahafo", image: LISTINGS[0].image, trend: [3.8, 4.0, 4.1, 4.0, 4.2, 4.3, 4.5] },
  { crop: "Tomatoes", price: 12.0, change: -1.1, region: "Ashanti", image: LISTINGS[1].image, trend: [12.5, 12.4, 12.3, 12.2, 12.1, 12.1, 12.0] },
  { crop: "Yam", price: 8.0, change: 0.5, region: "Volta", image: LISTINGS[2].image, trend: [7.7, 7.8, 7.9, 7.9, 7.9, 8.0, 8.0] },
  { crop: "Plantain", price: 6.5, change: 3.2, region: "Central", image: LISTINGS[3].image, trend: [5.9, 6.0, 6.1, 6.2, 6.3, 6.4, 6.5] },
  { crop: "Cocoa", price: 45.0, change: -0.8, region: "Western", image: LISTINGS[4].image, trend: [45.8, 45.6, 45.4, 45.3, 45.2, 45.1, 45.0] },
  { crop: "Cassava", price: 3.2, change: 1.7, region: "Eastern", image: LISTINGS[5].image, trend: [2.9, 3.0, 3.0, 3.1, 3.1, 3.15, 3.2] },
];

export const TICKER = "Live prices: Maize GHS 4.50/kg ↑2.3%  ·  Tomatoes GHS 12.00/kg ↓1.1%  ·  Yam GHS 8.00/kg ↑0.5%  ·  Plantain GHS 6.50/kg ↑3.2%  ·  Cocoa GHS 45.00/kg ↓0.8%  ·  Cassava GHS 3.20/kg ↑1.7%";

export const FARMER = {
  name: "Kwame Asante",
  initials: "KA",
  phone: "+233 24 123 4567",
  region: "Brong-Ahafo",
  coop: "Brong Farmers Union",
  verified: true,
  wallet: 2450,
  earnings: 12450,
  finance: 2200,
};

export const BUYER = {
  name: "Ama Buyer",
  initials: "AB",
  phone: "+233 20 987 6543",
  subscription: "Pro Buyer · GHS 500/mo",
  totalSpent: 8750,
  active: 3,
  completed: 7,
};

export const FARMER_TRANSACTIONS = [
  { date: "15 Jun 2026", desc: "Maize sale (500kg)", amount: 2250, type: "Credit", status: "Completed" },
  { date: "10 Jun 2026", desc: "MoMo withdrawal", amount: -1500, type: "Debit", status: "Completed" },
  { date: "5 Jun 2026", desc: "Tomatoes sale (200kg)", amount: 2400, type: "Credit", status: "Completed" },
  { date: "1 Jun 2026", desc: "Input credit repayment", amount: -800, type: "Debit", status: "Completed" },
  { date: "28 May 2026", desc: "Yam sale (350kg)", amount: 2800, type: "Credit", status: "Completed" },
];

export const FARMER_NOTIFICATIONS = [
  { id: 1, title: "New order received", desc: "Ama Buyer placed an order for 200kg of Maize", time: "2h ago", unread: true, kind: "Orders", color: "#2E7D32" },
  { id: 2, title: "Input credit approved", desc: "Your GHS 1,200 input credit has been approved", time: "1d ago", unread: true, kind: "Finance", color: "#F9A825" },
  { id: 3, title: "Price alert", desc: "Cocoa prices up 5% in Western Region", time: "2d ago", unread: false, kind: "Prices", color: "#4CAF50" },
  { id: 4, title: "Delivery confirmed", desc: "Order #AG-004 delivery confirmed. Escrow released", time: "3d ago", unread: false, kind: "Orders", color: "#2E7D32" },
];

export const BUYER_NOTIFICATIONS = [
  { id: 1, title: "Order confirmed", desc: "Kwame Asante confirmed your Maize order", time: "3h ago", unread: true, kind: "Orders", color: "#2E7D32" },
  { id: 2, title: "In transit", desc: "Your Tomatoes order from Abena Mensah is in transit", time: "1d ago", unread: true, kind: "Orders", color: "#F59E0B" },
  { id: 3, title: "Escrow released", desc: "Funds released for completed Yam order", time: "3d ago", unread: false, kind: "Finance", color: "#2E7D32" },
];

export const CROP_TYPES = ["Cereals", "Vegetables", "Tubers", "Fruits", "Cash Crops"];

export const ghs = (n: number) => `GHS ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
