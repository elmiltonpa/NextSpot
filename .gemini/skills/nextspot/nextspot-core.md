# NextSpot Engineering Standards

## 1. Stack Tecnológico
- **Framework:** Next.js 14+ (App Router). Usa siempre `app/` directory, Server Components por defecto.
- **Estilos:** Tailwind CSS. Usa `cn()` (clsx + tailwind-merge) para clases condicionales.
- **Iconos:** Lucide React (`import { MapPin } from 'lucide-react'`).

## 2. Reglas de Google Maps (@vis.gl/react-google-maps)
- **Librería:** USAMOS EXCLUSIVAMENTE `@vis.gl/react-google-maps`.
- **Prohibido:** No uses `react-google-maps` (la librería vieja) ni `window.google.maps` directamente si el componente lo soporta.
- **Componentes:**
  - Usa `<APIProvider>` en el root o layout.
  - Usa `<Map>` para el mapa visual.
  - Usa `<AdvancedMarker>` para marcadores (no uses `Marker` legacy).
- **Hooks:** Usa `useMap()` y `useMapsLibrary()` para acceder a la instancia del mapa.

## 3. Manejo de Estado
- Prefiere URL Search Params (`useSearchParams`) para estado compartible (ej: coordenadas seleccionadas) antes que `useState`.
