"use client";

import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { toast } from "sonner";
import { PlaceData } from "@/types/location";
import { GMPSelectEvent } from "@/types/places";

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceData) => void;
}

export function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const placeRef = useRef<google.maps.places.PlaceAutocompleteElement>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !placeRef.current) {
      return;
    }

    const element = placeRef.current;

    const handleSelect = async (event: Event) => {
      const customEvent = event as GMPSelectEvent;
      const place = customEvent.placePrediction;

      if (!place?.toPlace) {
        toast.error("No se pudo obtener información del lugar seleccionado");
        return;
      }

      try {
        const dataPlace = place.toPlace();
        await dataPlace.fetchFields({
          fields: ["displayName", "formattedAddress", "location"],
        });

        const lat = dataPlace.location?.lat();
        const lng = dataPlace.location?.lng();

        if (lat !== undefined && lng !== undefined) {
          onPlaceSelect({
            name: dataPlace.displayName ?? "",
            formatted_address: dataPlace.formattedAddress ?? "",
            location: { lat, lng },
          });
        }
      } catch {
        toast.error("Error al obtener los detalles del lugar");
      }
    };

    element.addEventListener("gmp-select", handleSelect);

    return () => {
      element.removeEventListener("gmp-select", handleSelect);
    };
  }, [placesLib, onPlaceSelect]);

  if (!placesLib) {
    return (
      <div className="w-full max-w-sm mx-auto h-10 bg-gray-200 rounded-md animate-pulse" />
    );
  }

  return (
    <gmp-place-autocomplete
      ref={placeRef}
      className="w-full max-w-sm mx-auto block rounded-full border-2 border-gray-200 px-4 py-2 focus-within:border-blue-500 transition-colors shadow-sm"
    />
  );
}
