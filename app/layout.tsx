import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MapProvider } from "../providers/MapProvider";
import { Toaster } from "sonner";
import { LocationProvider } from "@/context/location-context";
import { AuthProvider } from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextSpot",
  description: "Descubre lugares aleatorios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <LocationProvider>
            <MapProvider>{children}</MapProvider>
            <Toaster position="top-center" richColors />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
