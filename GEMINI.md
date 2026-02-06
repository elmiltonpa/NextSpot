# NextSpot - Discovery Engine

NextSpot is a modern web application designed to help users discover interesting places nearby. It provides a map-based interface, location-based search, and the ability to save favorite spots and view search history.

## Project Overview

- **Purpose**: A "Discovery Engine" for finding and exploring local places.
- **Architecture**: Next.js App Router with a feature-sliced approach (modular components in `features/`).
- **Framework**: [Next.js](https://nextjs.org/) (v15+)
- **Frontend**: React (v19), Tailwind CSS (v4), Lucide React (icons), Sonner (toasts).
- **Backend**: Next.js Server Actions, NextAuth.js (v5 Beta) for authentication.
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/).
- **Maps Integration**: Google Maps API via `@vis.gl/react-google-maps`.

## Building and Running

### Prerequisites
- Node.js (v20+)
- pnpm (recommended)
- PostgreSQL database
- Google Maps API Key (with Places and Maps JavaScript API enabled)

### Setup
1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Set up environment variables in a `.env` file (refer to `next.config.ts` or `prisma/schema.prisma` for requirements):
   - `DATABASE_URL`: PostgreSQL connection string.
   - `AUTH_SECRET`: Secret for NextAuth.
   - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`: Google OAuth credentials.
   - `NEXT_PUBLIC_PLACES_API_KEY`: Google Maps API Key.
3. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Development
Run the development server:
```bash
pnpm dev
```

### Production
Build and start the application:
```bash
pnpm build
pnpm start
```

## Development Conventions

### Directory Structure
- `app/`: Next.js App Router pages and layouts.
- `features/`: Modularized business logic and components (e.g., `features/discovery/`).
- `components/`: Shared UI components organized by domain.
- `actions/`: Server Actions for database mutations and external API calls.
- `lib/`: Core configuration (Prisma, Auth) and shared utility functions.
- `hooks/`: Custom React hooks for shared logic.
- `context/`: React Context providers for global state (e.g., location).
- `types/`: TypeScript definitions and interfaces.

### Coding Style
- **TypeScript**: Use strict typing. Define interfaces in the `types/` directory or locally if specific to a component.
- **Server Actions**: Prefer Server Actions for data fetching and mutations that interact with the database.
- **Authentication**: Use `auth()` from `@/lib/auth` for server-side session checks and `useSession()` for client-side.
- **Styling**: Use Tailwind CSS 4 utility classes. Use `cn` (from `@/lib/utils`) for conditional class merging.
- **Database**: Access the database through the Prisma client in `@/lib/prisma`. Note that the Prisma client is generated into `@/lib/generated/prisma`.

### Location & Maps
- The application relies heavily on the `LocationProvider` (`context/location-context.tsx`) to manage the user's current coordinates and selected places.
- Map interactions should be handled within the `MapView` component or via hooks like `useLocationFlow`.
