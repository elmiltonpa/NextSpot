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
import { useLocation } from "@/context/location-context";
import { AvailabilitySelector } from "./availability-selector";
import { PlaceDetailView } from "./place-detail-view";
import { ArrowRight } from "lucide-react";

const distanceToMeters: Record<string, number> = {
  near: 1000,
  medium: 5000,
  far: 10000,
};

interface BottomSheetProps {
  userLocation: Coordinates | null;
}

export function DiscoverySidebar({ userLocation }: BottomSheetProps) {
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([
    "food",
  ]);
  const [selectedDistance, setSelectedDistance] = useState("near");
  const [selectedPrices, setSelectedPrices] = useState<string[]>([
    "low",
    "medium",
  ]);

  // currentOpeningHours.openNow : Boolean
  const [selectedAvailability, setSelectedAvailability] = useState<
    boolean | null
  >(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"search" | "details">("search");

  const { selectedPlace, setSelectedPlace } = useLocation();

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
        selectedAvailability,
      );

      if ("error" in place) {
        throw new Error(place.error);
      }
      setSelectedPlace(place);
      setViewMode("details");
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
    <div className="fixed top-0 left-0 bottom-0 z-50 pointer-events-none w-full max-w-100">
      {/* Main panel */}
      <div
        className="h-full bg-white pointer-events-auto shadow-2xl border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out"
        style={{
          boxShadow: "10px 0 40px -10px rgba(0, 0, 0, 0.12)",
        }}
      >
        {viewMode === "details" && selectedPlace ? (
          <PlaceDetailView
            place={selectedPlace}
            onBack={() => setViewMode("search")}
          />
        ) : (
          <>
            <div className="p-6 pb-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Descubre
              </h1>
              <p className="text-sm text-gray-500">
                Encuentra el lugar perfecto para ti
              </p>

              {/* Botón para volver al último resultado si existe */}
              {selectedPlace && (
                <button
                  onClick={() => setViewMode("details")}
                  className="mt-4 w-full flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                      Último hallazgo
                    </span>
                    <span className="text-sm font-bold truncate max-w-50">
                      {selectedPlace.displayName.text}
                    </span>
                  </div>
                  <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              {/* Category selector */}
              <CategorySelector
                selected={selectedCategories}
                onSelect={setSelectedCategories}
              />

              {/* Distance selector */}
              <DistanceSelector
                selected={selectedDistance}
                onSelect={setSelectedDistance}
              />

              {/* Price selector */}
              <PriceSelector
                selected={selectedPrices}
                onSelect={setSelectedPrices}
              />

              <AvailabilitySelector
                selected={selectedAvailability}
                onSelect={setSelectedAvailability}
              />
            </div>

            {/* CTA Button at the bottom */}
            <div className="p-6 pt-4 border-t border-gray-100">
              <SurpriseButton
                isLoading={isLoading}
                onClick={handleSurprise}
                disabled={isDisabled}
              />

              {isDisabled && !error && (
                <p className="mt-4 text-xs text-center text-muted-foreground">
                  Selecciona al menos una categoría y un rango de precio
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
