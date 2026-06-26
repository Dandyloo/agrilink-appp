// src/components/ghana-map.tsx
// SVG choropleth of Ghana regions showing active listing counts.
// No external map library needed — pure SVG paths.
// Use inside buyer.marketplace.tsx or a dedicated /buyer/map route.
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Simplified region polygons as SVG paths (proportional, not geo-accurate)
// viewBox: 0 0 300 380
const REGIONS: Record<string, { path: string; cx: number; cy: number }> = {
  "Greater Accra": {
    path: "M180 330 L210 320 L225 340 L200 355 L175 345 Z",
    cx: 200, cy: 338,
  },
  "Central": {
    path: "M130 295 L175 285 L180 330 L175 345 L140 340 L120 320 Z",
    cx: 152, cy: 315,
  },
  "Western": {
    path: "M55 275 L130 265 L130 295 L120 320 L90 340 L50 310 Z",
    cx: 90, cy: 300,
  },
  "Eastern": {
    path: "M175 245 L225 235 L240 265 L210 285 L180 295 L175 285 L175 265 Z",
    cx: 205, cy: 265,
  },
  "Ashanti": {
    path: "M130 225 L175 215 L175 265 L175 285 L130 295 L115 270 L125 245 Z",
    cx: 150, cy: 255,
  },
  "Volta": {
    path: "M225 235 L270 220 L280 270 L260 300 L240 295 L240 265 Z",
    cx: 255, cy: 260,
  },
  "Brong-Ahafo": {
    path: "M100 175 L175 165 L175 215 L130 225 L115 210 L95 195 Z",
    cx: 138, cy: 195,
  },
  "Oti": {
    path: "M230 190 L270 175 L275 220 L240 235 L225 235 L220 205 Z",
    cx: 248, cy: 208,
  },
  "Northern": {
    path: "M90 95 L215 80 L225 140 L220 175 L175 165 L100 175 L80 130 Z",
    cx: 155, cy: 128,
  },
  "Savannah": {
    path: "M55 95 L90 95 L80 130 L70 160 L40 150 L35 110 Z",
    cx: 62, cy: 122,
  },
  "North East": {
    path: "M215 80 L255 70 L260 120 L230 135 L225 140 Z",
    cx: 238, cy: 103,
  },
  "Upper East": {
    path: "M190 40 L250 35 L255 70 L215 80 L185 75 Z",
    cx: 220, cy: 58,
  },
  "Upper West": {
    path: "M100 30 L190 40 L185 75 L150 85 L90 95 L80 60 Z",
    cx: 140, cy: 60,
  },
  "Ahafo": {
    path: "M80 175 L100 175 L95 195 L115 210 L115 225 L80 225 L65 200 Z",
    cx: 90, cy: 200,
  },
  "Bono East": {
    path: "M100 175 L130 170 L130 225 L115 225 L115 210 L95 195 Z",
    cx: 113, cy: 197,
  },
  "Western North": {
    path: "M55 220 L80 225 L65 265 L55 275 L40 255 L42 225 Z",
    cx: 58, cy: 248,
  },
};

function getColor(count: number, max: number): string {
  if (count === 0) return "#E8F5E9";
  const ratio = count / Math.max(max, 1);
  if (ratio < 0.25) return "#A5D6A7";
  if (ratio < 0.5) return "#66BB6A";
  if (ratio < 0.75) return "#43A047";
  return "#2E7D32";
}

export function GhanaMap({ onRegionClick }: { onRegionClick?: (region: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const { data: counts = {} } = useQuery({
    queryKey: ["listings-by-region"],
    queryFn: async () => {
      const { data } = await supabase
        .from("produce_listings")
        .select("region")
        .eq("status", "active");
      const map: Record<string, number> = {};
      (data ?? []).forEach((row) => {
        map[row.region] = (map[row.region] ?? 0) + 1;
      });
      return map;
    },
    staleTime: 60_000,
  });

  const max = Math.max(1, ...Object.values(counts));

  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-sm">Listings by region</h3>
        {hovered && (
          <span className="text-xs text-[#2E7D32] font-medium">
            {hovered}: {counts[hovered] ?? 0} listing{(counts[hovered] ?? 0) !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <svg
        viewBox="0 0 310 380"
        className="w-full max-w-xs mx-auto"
        style={{ maxHeight: 340 }}
        aria-label="Ghana map showing active listings by region"
      >
        {Object.entries(REGIONS).map(([name, { path, cx, cy }]) => {
          const count = counts[name] ?? 0;
          const isHovered = hovered === name;
          return (
            <g
              key={name}
              onClick={() => onRegionClick?.(name)}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: onRegionClick ? "pointer" : "default" }}
            >
              <path
                d={path}
                fill={getColor(count, max)}
                stroke={isHovered ? "#1B5E20" : "#fff"}
                strokeWidth={isHovered ? 2 : 0.8}
                opacity={isHovered ? 1 : 0.92}
              />
              {count > 0 && (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="9"
                  fontWeight="600"
                  fill="#fff"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {count}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-[#64748B]">
        <span>Low</span>
        {["#E8F5E9", "#A5D6A7", "#66BB6A", "#43A047", "#2E7D32"].map((c) => (
          <div key={c} className="h-3 w-5 rounded-sm" style={{ background: c }} />
        ))}
        <span>High</span>
      </div>
    </div>
  );
}