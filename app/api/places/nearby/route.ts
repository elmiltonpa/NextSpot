import { GooglePlace } from "@/types/places";
import { NextResponse } from "next/server";
// Definimos la Key de servidor (NO exponer NEXT_PUBLIC aquí)
const GOOGLE_MAPS_API_KEY = process.env.MAPS_API_KEY;
const GOOGLE_PLACES_URL =
  "https://places.googleapis.com/v1/places:searchNearby";

// GET: Maneja las peticiones de búsqueda
export async function GET(request: Request) {
  try {
    // 1. Obtener parámetros de la URL (Query Params)
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || "1000";
    const type = searchParams.get("type") || "restaurant";

    // Validación básica
    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Latitud y Longitud son requeridas" },
        { status: 400 },
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: "Error de configuración en el servidor" },
        { status: 500 },
      );
    }

    // 2. Construir el request body para la nueva Places API
    const requestBody = {
      includedTypes: [type],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          },
          radius: parseFloat(radius),
        },
      },
    };

    // 3. Llamar a Google Places API (New)
    const res = await fetch(GOOGLE_PLACES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.photos",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Google API Error:", data);
      throw new Error(
        `Google API Error: ${data.error?.message || res.statusText}`,
      );
    }

    // 4. Lógica de Negocio: Selección Aleatoria
    const places = data.places || [];
    const highRatedPlaces = places.filter((place: GooglePlace) =>
      place.rating && place.rating >= 4.0 && place.userRatingCount
        ? place.userRatingCount > 10
        : false,
    );

    const pool = highRatedPlaces.length > 0 ? highRatedPlaces : places;

    if (pool.length === 0) {
      return NextResponse.json({
        message: "No se encontraron lugares cercanos.",
      });
    }

    // EL FACTOR SORPRESA: Elegir 1 al azar
    const randomPlace = pool[Math.floor(Math.random() * pool.length)];

    // 5. Responder al Frontend SOLO con el ganador
    const simplifiedPlace = {
      id: randomPlace.id,
      name: randomPlace.displayName?.text || randomPlace.displayName,
      rating: randomPlace.rating,
      address: randomPlace.formattedAddress,
      location: randomPlace.location,
      priceLevel: randomPlace.priceLevel,
      open_now: randomPlace.currentOpeningHours?.openNow,
      photos: randomPlace.photos?.[0]?.name || null,
    };

    return NextResponse.json(simplifiedPlace);
  } catch (error) {
    console.error("Error en API places/nearby:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al buscar lugares" },
      { status: 500 },
    );
  }
}
