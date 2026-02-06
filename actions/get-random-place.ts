"use server";

import { PlaceResult } from "@/types/places";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

export const getRandomPlace = async (
  lat: number,
  lng: number,
  priceLevels: string[] = [],
  includedTypes: string[] = ["restaurant"],
  radius: number,
  openNow: boolean | null = null,
) => {
  const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Error de servidor: Falta la API Key de Google Maps (NEXT_PUBLIC_PLACES_API_KEY).",
    );
  }

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  try {
    const session = await auth();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACE_FIELDS.join(","),
        Referer: process.env.NEXTAUTH_URL || "http://localhost:3000",
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
      const errorData = await response.json().catch(() => ({}));
      console.error("Google Maps API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      throw new Error(
        `Error de Google Maps: ${response.status} ${response.statusText}`,
      );
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

    try {
      if (session) {
        const userId = session.user.id;
        await prisma.searchHistory.create({
          data: {
            userId: userId,
            googlePlaceId: winner.id,
            name: winner.displayName.text,
            address: winner.formattedAddress,
            image: winner.photos?.[0].name || null,
          },
        });
      }
    } catch {}

    return winner;
  } catch (error) {
    console.error("getRandomPlace Error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al buscar tu lugar.",
    };
  }
};
