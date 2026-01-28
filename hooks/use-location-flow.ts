import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useLocation } from "@/context/location-context";
import { PlaceData } from "@/types/location";

export type LocationStatus = "loading" | "error" | "success";

const STORAGE_KEY = "nextspot_user_location";

export function useLocationFlow() {
  const [status, setStatus] = useState<LocationStatus>("loading");

  const { setUserLocation } = useLocation();

  const handleLocationSelect = useCallback(
    (place: PlaceData) => {
      const { lat, lng } = place.location;

      if (isNaN(lat) || isNaN(lng)) {
        toast.error("Ubicación inválida");
        return;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lng }));
      } catch (error) {
        console.error("Failed to save location to storage:", error);
      }

      setUserLocation({ lat, lng });

      setStatus("success");
    },
    [setUserLocation],
  );

  const tryRecoverFromStorage = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { lat, lng } = JSON.parse(stored);
        if (!isNaN(lat) && !isNaN(lng)) {
          setUserLocation({ lat, lng });
          setStatus("success");
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to recover location from storage:", error);
    }
    return false;
  }, [setUserLocation]);

  return {
    status,
    setStatus,
    handleLocationSelect,
    tryRecoverFromStorage,
  };
}
