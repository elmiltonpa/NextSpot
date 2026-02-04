"use client";

import { useEffect, useState, memo } from "react";
import { ArrowLeft, MapPin, Heart, Loader2 } from "lucide-react";
import Image from "next/image";
import { getFavorites } from "@/actions/favorites";
import { PlaceResult } from "@/types/places";
import { getPlaceDetails } from "@/actions/get-place-details";
import { toast } from "sonner";
import { SavedPlace } from "../../../lib/generated/prisma/client";

interface FavoritesViewProps {
  onBack: () => void;
  onSelect: (place: PlaceResult) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

export const FavoritesView = memo(function FavoritesView({
  onBack,
  onSelect,
}: FavoritesViewProps) {
  const [favorites, setFavorites] = useState<SavedPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites();
        setFavorites(data);
      } catch {
        toast.error("Error al cargar favoritos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleItemClick = async (item: SavedPlace) => {
    setLoadingItemId(item.id);
    try {
      const details = await getPlaceDetails(item.googlePlaceId);

      if ("error" in details) {
        toast.error(details.error);
        return;
      }

      onSelect(details);
    } catch {
      toast.error("No se pudieron cargar los detalles");
    } finally {
      setLoadingItemId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-left-4 duration-300">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Tus Favoritos</h2>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "1px 1000px",
        }}
      >
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2">
            <Heart className="h-12 w-12 text-gray-300" />
            <p>Aún no tienes favoritos.</p>
            <p className="text-xs">
              ¡Dale al corazón en los lugares que te gusten!
            </p>
          </div>
        ) : (
          favorites.map((item) => {
            const photoUrl = item.image
              ? `https://places.googleapis.com/v1/${item.image}/media?key=${API_KEY}&maxHeightPx=400&maxWidthPx=400`
              : null;

            const isItemLoading = loadingItemId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                disabled={isItemLoading}
                className="w-full text-left group flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-red-100 hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  {isItemLoading && (
                    <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-sm">
                      <Loader2 className="h-6 w-6 text-red-500 animate-spin" />
                    </div>
                  )}
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <MapPin className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                    <Heart className="h-3 w-3 fill-red-500 text-red-500 shrink-0 ml-2" />
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {item.address}
                  </p>
                  {item.rating && (
                    <span className="text-[10px] text-amber-500 font-medium mt-2">
                      ★ {item.rating}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
});
