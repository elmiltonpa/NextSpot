"use client";

import { useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Loader2 } from "lucide-react";
import MapView from "@/components/map/map-view";
import { DiscoverySidebar } from "@/features/discovery";
import { FloatingHeader } from "@/components/layout/floating-header";
import { PlaceAutocomplete } from "@/features/discovery/components/place-autocomplete";
import { useLocation } from "@/context/location-context";
import { useLocationFlow } from "@/hooks/use-location-flow";

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

export default function Home() {
  const { userLocation } = useLocation();
  const { status, setStatus, handleLocationSelect, tryRecoverFromStorage } =
    useLocationFlow();

  useEffect(() => {
    const handleGeoError = () => {
      // Si falla la geo, intentamos recuperar del storage antes de rendirnos
      const recovered = tryRecoverFromStorage();
      if (!recovered) {
        setStatus("error");
      }
    };

    if (!navigator.geolocation) {
      handleGeoError();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationSelect({
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          name: "Mi ubicación",
          formatted_address: "",
        });
      },
      () => handleGeoError(),
    );
  }, [setStatus, handleLocationSelect, tryRecoverFromStorage]);

  return (
    <APIProvider apiKey={API_KEY} libraries={["places"]}>
      <main className="relative h-screen w-full overflow-hidden bg-gray-100">
        {/* ESCENARIO 1: Cargando... */}
        {status === "loading" && (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Buscando tu ubicación...</span>
          </div>
        )}

        {/* ESCENARIO 2: Falló la geo (Modo Manual) */}
        {status === "error" && (
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
                <PlaceAutocomplete onPlaceSelect={handleLocationSelect} />
              </div>
            </div>
          </div>
        )}

        {/* ESCENARIO 3: Éxito */}
        {status === "success" && (
          <>
            <MapView />

            <FloatingHeader onLocationChangeAction={handleLocationSelect} />

            <DiscoverySidebar userLocation={userLocation} />
          </>
        )}
      </main>
    </APIProvider>
  );
}
