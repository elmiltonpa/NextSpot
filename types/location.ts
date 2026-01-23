// Tipos relacionados con ubicación y coordenadas

// Coordenadas siempre definidas - validar antes de crear
export interface Coordinates {
  lat: number;
  lng: number;
}

export type LocationState =
  | { status: "loading" }
  | { status: "success"; coords: Coordinates }
  | { status: "error" };

// Tipo para datos de lugar seleccionado (autocomplete, manual, etc.)
export interface PlaceData {
  location: Coordinates;
  name: string;
  formatted_address: string;
}
