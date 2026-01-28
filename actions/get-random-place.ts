"use server";

import { PlaceResult } from "@/types/places";

const PLACE_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.priceLevel",
  "places.rating",
  "places.userRatingCount",
  "places.currentOpeningHours",
  "places.primaryTypeDisplayName",
  "places.photos",
  "places.googleMapsUri",
  "places.location",
];

export async function getRandomPlace(
  lat: number,
  lng: number,
  priceLevels: string[] = [],
  includedTypes: string[] = ["restaurant"],
  radius: number,
  openNow: boolean | null = null,
) {
  const apiKey = process.env.MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Error de servidor: Falta la API Key de Google Maps.");
  }

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACE_FIELDS.join(","),
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: radius,
          },
        },
        includedTypes: includedTypes,
        maxResultCount: 20,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al comunicarse con Google Maps.");
    }

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return {
        error: "No encontramos lugares con esos filtros cerca de ti.",
      };
    }

    let candidates = data.places as PlaceResult[];

    if (openNow !== null) {
      candidates = candidates.filter((place) => {
        const isOpen = place.currentOpeningHours?.openNow;
        return openNow ? isOpen : !isOpen;
      });
    }

    if (candidates.length === 0) {
      return {
        error: openNow
          ? "No hay lugares abiertos en este momento con esos filtros."
          : "No se encontraron lugares que coincidan con los filtros.",
      };
    }

    if (priceLevels.length > 0) {
      const priceFiltered = candidates.filter(
        (place) => place.priceLevel && priceLevels.includes(place.priceLevel),
      );

      if (priceFiltered.length > 0) {
        candidates = priceFiltered;
      }
    }

    const winner = candidates[Math.floor(Math.random() * candidates.length)];

    return winner;
  } catch (error) {
    console.error("Server Action Error:", error);
    return { error: "Ocurrió un error inesperado al buscar tu lugar." };
  }
}
