"use client";

import { useState } from "react";
import { CategorySelector } from "./category-selector";
import { DistanceSelector } from "./distance-selector";
import { PriceSelector } from "./price-selector";
import { SurpriseButton } from "./surprise-button";
import { Coordinates } from "@/types/location";
import { toast } from "sonner";

// Mapeo de categorías a tipos de Google Places
const categoryToType: Record<string, string> = {
  food: "restaurant",
  drinks: "bar",
  coffee: "cafe",
  outdoor: "park",
};

// Mapeo de distancias a metros
const distanceToMeters: Record<string, number> = {
  near: 1000, // 1km
  medium: 5000, // 5km
  far: 10000, // 10km
};

interface BottomSheetProps {
  userLocation: Coordinates | null;
}

export function BottomSheet({ userLocation }: BottomSheetProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
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
      setError("No se pudo obtener tu ubicación");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Elegir una categoría aleatoria de las seleccionadas
      const randomCategory =
        selectedCategories[
          Math.floor(Math.random() * selectedCategories.length)
        ];
      const placeType = categoryToType[randomCategory];
      const radius = distanceToMeters[selectedDistance];

      // Construir query params
      const params = new URLSearchParams({
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString(),
        radius: radius.toString(),
        type: placeType,
      });

      // Llamar a la API
      const response = await fetch(`/api/places/nearby?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al buscar lugares");
      }

      // TODO: Mostrar el lugar en el mapa o modal
      alert(`¡Encontré algo! ${data.name} - ${data.address}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido al buscar lugares";
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
