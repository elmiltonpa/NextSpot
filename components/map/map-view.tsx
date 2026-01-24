"use client";

import { useEffect } from "react";
import { Map, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useLocation } from "@/contexts/location-context";

// interface MapViewProps {
//   center: { lat: number; lng: number } | null; // Aceptamos null por seguridad
// }

// Coordenadas por defecto (ej. Obelisco, BsAs) por si falla la geo
const DEFAULT_CENTER = { lat: -34.603722, lng: -58.381592 };

export default function MapView() {
  // Si center viene null, usamos el default.
  const { coords, setCoords } = useLocation();

  const centerPosition = coords || DEFAULT_CENTER;

  return (
    <div className="h-full w-full">
      <Map
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={15}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId="DEMO_MAP_ID"
        className="h-full w-full"
        minZoom={3}
        maxZoom={20}
      >
        {/* Solo si tenemos un centro real (del usuario), activamos el actualizador */}
        <MapUpdater center={centerPosition} />
        <AdvancedMarker
          position={centerPosition}
          draggable={true}
          onDragEnd={(e) => {
            if (e.latLng) {
              setCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }
          }}
        />
      </Map>
    </div>
  );
}

// --- SUB-COMPONENTE ---
function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;

    map.panTo(center);
  }, [center, map]);

  return null;
}
