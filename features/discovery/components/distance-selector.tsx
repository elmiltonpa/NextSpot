"use client";

import { cn } from "@/lib/utils";

const distances = [
  { id: "near", label: "Cerca", value: "1km" },
  { id: "medium", label: "Medio", value: "5km" },
  { id: "far", label: "Lejos", value: "10km" },
];

interface DistanceSelectorProps {
  selected: string;
  onSelect: (distance: string) => void;
}

export function DistanceSelector({
  selected,
  onSelect,
}: DistanceSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Distancia
      </label>
      <div className="flex rounded-xl bg-secondary/30 p-1 border border-border/30">
        {distances.map(({ id, label, value }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "flex-1 flex flex-col items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300",
              selected === id
                ? "bg-white text-foreground shadow-md border border-border/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/50",
            )}
          >
            <span className={cn(
              "transition-all duration-300",
              selected === id && "font-semibold"
            )}>{label}</span>
            <span className={cn(
              "text-xs transition-all duration-300",
              selected === id ? "text-primary font-medium" : "text-muted-foreground"
            )}>{value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
