import { ArrowLeft, MapPin, Star, Navigation, Heart } from "lucide-react";
import { PlaceResult } from "@/types/places";
import Image from "next/image";
import { useEffect, useState } from "react";
import { checkFavorite, toggleFavorite } from "@/actions/favorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface PlaceDetailViewProps {
  place: PlaceResult;
  onBack: () => void;
}

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

function formatPrice(priceLevel?: string) {
  switch (priceLevel) {
    case "PRICE_LEVEL_INEXPENSIVE":
      return { label: "Barato", symbol: "$" };
    case "PRICE_LEVEL_MODERATE":
      return { label: "Moderado", symbol: "$$" };
    case "PRICE_LEVEL_EXPENSIVE":
      return { label: "Caro", symbol: "$$$" };
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return { label: "Muy caro", symbol: "$$$$" };
    default:
      return null;
  }
}

export function PlaceDetailView({ place, onBack }: PlaceDetailViewProps) {
  const { status } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(true);

  const photoName = place.photos?.[0]?.name;
  const photoUrl = photoName
    ? `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxHeightPx=800&maxWidthPx=800`
    : null;

  const isOpen = place.currentOpeningHours?.openNow;
  const priceInfo = formatPrice(place.priceLevel);

  useEffect(() => {
    const initFavorite = async () => {
      if (!place.id || status !== "authenticated") {
        setIsLoadingFavorite(false);
        return;
      }
      try {
        const statusFav = await checkFavorite(place.id);
        setIsFavorite(statusFav);
      } catch {
      } finally {
        setIsLoadingFavorite(false);
      }
    };
    initFavorite();
  }, [place.id, status]);

  const handleToggleFavorite = async () => {
    if (status !== "authenticated") {
      toast.info("¡Inicia sesión para guardar tus lugares favoritos!");
      return;
    }

    if (!place.id) return;

    const previousState = isFavorite;
    setIsFavorite(!isFavorite);

    try {
      const result = await toggleFavorite({
        googlePlaceId: place.id,
        name: place.displayName.text,
        address: place.formattedAddress,
        image: place.photos?.[0]?.name,
        rating: place.rating,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsFavorite(result.isFavorite!);
      toast.success(
        result.isFavorite ? "Añadido a favoritos" : "Eliminado de favoritos",
      );
    } catch {
      setIsFavorite(previousState);
      toast.error("Error al actualizar favoritos");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right-4 duration-300">
      <div className="relative h-64 shrink-0">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 w-[calc(100%-2rem)] justify-between">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white transition-all active:scale-95 group"
            title="Volver a filtros"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={isLoadingFavorite}
            className="p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:bg-white transition-all active:scale-95 group"
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 group-hover:text-red-500",
              )}
            />
          </button>
        </div>

        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={place.displayName.text}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <MapPin className="h-16 w-16 text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md border border-white/20 text-xs font-medium mb-2">
            {place.primaryTypeDisplayName?.text || "Lugar"}
          </div>
          <h2 className="text-2xl font-bold leading-tight shadow-sm">
            {place.displayName.text}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="flex items-center justify-between text-sm border-b border-gray-100 pb-4">
          {place.rating && (
            <div className="flex flex-col items-center px-4 border-r border-gray-100 last:border-0 flex-1">
              <div className="flex items-center gap-1 font-bold text-gray-900 text-lg">
                <span>{place.rating}</span>
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-xs text-gray-500">
                {place.userRatingCount || 0} reviews
              </span>
            </div>
          )}

          {priceInfo && (
            <div className="flex flex-col items-center px-4 border-r border-gray-100 last:border-0 flex-1">
              <span className="font-bold text-gray-900 text-lg">
                {priceInfo.symbol}
              </span>
              <span className="text-xs text-gray-500">{priceInfo.label}</span>
            </div>
          )}

          <div className="flex flex-col items-center px-4 flex-1">
            <span
              className={`font-bold text-lg ${isOpen ? "text-green-600" : "text-red-500"}`}
            >
              {isOpen ? "Abierto" : "Cerrado"}
            </span>
            <span className="text-xs text-gray-500">
              {isOpen ? "Ahora" : "Ahora"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
            <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">
                {place.formattedAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <a
          href={place.googleMapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98]"
        >
          <Navigation className="h-4 w-4" />
          Cómo llegar
        </a>
      </div>
    </div>
  );
}
