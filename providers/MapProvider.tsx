"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { ReactNode } from "react";

export function MapProvider({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;

  if (!apiKey) {
    return <div>Error: Falta la API Key en .env.local</div>;
  }

  return <APIProvider apiKey={apiKey}>{children}</APIProvider>;
}
