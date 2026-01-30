"use client";

import { PlaceResult } from "@/types/places";
import { Coordinates } from "@/types/location";
import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type LocationContextType = {
  userLocation: Coordinates | null;
  setUserLocation: (coords: Coordinates) => void;

  selectedPlace: PlaceResult | null;
  setSelectedPlace: (place: PlaceResult | null) => void;

  isWinnerModalOpen: boolean;
  setIsWinnerModalOpen: (open: boolean) => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);

  const value = useMemo(
    () => ({
      userLocation,
      setUserLocation,
      selectedPlace,
      setSelectedPlace,
      isWinnerModalOpen,
      setIsWinnerModalOpen,
    }),
    [userLocation, selectedPlace, isWinnerModalOpen],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
