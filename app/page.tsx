"use client";

import { useState, useEffect, useCallback } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Loader2 } from "lucide-react";
import MapView from "@/components/map/map-view";
import { BottomSheet } from "@/features/discovery";
import { FloatingHeader } from "@/components/layout/floating-header";
import { PlaceAutocomplete } from "@/features/discovery/components/place-autocomplete";
import { LocationState, PlaceData } from "@/types/location";
import { toast } from "sonner";

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

export default function Home() {
  // Estado unificado para evitar múltiples setState
  const [locationState, setLocationState] = useState<LocationState>({
    status: "loading",
  });

  useEffect(() => {
    // Flag para evitar actualizar estado si el componente se desmonta
    let cancelled = false;

    if (!navigator.geolocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Necesario para detectar soporte de geolocation
      if (!cancelled) setLocationState({ status: "error" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!cancelled) {
          setLocationState({
            status: "success",
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        }
      },
      () => {
        if (!cancelled) setLocationState({ status: "error" });
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const handleManualLocation = useCallback((place: PlaceData) => {
    const { lat, lng } = place.location;
    if (!isNaN(lat) && !isNaN(lng)) {
      setLocationState({ status: "success", coords: { lat, lng } });
    } else {
      toast.error("No se pudo obtener las coordenadas del lugar seleccionado");
    }
  }, []);

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <main className="relative h-screen w-full overflow-hidden bg-gray-100">
        {/* ESCENARIO 1: Cargando... */}
        {locationState.status === "loading" && (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Buscando tu ubicación...</span>
          </div>
        )}

        {/* ESCENARIO 2: Falló la geo (Modo Manual) */}
        {locationState.status === "error" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 text-center">
            <div className="w-full max-w-md">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                ¿Dónde estás?
              </h2>
              <p className="mb-8 text-gray-600 text-base">
                No pudimos detectarte automáticamente. Escribe tu ubicación para
                empezar a explorar.
              </p>
              <div className="mb-6">
                <PlaceAutocomplete onPlaceSelect={handleManualLocation} />
              </div>
              <p className="text-xs text-gray-500">
                Selecciona una ciudad de las sugerencias
              </p>
            </div>
          </div>
        )}

        {/* ESCENARIO 3: Éxito (Mostramos la App completa) */}
        {locationState.status === "success" && (
          <>
            {/* Le pasamos la ubicación al mapa */}
            <MapView center={locationState.coords} />

            <FloatingHeader />

            {/* Pasamos la ubicación al BottomSheet para el botón Surprise */}
            <BottomSheet userLocation={locationState.coords} />
          </>
        )}
      </main>
    </APIProvider>
  );
}
