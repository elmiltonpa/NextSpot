"use client";

import { Utensils, Wine, Coffee, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryKey } from "@/constants/categories";

const icons = {
  food: Utensils,
  drink: Wine,
  coffee: Coffee,
  outdoors: TreePine,
};

const categories: { id: CategoryKey; label: string }[] = [
  { id: "food", label: "Comida" },
  { id: "drink", label: "Bebida" }, // Cambio: singular para consistencia
  { id: "coffee", label: "Café" },
  { id: "outdoors", label: "Aire Libre" }, // Cambio: plural
];

interface CategorySelectorProps {
  selected: CategoryKey[];
  onSelect: (categories: CategoryKey[]) => void;
}

export function CategorySelector({
  selected,
  onSelect,
}: CategorySelectorProps) {
  const toggleCategory = (id: CategoryKey) => {
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
        {categories.map(({ id, label }) => {
          const Icon = icons[id]; // Obtenemos el icono dinámicamente
          const isSelected = selected.includes(id);

          return (
            <button
              key={id}
              onClick={() => toggleCategory(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                "border cursor-pointer select-none", // Agregado cursor y select-none
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-lg animate-glow" // Simplifiqué un poco para asegurar contraste std
                  : "bg-secondary/50 text-secondary-foreground border-border/50 hover:bg-secondary hover:border-border hover:scale-105",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isSelected && "animate-float",
                )}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
