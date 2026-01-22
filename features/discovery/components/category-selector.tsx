"use client";

import { Utensils, Wine, Coffee, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "food", label: "Comida", icon: Utensils },
  { id: "drinks", label: "Bebida", icon: Wine },
  { id: "coffee", label: "Café", icon: Coffee },
  { id: "outdoor", label: "Aire Libre", icon: TreePine },
];

interface CategorySelectorProps {
  selected: string[];
  onSelect: (categories: string[]) => void;
}

export function CategorySelector({
  selected,
  onSelect,
}: CategorySelectorProps) {
  const toggleCategory = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter((c) => c !== id));
    } else {
      onSelect([...selected, id]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Categoría
      </label>
      <div className="flex gap-2 flex-wrap">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => toggleCategory(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              "border",
              selected.includes(id)
                ? "bg-linear-to-r from-primary to-primary/90 text-primary-foreground border-primary/50 shadow-lg animate-glow"
                : "bg-secondary/50 text-secondary-foreground border-border/50 hover:bg-secondary hover:border-border hover:scale-105",
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                selected.includes(id) && "animate-float",
              )}
            />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
