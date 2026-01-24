"use client";

import { useState } from "react";
import { CategorySelector } from "./category-selector";
import { DistanceSelector } from "./distance-selector";
import { PriceSelector } from "./price-selector";
import { SurpriseButton } from "./surprise-button";
import { Coordinates } from "@/types/location";
import { toast } from "sonner";
import { GOOGLE_TYPE_MAPPING, CategoryKey } from "@/constants/categories";
import { getRandomPlace } from "@/actions/get-random-place";

// Mapeo de distancias a metros
const distanceToMeters: Record<string, number> = {
  near: 1000,
  medium: 5000,
  far: 10000,
};

interface BottomSheetProps {
  userLocation: Coordinates | null;
}

export function BottomSheet({ userLocation }: BottomSheetProps) {
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([
    "food",
  ]);
  const [selectedDistance, setSelectedDistance] = useState("near");
  const [selectedPrices, setSelectedPrices] = useState<string[]>([
    "low",
    "medium",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSurprise = async () => {
    if (!userLocation) {
      const message = "No se pudo obtener tu ubicación";
      setError(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiTypes = selectedCategories.flatMap(
        (cat) => GOOGLE_TYPE_MAPPING[cat as CategoryKey],
      );

      const typesToSend = apiTypes.length > 0 ? apiTypes : ["restaurant"];

      const radius = distanceToMeters[selectedDistance];

      const place = await getRandomPlace(
        userLocation.lat,
        userLocation.lng,
        selectedPrices,
        typesToSend,
        radius,
      );

      if ("error" in place) {
        throw new Error(place.error);
      }

      // EXITO
      console.log("Ganador:", place);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    selectedCategories.length === 0 ||
    selectedPrices.length === 0 ||
    !userLocation;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 pointer-events-none">
      <div className="max-w-lg mx-auto">
        {/* Main panel */}
        <div
          className="bg-white rounded-3xl pointer-events-auto shadow-2xl border border-gray-100 p-5 space-y-5 relative overflow-hidden"
          style={{
            boxShadow:
              "0 -10px 40px -10px rgba(0, 0, 0, 0.12), 0 -4px 20px -4px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Drag handle indicator */}
          <div className="flex justify-center -mt-2 mb-2">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Category selector */}
          <CategorySelector
            selected={selectedCategories}
            onSelect={setSelectedCategories}
          />

          {/* Distance and Price row */}
          <div className="grid grid-cols-2 gap-4">
            <DistanceSelector
              selected={selectedDistance}
              onSelect={setSelectedDistance}
            />
            <PriceSelector
              selected={selectedPrices}
              onSelect={setSelectedPrices}
            />
          </div>

          {/* CTA Button */}
          <SurpriseButton
            isLoading={isLoading}
            onClick={handleSurprise}
            disabled={isDisabled}
          />

          {/* Helper text */}
          {error && <p className="text-xs text-center text-red-500">{error}</p>}
          {isDisabled && !error && (
            <p className="text-xs text-center text-muted-foreground">
              Selecciona al menos una categoría y un rango de precio
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
