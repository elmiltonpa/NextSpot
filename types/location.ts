export interface Coordinates {
  lat: number;
  lng: number;
}

export type LocationState =
  | { status: "loading" }
  | { status: "success"; coords: Coordinates }
  | { status: "error" };

export interface PlaceData {
  location: Coordinates;
  name: string;
  formatted_address: string;
}
