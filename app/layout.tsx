import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MapProvider } from "../providers/MapProvider";
import { Toaster } from "sonner";
import { LocationProvider } from "@/context/location-context";
import { AuthProvider } from "@/providers/AuthProvider";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://nextspot.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "NextSpot - Descubre restaurantes, bares y lugares cerca de ti",
    template: "%s | NextSpot",
  },
  description:
    "Encontra el lugar perfecto para comer, tomar algo o pasear cerca tuyo. NextSpot te recomienda restaurantes, bares, cafeterías y lugares al aire libre según tu ubicación. Probá suerte y descubrí tu próximo spot favorito.",
  keywords: [
    "restaurantes cerca de mi",
    "bares cerca de mi",
    "donde comer",
    "donde comer cerca de mi",
    "lugares para comer",
    "buscar restaurantes",
    "buscar lugares para comer",
    "cafeterias cerca",
    "heladerias cerca de mi",
    "panaderias cerca de mi",
    "lugares para salir",
    "descubrir lugares",
    "nextspot",
    "recomendacion de restaurantes",
    "que comer hoy",
    "donde ir a comer",
  ],
  authors: [{ name: "NextSpot" }],
  creator: "NextSpot",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: BASE_URL,
    siteName: "NextSpot",
    title: "NextSpot - Descubre restaurantes, bares y lugares cerca de ti",
    description:
      "Encontra el lugar perfecto para comer, tomar algo o pasear cerca tuyo. Te recomendamos restaurantes, bares, cafeterías y más según tu ubicación.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextSpot - Descubre restaurantes, bares y lugares cerca de ti",
    description:
      "Encontra el lugar perfecto para comer, tomar algo o pasear cerca tuyo. Te recomendamos restaurantes, bares, cafeterías y más según tu ubicación.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "cyhjRkYU-BTDi7jrXHPDeob1KazD8W3iZpUk8yDOP20",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NextSpot",
  url: BASE_URL,
  description:
    "Encontra el lugar perfecto para comer, tomar algo o pasear cerca tuyo. NextSpot te recomienda restaurantes, bares, cafeterías y lugares al aire libre según tu ubicación.",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  inLanguage: "es",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider session={session}>
          <LocationProvider>
            <MapProvider>{children}</MapProvider>
            <Toaster position="top-center" richColors closeButton />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
