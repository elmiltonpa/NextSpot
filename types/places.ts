// Tipos para Google Places API

interface AuthorAttributions {
  displayName: string;
  uri: string;
  photoUrl: string;
}

export interface GooglePlacePhoto {
  name: string;
  widthPx: number;
  heightPx: number;
  authorAttributions?: AuthorAttributions[];
}

// Respuesta de Google Places API (New)
export interface GooglePlace {
  id: string;
  formattedAddress?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  displayName?: {
    text: string;
    languageCode: string;
  };
  currentOpeningHours?: {
    openNow: boolean;
    weekdayDescriptions?: string[];
  };
  photos?: GooglePlacePhoto[];
}

// Tipos para el componente PlaceAutocomplete (Google Maps JS API)
export interface GooglePlaceAutocompleteObject {
  toPlace?: () => GooglePlaceAutocompleteResult;
  [key: string]: unknown;
}

export interface GooglePlaceAutocompleteResult {
  displayName: string;
  formattedAddress: string;
  location?: {
    lat: () => number;
    lng: () => number;
  };
  fetchFields: (options: { fields: string[] }) => Promise<void>;
  [key: string]: unknown;
}

export interface PlacesSelectEvent extends Event {
  detail?: {
    place: GooglePlaceAutocompleteResult;
  };
}

export interface GMPSelectEvent extends Event {
  placePrediction?: GooglePlaceAutocompleteObject;
  detail?: {
    place: GooglePlaceAutocompleteResult;
  };
}

// Formato simplificado para nuestra app (respuesta de /api/places/nearby)
export interface NextSpotPlace {
  id: string;
  name: string;
  rating: number | null;
  user_ratings_total: number | null;
  address: string | null;
  location: {
    lat: number;
    lng: number;
  };
  open_now: boolean | null;
  photo_ref: string | null;
  maps_url: string;
}

