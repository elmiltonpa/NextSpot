// src/actions/get-random-place.ts
"use server";

import { AuthorAttributions } from "@/types/places";

// Definimos la interfaz de lo que devuelve Google para tener tipado estricto
export interface PlaceResult {
  name: string; // Es el ID del recurso en la API v1
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  priceLevel?: string; // "PRICE_LEVEL_MODERATE", etc.
  rating?: number;
  userRatingCount?: number;
  currentOpeningHours?: { openNow: boolean };
  primaryTypeDisplayName?: { text: string };
  photos?: { name: string; authorAttributions: AuthorAttributions[] }[];
  googleMapsUri: string;
  location: { latitude: number; longitude: number };
}

// Estos son los campos exactos que le pedimos a Google (Field Masking)
// ¡Importante para NO pagar de más por datos que no usamos!
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
  priceLevels: string[] = [], // Ej: ["PRICE_LEVEL_INEXPENSIVE"]
  includedTypes: string[] = ["restaurant"], // Ej: ["restaurant", "park"]
  radius: number, // PUEDE SER 1KM, 5KM O 10KM
) {
  const apiKey = process.env.MAPS_API_KEY;

  if (!apiKey) {
    throw new Error("Error de servidor: Falta la API Key de Google Maps.");
  }

  // URL de la "New Places API"
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
        error: "No encontramos lugares con esos filtros cerca de ti. 😔",
      };
    }

    let candidates = data.places as PlaceResult[];

    // --- FILTRADO EN MEMORIA (BACKEND) ---

    // 1. Filtro de "Abierto Ahora" (Opcional pero recomendado para UX)
    // Filtramos para que no mande a un lugar cerrado.
    candidates = candidates.filter(
      (place) => place.currentOpeningHours?.openNow,
    );

    // Si nos quedamos sin candidatos por filtrar "Open Now", volvemos al pool original
    // (A veces es mejor mostrar un lugar cerrado que un error)
    if (candidates.length === 0) {
      candidates = data.places;
    }

    // 2. Filtro de Precio (Si el usuario seleccionó alguno)
    if (priceLevels.length > 0) {
      const priceFiltered = candidates.filter(
        (place) => place.priceLevel && priceLevels.includes(place.priceLevel),
      );
      // Si el filtro de precio elimina todo, mantenemos los anteriores (fallback)
      if (priceFiltered.length > 0) {
        candidates = priceFiltered;
      }
    }

    // --- SELECCIÓN ALEATORIA ---

    // Elegimos UN ganador del array final
    const winner = candidates[Math.floor(Math.random() * candidates.length)];

    return winner;
  } catch (error) {
    console.error("Server Action Error:", error);
    return { error: "Ocurrió un error inesperado al buscar tu lugar." };
  }
}
