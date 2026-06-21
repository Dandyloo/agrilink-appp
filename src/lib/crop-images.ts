// Curated crop image map + helpers shared across listings, prices, and tickers.

const FALLBACK = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"; // generic fresh produce

const MAP: Record<string, string> = {
  maize: "https://images.unsplash.com/photo-1601593768799-76d3ef0d7a4f?w=600&q=80",
  tomatoes: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600&q=80",
  tomato: "https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=600&q=80",
  yam: "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=600&q=80",
  plantain: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80",
  cocoa: "https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=600&q=80",
  cassava: "https://images.unsplash.com/photo-1599321955726-7d6e8b7c3e6f?w=600&q=80",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80",
  beans: "https://images.unsplash.com/photo-1612257999691-c63ad2ee5b1f?w=600&q=80",
  onion: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
  onions: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
  pepper: "https://images.unsplash.com/photo-1583119912267-cc97c911e416?w=600&q=80",
  peppers: "https://images.unsplash.com/photo-1583119912267-cc97c911e416?w=600&q=80",
  groundnut: "https://images.unsplash.com/photo-1567204570206-7a83b310b9ba?w=600&q=80",
  groundnuts: "https://images.unsplash.com/photo-1567204570206-7a83b310b9ba?w=600&q=80",
  peanut: "https://images.unsplash.com/photo-1567204570206-7a83b310b9ba?w=600&q=80",
};

export function imageForCrop(name: string | null | undefined): string {
  if (!name) return FALLBACK;
  const key = name.trim().toLowerCase();
  if (MAP[key]) return MAP[key];
  // try partial match (e.g. "yellow maize")
  for (const k of Object.keys(MAP)) if (key.includes(k)) return MAP[k];
  return FALLBACK;
}

export const CURATED_CROPS = [
  "Maize", "Tomatoes", "Yam", "Plantain", "Cocoa", "Cassava",
  "Rice", "Beans", "Onion", "Pepper", "Groundnut",
];

export function timeGreeting(name: string | null | undefined, role: "Farmer" | "Buyer" = "Farmer") {
  const first = (name?.trim().split(/\s+/)[0]) || role;
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return `${part}, ${first}`;
}
