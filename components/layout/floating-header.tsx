"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { PlaceAutocomplete } from "@/features/discovery/components/place-autocomplete";
import { PlaceData } from "@/types/location";

type Props = {
  onLocationChangeAction: (place: PlaceData) => void; // Recibimos la función maestra
};

export function FloatingHeader({ onLocationChangeAction }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-white/95 p-1.5 pl-5 shadow-lg backdrop-blur-md transition-all hover:bg-white pointer-events-auto border border-gray-200/50">
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer flex items-center gap-2.5 pr-4 border-r border-gray-200 hover:opacity-70 transition-opacity"
          >
            <MapPin className="h-4 w-4 text-red-500 fill-red-500" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-gray-800 leading-none">
                Cambiar ubicación
              </span>
            </div>
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
