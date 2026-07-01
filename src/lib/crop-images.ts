// Curated crop image map + helpers shared across listings, prices, and tickers.

const FALLBACK = "https://www.harvestplus.org/wp-content/uploads/2021/08/Orange-maize-2.png";

const MAP: Record<string, string> = {
  maize:      "https://www.harvestplus.org/wp-content/uploads/2021/08/Orange-maize-2.png",
  tomatoes:   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxn_l5-uZSNaM_Yy8gJLG1QAYHc_uLoYE0CNr7SWV8zw&s=10",
  tomato:     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxn_l5-uZSNaM_Yy8gJLG1QAYHc_uLoYE0CNr7SWV8zw&s=10",
  yam:        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBrKHGYlH6n7ecOTWGqsp6-wOa4DrMRm-gJa9lSORP9g&s=10",
  plantain:   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTanil9y6hUOuh2VamLj_pgabVtZO7vQ9kYyDMiS-AuUw&s=10",
  cocoa:      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3LT2i_v8BU24OXB6IGidBy3KTzksMIRUl0qDbIxa0cQ&s=10",
  cassava:    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFCcmQHOmwUFV37ZGEwGrkMpULEE4d9AwuGsWOhYIRTw&s=10",
  rice:       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBUTxGZqJo5-BElEBEqBfXePS1fNQtbZfxCrYXt5mVDw&s=10",
  beans:      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIYcEBYJjQ70a8eEb-DMH0KVFH4cbJHsVSNbZLy_-Kqg&s=10",
  onion:      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfgbJzNcsFhjnw_INNwT4f1_26JNchQLWmRq2yX6WKOA&s=10",
  onions:     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfgbJzNcsFhjnw_INNwT4f1_26JNchQLWmRq2yX6WKOA&s=10",
  pepper:     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOWaACxSvC5mlMc8JyXA6D1VjqA_qn84CE3qJojgCClg&s=10",
  peppers:    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOWaACxSvC5mlMc8JyXA6D1VjqA_qn84CE3qJojgCClg&s=10",
  groundnut:  "https://www.harvestplus.org/wp-content/uploads/2021/08/Orange-maize-2.png",
  groundnuts: "https://www.harvestplus.org/wp-content/uploads/2021/08/Orange-maize-2.png",
  peanut:     "https://www.harvestplus.org/wp-content/uploads/2021/08/Orange-maize-2.png",
};

export function imageForCrop(name: string | null | undefined): string {
  if (!name) return FALLBACK;
  const key = name.trim().toLowerCase();
  if (MAP[key]) return MAP[key];
  // partial match — e.g. "yellow maize" → maize image
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