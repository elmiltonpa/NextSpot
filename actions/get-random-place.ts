"use server";

import { PlaceResult } from "@/types/places";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PRICE_LEVEL_MAPPING } from "@/constants/categories";

const PLACE_FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.priceLevel",
  "places.rating",
  "places.userRatingCount",
  "places.currentOpeningHours",
  "places.primaryTypeDisplayName",
  "places.primaryType",
  "places.types",
  "places.photos",
  "places.googleMapsUri",
  "places.location",
];

const ALWAYS_EXCLUDED_PRIMARY_TYPES = [
  "lodging",
  "hotel",
  "motel",
  "resort_hotel",
  "extended_stay_hotel",
  "guest_house",
  "hostel",
  "bed_and_breakfast",
  "campground",
  "rv_park",
  "gas_station",
  "car_dealer",
  "car_repair",
  "car_wash",
  "parking",
  "transit_station",
  "hospital",
  "dentist",
  "doctor",
  "pharmacy",
  "school",
  "university",
  "church",
  "mosque",
  "synagogue",
  "hindu_temple",
  "funeral_home",
  "cemetery",
  "courthouse",
  "police",
  "fire_station",
  "post_office",
  "storage",
  "moving_company",
];

function weightedRandomSelect(candidates: PlaceResult[]): PlaceResult {
  if (candidates.length === 1) return candidates[0];

  const weights = candidates.map((place) => {
    const rating = place.rating ?? 3.0;
    const reviewCount = place.userRatingCount ?? 0;

    const ratingWeight = Math.max(0.5, rating / 2.5);
    const reviewWeight = Math.log10(Math.max(reviewCount, 1) + 1);
    const randomFactor = 0.5 + Math.random();

    return ratingWeight * reviewWeight * randomFactor;
  });

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < candidates.length; i++) {
    random -= weights[i];
    if (random <= 0) return candidates[i];
  }

  return candidates[candidates.length - 1];
}

export const getRandomPlace = async (
  lat: number,
  lng: number,
  priceLevels: string[] = [],
  includedPrimaryTypes: string[] = ["restaurant"],
  excludedPrimaryTypes: string[] = [],
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

    const finalExcludedTypes = [
      ...new Set([...ALWAYS_EXCLUDED_PRIMARY_TYPES, ...excludedPrimaryTypes]),
    ].filter((type) => !includedPrimaryTypes.includes(type));

    const requestBody: Record<string, unknown> = {
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radius,
        },
      },
      includedPrimaryTypes: includedPrimaryTypes,
      excludedPrimaryTypes: finalExcludedTypes,
      maxResultCount: 20,
      languageCode: "es",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": PLACE_FIELDS.join(","),
        Referer: process.env.NEXTAUTH_URL || "http://localhost:3000",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google Maps API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        requestBody,
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
      const googlePriceLevels = priceLevels
        .map((level) => PRICE_LEVEL_MAPPING[level])
        .filter(Boolean);

      if (googlePriceLevels.length > 0) {
        const priceFiltered = candidates.filter(
          (place) =>
            place.priceLevel && googlePriceLevels.includes(place.priceLevel),
        );

        if (priceFiltered.length > 0) {
          candidates = priceFiltered;
        }
      }
    }

    if (candidates.length > 3) {
      const qualityFiltered = candidates.filter((place) => {
        if (!place.rating) return true;
        return place.rating >= 3.0;
      });

      if (qualityFiltered.length > 0) {
        candidates = qualityFiltered;
      }
    }

    const winner = weightedRandomSelect(candidates);

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
