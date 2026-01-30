"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { PlaceAutocomplete } from "@/features/discovery/components/place-autocomplete";
import { PlaceData } from "@/types/location";
import { useLocation } from "@/context/location-context";

type Props = {
  onLocationChangeAction: (place: PlaceData) => void;
};

export function FloatingHeader({ onLocationChangeAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userLocation } = useLocation();
  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="flex items-center rounded-full bg-white/95 p-0.5 shadow-lg backdrop-blur-md transition-all hover:bg-white pointer-events-auto border border-gray-200/50">
          <button
            className="group flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            title="Ir a mi ubicación"
            onClick={() =>
              onLocationChangeAction({
                location: userLocation || { lat: 0, lng: 0 },
                formatted_address: "Mi ubicación",
                name: "Mi ubicación",
              })
            }
          >
            <MapPin className="h-4 w-4 text-red-500 fill-red-500 transition-transform group-active:scale-90" />
          </button>

          <div className="h-4 w-px bg-gray-200 mx-1" />

          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer flex items-center px-3 py-1 hover:opacity-70 transition-opacity"
          >
            <span className="text-sm font-bold text-gray-800 leading-none">
              Cambiar ubicación
            </span>
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-4 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">
              ¿A dónde vamos?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Busca una ciudad o dirección para mover el mapa.
            </p>

            <div className="w-full">
              <PlaceAutocomplete
                onPlaceSelect={(place) => {
                  onLocationChangeAction(place);
                  setIsModalOpen(false);
                }}
              />
            </div>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
}
