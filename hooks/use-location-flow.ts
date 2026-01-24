import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useLocation } from "@/context/location-context";
import { PlaceData } from "@/types/location";

export type LocationStatus = "loading" | "error" | "success";

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

      setUserLocation({ lat, lng });

      setStatus("success");
    },
    [setUserLocation],
  );

  return {
    status,
    setStatus,
    handleLocationSelect,
  };
}
