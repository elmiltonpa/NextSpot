"use client";

import { cn } from "@/lib/utils";
import { Clock, Sun } from "lucide-react";

interface AvailabilitySelectorProps {
  selected: boolean | null;
  onSelect: (value: boolean | null) => void;
}

export function AvailabilitySelector({
  selected,
  onSelect,
}: AvailabilitySelectorProps) {
  const options = [
    {
      id: "open",
      label: "Abierto ahora",
      value: true,
      icon: Sun,
    },
    {
      id: "all",
      label: "Todos",
      value: null,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Disponibilidad
      </label>
      <div className="flex rounded-xl bg-secondary/30 p-1 border border-border/30">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.value;

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg text-sm font-semibold transition-all duration-300",
                isSelected
                  ? "bg-white text-foreground shadow-md border border-border/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4",
                  isSelected ? "text-primary" : "opacity-70",
                )}
              />
              <span
                className={cn(
                  "transition-all duration-300",
                  isSelected && "text-primary",
                )}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
