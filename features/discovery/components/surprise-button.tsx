"use client";

import { Dice5, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurpriseButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function SurpriseButton({
  isLoading,
  onClick,
  disabled,
}: SurpriseButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative w-full py-4 px-6 rounded-2xl font-bold text-lg",
        "text-white",
        "shadow-lg",
        "transition-all duration-300",
        "hover:shadow-2xl hover:scale-[1.02]",
        "active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg",
        "overflow-hidden group",
      )}
      style={{
        backgroundImage: disabled
          ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
          : "linear-gradient(135deg, #f97316 0%, #ea580c 25%, #dc2626 50%, #f97316 75%, #ea580c 100%)",
        backgroundSize: disabled ? "100% 100%" : "200% 200%",
        backgroundPosition: "0% 50%",
        animation: disabled ? "none" : "gradient-shift 3s ease infinite",
        boxShadow: disabled
          ? "0 10px 25px -5px rgba(107, 114, 128, 0.3)"
          : "0 10px 25px -5px rgba(234, 88, 12, 0.4), 0 4px 10px -3px rgba(220, 38, 38, 0.3)",
      }}
    >
      {/* Animated shimmer overlay on hover */}
      <div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          transform: "skewX(-20deg) translateX(-100%)",
        }}
      />

      {/* Loading shimmer */}
      {isLoading && (
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      )}

      <span className="relative flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
            </div>
            <span className="ml-1">Buscando...</span>
          </>
        ) : (
          <>
            <Dice5 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
            <span>{"¡Sorpréndeme!"}</span>
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </>
        )}
      </span>
    </button>
  );
}
