"use client";

import { useEffect } from "react";
import { Map, useMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useLocation } from "@/context/location-context";
import { toast } from "sonner";

const DEFAULT_CENTER = { lat: -34.603722, lng: -58.381592 };
const OFFSET_X = -150;

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
        disableDoubleClickZoom={true}
        mapId="DEMO_MAP_ID"
        className="h-full w-full"
        minZoom={3}
        maxZoom={20}
        onDblclick={(e) => {
          if (e.detail.latLng) {
            const newCoords = {
              lat: e.detail.latLng.lat,
              lng: e.detail.latLng.lng,
            };
            setUserLocation(newCoords);

            try {
              localStorage.setItem(
                "nextspot_user_location",
                JSON.stringify(newCoords),
              );
            } catch {
              toast.error("No se pudo guardar la ubicación en este navegador");
            }
          }
        }}
      >
        <MapUpdater />
        <AdvancedMarker
          position={centerPosition}
          draggable={true}
          onDragEnd={(e) => {
            if (e.latLng) {
              const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
              setUserLocation(newCoords);

              try {
                localStorage.setItem(
                  "nextspot_user_location",
                  JSON.stringify(newCoords),
                );
              } catch {
                toast.error(
                  "No se pudo guardar la ubicación en este navegador",
                );
              }
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

export function MapUpdater() {
  const map = useMap();
  const { userLocation, selectedPlace } = useLocation();

  useEffect(() => {
    if (!map || !selectedPlace) return;

    map.panTo({
      lat: selectedPlace.location.latitude,
      lng: selectedPlace.location.longitude,
    });

    map.setZoom(18);

    setTimeout(() => {
      map.panBy(OFFSET_X, 0);
    }, 50);
  }, [map, selectedPlace]);

  useEffect(() => {
    if (!map || !userLocation) return;

    const zoom = 16;
    map.setZoom(zoom);

    const projection = map.getProjection();
    if (projection) {
      const scale = Math.pow(2, zoom);
      const userPoint = projection.fromLatLngToPoint(userLocation);

      const offsetWorld = OFFSET_X / scale;

      if (userPoint) {
        const newCenterPoint = new google.maps.Point(
          userPoint.x + offsetWorld,
          userPoint.y,
        );
        const newCenter = projection.fromPointToLatLng(newCenterPoint);
        if (newCenter) {
          map.panTo(newCenter);
          return;
        }
      }
    }

    map.panTo(userLocation);
    setTimeout(() => {
      map.panBy(OFFSET_X, 0);
    }, 50);
  }, [map, userLocation]);

  return null;
}
