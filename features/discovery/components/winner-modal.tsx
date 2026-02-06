"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Navigation, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceResult } from "@/types/places";
import { useLocation } from "@/context/location-context";

interface WinnerModalProps {
  place: PlaceResult;
}

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

export function WinnerModal({ place }: WinnerModalProps) {
  const { setIsWinnerModalOpen } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsWinnerModalOpen(false), 300);
  };

  const photoName = place.photos?.[0]?.name;
  const photoUrl = photoName
    ? `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxHeightPx=800&maxWidthPx=800`
    : null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      <div
        className={`relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-10"}`}
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-br from-orange-400 to-red-500 z-0" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center pt-8 px-6 pb-8">
          <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 bg-gray-100 shrink-0">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={place.displayName.text}
                fill
                className="object-cover"
                sizes="128px"
                priority
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-orange-100 text-orange-400">
                <MapPin className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="text-center space-y-1 mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide mb-2">
              ¡Es un match!
            </span>
            <h2 className="text-2xl font-black text-gray-900 leading-tight">
              {place.displayName.text}
            </h2>
            <p className="text-gray-500 font-medium text-sm truncate max-w-70">
              {place.primaryTypeDisplayName?.text || "Lugar interesante"}
            </p>
          </div>

          <div className="flex items-center gap-6 mb-8 text-sm">
            {place.rating && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 font-bold text-gray-900 text-lg">
                  {place.rating}{" "}
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="text-gray-400 text-xs">Rating</span>
              </div>
            )}
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span
                className={`font-bold text-lg ${place.currentOpeningHours?.openNow ? "text-green-500" : "text-red-400"}`}
              >
                {place.currentOpeningHours?.openNow ? "Abierto" : "Cerrado"}
              </span>
              <span className="text-gray-400 text-xs">Estado</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <a
              href={place.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
            >
              <Navigation className="h-5 w-5" />
              ¡Vamos ahí!
            </a>

            <button
              onClick={handleClose}
              className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-100 hover:border-orange-100 hover:bg-orange-50 text-gray-700 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98]"
            >
              Ver en el mapa
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
