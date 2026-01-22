"use client";

import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { PlaceData } from "@/types/location";
import {
  GooglePlaceAutocompleteObject,
  GooglePlaceAutocompleteResult,
  PlacesSelectEvent,
  GMPSelectEvent,
} from "@/types/places";

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: PlaceData) => void;
}

export function PlaceAutocomplete({ onPlaceSelect }: PlaceAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !containerRef.current) {
      return;
    }

    const inputElement = containerRef.current.querySelector(
      "gmp-place-autocomplete",
    ) as HTMLElement;
    if (!inputElement) {
      console.error("Place autocomplete element not found");
      return;
    }

    // Esta función maneja la lógica de extracción de datos
    const processPlace = async (
      placeObj: GooglePlaceAutocompleteObject,
    ) => {
      try {
        // 1. Si es una predicción, la convertimos a Place
        let place: GooglePlaceAutocompleteResult = placeObj as unknown as GooglePlaceAutocompleteResult;
        if (placeObj.toPlace) {
          place = placeObj.toPlace();
        }

        // 2. Pedimos los datos
        await place.fetchFields({
          fields: ["displayName", "formattedAddress", "location"],
        });

        // 3. Extraemos coordenadas
        const lat = place.location?.lat();
        const lng = place.location?.lng();

        if (lat && lng) {
          onPlaceSelect({
            location: { lat, lng },
            name: place.displayName,
            formatted_address: place.formattedAddress,
          });
        } else {
          console.warn("Place selected has no coordinates");
        }
      } catch (err) {
        console.error("Error processing place:", err);
      }
    };

    // LISTENER 1: El estándar documentado para Autocomplete
    const handlePlacesSelect = (event: Event) => {
      const customEvent = event as PlacesSelectEvent;
      if (customEvent.detail?.place) {
        processPlace(customEvent.detail.place);
      }
    };

    // LISTENER 2: El que mencionaba tu snippet (por seguridad)
    const handleGmpSelect = (event: Event) => {
      const customEvent = event as GMPSelectEvent;
      if (customEvent.placePrediction) {
        processPlace(customEvent.placePrediction);
      } else if (customEvent.detail?.place) {
        processPlace(customEvent.detail.place);
      }
    };

    // Agregamos ambos para no fallar
    inputElement.addEventListener("gmp-places-select", handlePlacesSelect);
    inputElement.addEventListener("gmp-select", handleGmpSelect);

    return () => {
      inputElement.removeEventListener("gmp-places-select", handlePlacesSelect);
      inputElement.removeEventListener("gmp-select", handleGmpSelect);
    };
  }, [placesLib, onPlaceSelect]);

  return (
    <div ref={containerRef} className="w-full max-w-sm mx-auto relative z-50">
      <gmp-place-autocomplete></gmp-place-autocomplete>
    </div>
  );
}
