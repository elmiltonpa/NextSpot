"use client";

import { cn } from "@/lib/utils";

const prices = [
  { id: "low", label: "$" },
  { id: "medium", label: "$$" },
  { id: "high", label: "$$$" },
];

interface PriceSelectorProps {
  selected: string[];
  onSelect: (prices: string[]) => void;
}

export function PriceSelector({ selected, onSelect }: PriceSelectorProps) {
  const togglePrice = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((p) => p !== id));
    } else {
      onSelect([...selected, id]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Precio
      </label>
      <div className="flex rounded-xl bg-secondary/30 p-1 border border-border/30">
        {prices.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => togglePrice(id)}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-300",
              selected.includes(id)
                ? "bg-white text-foreground shadow-md border border-border/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/50",
            )}
          >
            <span className={cn(
              "transition-all duration-300",
              selected.includes(id) && "text-primary"
            )}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
