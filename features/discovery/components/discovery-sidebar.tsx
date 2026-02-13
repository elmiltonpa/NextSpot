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
import { HistoryView } from "./history-view";
import { FavoritesView } from "./favorites-view";
import { ArrowRight, History, Heart, ChevronRight } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const distanceToMeters: Record<string, number> = {
  near: 1000,
  medium: 5000,
  far: 10000,
};

interface FilterState {
  categories: CategoryKey[];
  distance: string;
  prices: string[];
  availability: boolean | null;
}

const DEFAULT_FILTERS: FilterState = {
  categories: ["food"],
  distance: "near",
  prices: ["low", "medium"],
  availability: true,
};

interface BottomSheetProps {
  userLocation: Coordinates | null;
}

export function DiscoverySidebar({ userLocation }: BottomSheetProps) {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(true);

  const [filters, setFilters] = useLocalStorage<FilterState>(
    "discovery_filters",
    DEFAULT_FILTERS,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<
    "search" | "details" | "history" | "favorites"
  >("search");

  const { selectedPlace, setSelectedPlace, setIsWinnerModalOpen } =
    useLocation();

  const setCategories = (categories: CategoryKey[]) =>
    setFilters((prev) => ({ ...prev, categories }));

  const setDistance = (distance: string) =>
    setFilters((prev) => ({ ...prev, distance }));

  const setPrices = (prices: string[]) =>
    setFilters((prev) => ({ ...prev, prices }));

  const setAvailability = (availability: boolean | null) =>
    setFilters((prev) => ({ ...prev, availability }));

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
      const apiTypes = filters.categories.flatMap(
        (cat) => GOOGLE_TYPE_MAPPING[cat as CategoryKey],
      );

      const typesToSend = apiTypes.length > 0 ? apiTypes : ["restaurant"];

      const radius = distanceToMeters[filters.distance];

      const place = await getRandomPlace(
        userLocation.lat,
        userLocation.lng,
        filters.prices,
        typesToSend,
        radius,
        filters.availability,
      );

      if ("error" in place) {
        throw new Error(place.error);
      }
      setSelectedPlace(place);
      setViewMode("details");
      setIsWinnerModalOpen(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    filters.categories.length === 0 ||
    filters.prices.length === 0 ||
    !userLocation;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 bottom-0 z-50 pointer-events-none w-70 sm:w-87.5 md:w-100 transition-transform duration-500 ease-in-out",
        !isOpen && "-translate-x-full",
      )}
    >
      <div
        className="h-full bg-white pointer-events-auto shadow-2xl border-r border-gray-100 flex flex-col relative"
        style={{
          boxShadow: "10px 0 40px -10px rgba(0, 0, 0, 0.12)",
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "absolute -right-12 top-1/2 -translate-y-1/2 bg-orange-500 shadow-lg shadow-orange-200 rounded-r-2xl p-3 cursor-pointer transition-all hover:bg-orange-600 group active:scale-95",
            !isOpen && "rounded-2xl -right-14",
          )}
          title={isOpen ? "Ocultar panel" : "Mostrar panel"}
        >
          <ChevronRight
            className={cn(
              "h-6 w-6 text-white transition-transform duration-500",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {viewMode === "details" && selectedPlace ? (
          <PlaceDetailView
            place={selectedPlace}
            onBack={() => setViewMode("search")}
          />
        ) : viewMode === "history" ? (
          <HistoryView
            onBack={() => setViewMode("search")}
            onSelect={(place) => {
              setSelectedPlace(place);
              setViewMode("details");
            }}
          />
        ) : viewMode === "favorites" ? (
          <FavoritesView
            onBack={() => setViewMode("search")}
            onSelect={(place) => {
              setSelectedPlace(place);
              setViewMode("details");
            }}
          />
        ) : (
          <>
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-2xl font-bold text-gray-900">Descubre</h1>
                {status === "authenticated" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewMode("history")}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-orange-500 transition-colors"
                      title="Ver Historial"
                    >
                      <History className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("favorites")}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500 transition-colors"
                      title="Ver Favoritos"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Encuentra el lugar perfecto para ti
              </p>

              {selectedPlace && (
                <button
                  onClick={() => setViewMode("details")}
                  className="mt-4 w-full flex items-center justify-between p-3 mb-1 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition-colors group"
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

            <div className="flex-1 space-y-8 overflow-y-auto p-6">
              <CategorySelector
                selected={filters.categories}
                onSelect={setCategories}
              />

              <DistanceSelector
                selected={filters.distance}
                onSelect={setDistance}
              />

              <PriceSelector selected={filters.prices} onSelect={setPrices} />

              <AvailabilitySelector
                selected={filters.availability}
                onSelect={setAvailability}
              />
            </div>

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
