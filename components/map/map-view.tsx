"use client";

import { useEffect } from "react";
import { Map, useMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useLocation } from "@/context/location-context";

const DEFAULT_CENTER = { lat: -34.603722, lng: -58.381592 };

export default function MapView() {
  const { userLocation, setUserLocation, selectedPlace } = useLocation();

  const centerPosition = userLocation || DEFAULT_CENTER;
  const selectedPosition = selectedPlace
    ? {
        lat: selectedPlace.location.latitude,
        lng: selectedPlace.location.longitude,
      }
    : null;

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
        <MapUpdater center={centerPosition} />
        <AdvancedMarker
          position={centerPosition}
          draggable={true}
          onDragEnd={(e) => {
            if (e.latLng) {
              setUserLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }
          }}
        />

        {selectedPlace && (
          <>
            <AdvancedMarker
              position={selectedPosition}
              title={selectedPlace.name}
            >
              <Pin
                background={"#3b82f6"}
                borderColor={"#1d4ed8"}
                glyphColor={"#ffffff"}
                scale={1.2}
              />
            </AdvancedMarker>
          </>
        )}
      </Map>
    </div>
  );
}

function MapUpdater({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;

    map.panTo(center);
  }, [center, map]);

  return null;
}
