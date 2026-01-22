"use client";

import { useEffect } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";

interface MapViewProps {
  center: { lat: number; lng: number } | null; // Aceptamos null por seguridad
}

// Coordenadas por defecto (ej. Obelisco, BsAs) por si falla la geo
const DEFAULT_CENTER = { lat: -34.603722, lng: -58.381592 };

export default function MapView({ center }: MapViewProps) {
  // Si center viene null, usamos el default.
  const initialCenter = center || DEFAULT_CENTER;

  return (
    <div className="h-full w-full">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={15}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId="DEMO_MAP_ID"
        className="h-full w-full"
        minZoom={3}
        maxZoom={20}
      >
        {/* Solo si tenemos un centro real (del usuario), activamos el actualizador */}
        {center && <MapUpdater center={center} />}
      </Map>
    </div>
  );
}

// --- SUB-COMPONENTE ---
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;

    // Verificamos que las coordenadas sean números válidos antes de mover
    if (typeof center.lat === "number" && typeof center.lng === "number") {
      map.panTo(center);
    }
  }, [center, map]);

  return null;
}
