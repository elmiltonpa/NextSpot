"use server";

import { PlaceResult } from "@/types/places";

const PLACE_FIELDS = [
  "id",
  "displayName",
  "formattedAddress",
  "priceLevel",
  "rating",
  "userRatingCount",
  "currentOpeningHours",
  "primaryTypeDisplayName",
  "photos",
  "googleMapsUri",
  "location",
];

export async function getPlaceDetails(placeId: string): Promise<PlaceResult | { error: string }> {
  const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;

  if (!apiKey) {
    return { error: "Falta la API Key (NEXT_PUBLIC_PLACES_API_KEY)" };
  }

  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${PLACE_FIELDS.join(",")}&key=${apiKey}&languageCode=es`;

  try {
    const response = await fetch(url, {
      headers: {
        "Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
      }
    });
    
    if (!response.ok) {
      throw new Error("Error al obtener detalles del lugar");
    }

    const data = await response.json();
    return data as PlaceResult;
  } catch (error) {
    console.error("Get Place Details Error:", error);
    return { error: "No se pudieron cargar los detalles del lugar" };
  }
}
