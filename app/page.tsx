"use client";

import { useEffect } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Loader2 } from "lucide-react";
import MapView from "@/components/map/map-view";
import { DiscoverySidebar } from "@/features/discovery";
import { FloatingHeader } from "@/components/layout/floating-header";
import { FloatingFooter } from "@/components/layout/floating-footer";
import { PlaceAutocomplete } from "@/features/discovery/components/place-autocomplete";
import { useLocation } from "@/context/location-context";
import { useLocationFlow } from "@/hooks/use-location-flow";
import { WinnerModal } from "@/features/discovery/components/winner-modal";
import { ProfileButton } from "@/components/layout/profile-button";

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

export default function Home() {
  const { userLocation, selectedPlace, isWinnerModalOpen } = useLocation();
  const { status, setStatus, handleLocationSelect, tryRecoverFromStorage } =
    useLocationFlow();

  useEffect(() => {
    const handleGeoError = () => {
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
        {status === "loading" && (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2">Buscando tu ubicación...</span>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6 text-center">
            <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
              <div className="-mt-20 mb-16 text-center select-none">
                <h1 className="text-6xl font-black text-orange-500 tracking-tighter drop-shadow-2xl">
                  NextSpot
                </h1>
                <p className="text-[10px] font-bold text-orange-500/40 uppercase tracking-[0.4em] mt-2 ml-1">
                  Discovery Engine
                </p>
              </div>

              <h2 className="mb-3 text-3xl font-black text-white tracking-tight">
                ¿Dónde estás?
              </h2>
              <p className="mb-10 text-slate-400 text-base leading-relaxed px-8">
                Para mostrarte los mejores lugares cerca tuyo, necesitamos saber
                tu ubicación.
              </p>

              <div className="mb-8 transition-transform">
                <PlaceAutocomplete onPlaceSelect={handleLocationSelect} />
              </div>

              <button
                onClick={() =>
                  handleLocationSelect({
                    location: { lat: -34.603722, lng: -58.381592 },
                    name: "Obelisco, Buenos Aires",
                    formatted_address: "Av. 9 de Julio s/n, C1043 Buenos Aires",
                  })
                }
                className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500 transition-all cursor-pointer uppercase tracking-widest"
              >
                <span>Prefiero no compartir mi ubicación</span>
                <div className="h-px w-0 bg-orange-500 transition-all group-hover:w-4" />
              </button>
            </div>
          </div>
        )}

        {status === "success" && (
          <>
            <MapView />

            <FloatingHeader onLocationChangeAction={handleLocationSelect} />
            <ProfileButton />

            <DiscoverySidebar userLocation={userLocation} />

            <FloatingFooter />

            {isWinnerModalOpen && selectedPlace && (
              <WinnerModal place={selectedPlace} />
            )}
          </>
        )}
      </main>
    </APIProvider>
  );
}
