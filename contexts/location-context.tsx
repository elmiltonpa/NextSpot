"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";

type LocationCoords = {
  lat: number;
  lng: number;
};

type LocationContextType = {
  coords: LocationCoords;
  setCoords: (coords: LocationCoords) => void;
};

const LocationContext = createContext<LocationContextType | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  // Nota: Estas coordenadas por defecto son del Obelisco en BA.
  // Quizás quieras iniciar en null o 0,0 si prefieres esperar al GPS del usuario.
  const [coords, setCoords] = useState<LocationCoords>({
    lat: -34.603722,
    lng: -58.381592,
  });

  const value = useMemo(
    () => ({
      coords,
      setCoords,
    }),
    [coords],
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
